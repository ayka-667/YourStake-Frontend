<template>
    <div class="leaderboard">
        <div class="leaderboard-header">
            <div class="header-text">
                <div class="header-tag">
                    <UiIcon name="trophy" />
                    Weekly Race
                </div>
                <h1>
                    <img src="@/assets/img/icons/coin.svg" alt="coin" />
                    {{ leaderboardFormatValue(leaderboardGetPool) }}
                </h1>
                <p>Wager on any game to climb the race. The top 10 players share the prize pool when the timer ends.</p>
            </div>
            <div class="header-timer">
                <span class="timer-label">Ends in</span>
                <div class="timer-blocks">
                    <div v-for="(part, index) in leaderboardTimer.split(':')" v-bind:key="index" class="timer-block">
                        <span>{{ part }}</span>
                        <small>{{ ['days', 'hours', 'min', 'sec'][index] }}</small>
                    </div>
                </div>
            </div>
        </div>

        <transition name="fade" mode="out-in">
            <div v-if="leaderboardData.loading === true && leaderboardData.data === null" class="leaderboard-loading" key="loading">
                <LoadingAnimation />
            </div>
            <div v-else-if="leaderboardData.data !== null" class="leaderboard-content" key="data">
                <div class="leaderboard-podium">
                    <div v-for="entry in leaderboardGetPodium" v-bind:key="entry.position" class="podium-card" v-bind:class="'card-' + entry.position">
                        <div class="card-position">{{ entry.position }}</div>
                        <div class="card-avatar">
                            <AvatarImage v-bind:image="entry.winner.user ? entry.winner.user.avatar : ''" />
                        </div>
                        <div class="card-name" v-html="leaderboardGetName(entry.winner)"></div>
                        <div class="card-wagered">
                            <span>Wagered</span>
                            {{ leaderboardFormatValue(entry.winner.points) }}
                        </div>
                        <div class="card-prize">
                            <img src="@/assets/img/icons/coin.svg" alt="coin" />
                            {{ leaderboardFormatValue(entry.winner.prize) }}
                        </div>
                    </div>
                </div>

                <div class="leaderboard-table">
                    <div class="table-head">
                        <div class="col-pos">#</div>
                        <div class="col-user">Player</div>
                        <div class="col-wagered">Wagered</div>
                        <div class="col-prize">Prize</div>
                    </div>
                    <div v-for="(winner, index) in leaderboardData.data.winners.slice(3)" v-bind:key="index" class="table-row" v-bind:class="{ 'row-me': leaderboardIsMe(winner) }">
                        <div class="col-pos">{{ index + 4 }}</div>
                        <div class="col-user">
                            <AvatarImage v-bind:image="winner.user ? winner.user.avatar : ''" />
                            <span v-html="leaderboardGetName(winner)"></span>
                        </div>
                        <div class="col-wagered">
                            <img src="@/assets/img/icons/coin.svg" alt="coin" />
                            {{ leaderboardFormatValue(winner.points) }}
                        </div>
                        <div class="col-prize">
                            <img src="@/assets/img/icons/coin.svg" alt="coin" />
                            {{ leaderboardFormatValue(winner.prize) }}
                        </div>
                    </div>
                </div>
            </div>
            <div v-else class="leaderboard-empty" key="empty">No race is running right now.</div>
        </transition>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';
    import UiIcon from '@/components/UiIcon';
    import AvatarImage from '@/components/AvatarImage';
    import LoadingAnimation from '@/components/LoadingAnimation';

    export default {
        name: 'Leaderboard',
        metaInfo: {
            title: 'Leaderboard'
        },
        components: {
            UiIcon,
            AvatarImage,
            LoadingAnimation
        },
        data() {
            return {
                leaderboardTimerInterval: null,
                leaderboardRefreshInterval: null,
                leaderboardTimer: '00:00:00:00'
            }
        },
        methods: {
            ...mapActions([
                'leaderboardGetDataSocket'
            ]),
            leaderboardFormatValue(value) {
                return parseFloat(Math.floor((value || 0) / 10) / 100).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            },
            leaderboardGetName(winner) {
                if(winner.user === undefined) { return '—'; }
                if(winner.user === null) { return 'Hidden'; }
                return winner.user.username;
            },
            leaderboardIsMe(winner) {
                return this.authUser.user !== null && winner.user && winner.user._id === this.authUser.user._id;
            },
            leaderboardStartTimer() {
                // Same end time as the server: midnight of the start day + duration in days
                const start = new Date(this.leaderboardData.data.updatedAt);
                start.setHours(0, 0, 0, 0);
                const endingTime = start.getTime() + (1000 * 60 * 60 * 24 * Number(this.leaderboardData.data.duration));
                let timeLeft = Math.max(0, Math.floor((endingTime - (new Date().getTime() + this.generalTimeDiff)) / 1000));

                const pad = (value) => (value < 10 ? '0' + value : value.toString());
                this.leaderboardTimer = [
                    Math.floor(timeLeft / 86400),
                    Math.floor((timeLeft % 86400) / 3600),
                    Math.floor((timeLeft % 3600) / 60),
                    timeLeft % 60
                ].map(pad).join(':');
            }
        },
        computed: {
            ...mapGetters([
                'generalTimeDiff',
                'leaderboardData',
                'authUser'
            ]),
            leaderboardGetPool() {
                if(this.leaderboardData.data === null) { return 0; }
                return this.leaderboardData.data.winners.reduce((sum, winner) => sum + (winner.prize || 0), 0);
            },
            leaderboardGetPodium() {
                const winners = this.leaderboardData.data.winners;
                // Display order 2 - 1 - 3 like a real podium
                return [2, 1, 3].filter((position) => winners[position - 1] !== undefined).map((position) => ({ position: position, winner: winners[position - 1] }));
            }
        },
        watch: {
            'leaderboardData.data': {
                handler() {
                    if(this.leaderboardData.data !== null) {
                        clearInterval(this.leaderboardTimerInterval);
                        this.leaderboardStartTimer();
                        this.leaderboardTimerInterval = setInterval(() => { this.leaderboardStartTimer(); }, 1000);
                    }
                },
                deep: true
            }
        },
        created() {
            if(this.leaderboardData.loading === false) { this.leaderboardGetDataSocket({}); }

            // Keep the ranking live while the page is open
            this.leaderboardRefreshInterval = setInterval(() => {
                if(this.leaderboardData.loading === false) { this.leaderboardGetDataSocket({}); }
            }, 20000);
        },
        beforeDestroy() {
            clearInterval(this.leaderboardTimerInterval);
            clearInterval(this.leaderboardRefreshInterval);
        }
    }
</script>

<style scoped>
    .leaderboard {
        width: 100%;
        max-width: 1100px;
        margin: 0 auto;
        padding: 32px 24px 40px 24px;
    }

    .leaderboard .leaderboard-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 24px;
        padding: 28px 32px;
        border-radius: 8px;
        background: linear-gradient(120deg, #213743 0%, #1a2c38 55%, #3a2f12 100%);
    }

    .leaderboard .header-tag {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 4px 10px;
        border-radius: 999px;
        background: rgba(245, 183, 10, 0.15);
        font-size: 12px;
        font-weight: 700;
        color: #f5b70a;
    }

    .leaderboard .header-tag .ui-icon {
        width: 14px;
        height: 14px;
    }

    .leaderboard .header-text h1 {
        display: flex;
        align-items: center;
        gap: 10px;
        margin: 12px 0 8px 0;
        font-size: 36px;
        font-weight: 800;
        color: #ffffff;
    }

    .leaderboard .header-text h1 img {
        width: 30px;
        height: 30px;
    }

    .leaderboard .header-text p {
        max-width: 460px;
        font-size: 14px;
        font-weight: 500;
        line-height: 1.5;
        color: #b1bad3;
    }

    .leaderboard .header-timer {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 8px;
    }

    .leaderboard .timer-label {
        font-size: 13px;
        font-weight: 600;
        color: #b1bad3;
    }

    .leaderboard .timer-blocks {
        display: flex;
        gap: 8px;
    }

    .leaderboard .timer-block {
        width: 62px;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 10px 0;
        border-radius: 6px;
        background: #0f212e;
    }

    .leaderboard .timer-block span {
        font-size: 22px;
        font-weight: 800;
        color: #ffffff;
    }

    .leaderboard .timer-block small {
        font-size: 11px;
        font-weight: 600;
        color: #557086;
    }

    .leaderboard .leaderboard-podium {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        align-items: end;
        gap: 16px;
        margin-top: 28px;
    }

    .leaderboard .podium-card {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 26px 16px 18px 16px;
        border-radius: 8px;
        background: #213743;
        border-top: 3px solid #557086;
    }

    .leaderboard .podium-card.card-1 {
        padding-top: 38px;
        border-top-color: #f5b70a;
        background: linear-gradient(180deg, rgba(245, 183, 10, 0.12) 0%, #213743 60%);
    }

    .leaderboard .podium-card.card-2 {
        border-top-color: #c0c8d8;
    }

    .leaderboard .podium-card.card-3 {
        border-top-color: #cd7f32;
    }

    .leaderboard .card-position {
        position: absolute;
        top: 10px;
        left: 12px;
        font-size: 13px;
        font-weight: 800;
        color: #557086;
    }

    .leaderboard .card-1 .card-position {
        color: #f5b70a;
    }

    .leaderboard .card-avatar .avatar-image {
        width: 64px;
        height: 64px;
        border-radius: 50%;
        overflow: hidden;
        border: 3px solid #0f212e;
    }

    .leaderboard .card-1 .card-avatar .avatar-image {
        width: 78px;
        height: 78px;
        border-color: #f5b70a;
    }

    .leaderboard .card-name {
        max-width: 100%;
        margin-top: 10px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        font-size: 15px;
        font-weight: 700;
        color: #ffffff;
    }

    .leaderboard .card-wagered {
        margin-top: 4px;
        font-size: 13px;
        font-weight: 600;
        color: #b1bad3;
    }

    .leaderboard .card-wagered span {
        color: #557086;
    }

    .leaderboard .card-prize {
        display: flex;
        align-items: center;
        gap: 6px;
        margin-top: 12px;
        padding: 6px 14px;
        border-radius: 999px;
        background: #0f212e;
        font-size: 15px;
        font-weight: 800;
        color: #ffffff;
    }

    .leaderboard img {
        width: 16px;
        height: 16px;
    }

    .leaderboard .leaderboard-table {
        margin-top: 20px;
    }

    .leaderboard .table-head,
    .leaderboard .table-row {
        display: grid;
        grid-template-columns: 60px 1fr 180px 160px;
        align-items: center;
        padding: 0 18px;
    }

    .leaderboard .table-head {
        height: 40px;
        font-size: 13px;
        font-weight: 600;
        color: #b1bad3;
    }

    .leaderboard .table-row {
        height: 54px;
        border-radius: 4px;
        font-size: 14px;
        font-weight: 600;
        color: #ffffff;
    }

    .leaderboard .table-row:nth-child(even) {
        background: #213743;
    }

    .leaderboard .table-row.row-me {
        box-shadow: inset 3px 0 0 #00e701;
    }

    .leaderboard .col-pos {
        color: #557086;
        font-weight: 800;
    }

    .leaderboard .col-user {
        display: flex;
        align-items: center;
        gap: 10px;
        min-width: 0;
    }

    .leaderboard .col-user .avatar-image {
        width: 28px;
        height: 28px;
        flex-shrink: 0;
        border-radius: 50%;
        overflow: hidden;
    }

    .leaderboard .col-user span {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }

    .leaderboard .col-wagered,
    .leaderboard .col-prize {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 6px;
    }

    .leaderboard .table-head .col-wagered,
    .leaderboard .table-head .col-prize {
        justify-content: flex-end;
    }

    .leaderboard .leaderboard-loading,
    .leaderboard .leaderboard-empty {
        display: flex;
        justify-content: center;
        padding: 60px 0;
        font-size: 14px;
        font-weight: 500;
        color: #557086;
    }

    @media only screen and (max-width: 900px) {

        .leaderboard .leaderboard-header {
            flex-direction: column;
            align-items: flex-start;
        }

        .leaderboard .header-timer {
            align-items: flex-start;
        }

        .leaderboard .table-head,
        .leaderboard .table-row {
            grid-template-columns: 40px 1fr 110px 100px;
            padding: 0 10px;
        }

    }

    @media only screen and (max-width: 600px) {

        .leaderboard .leaderboard-podium {
            grid-template-columns: 1fr;
        }

    }
</style>
