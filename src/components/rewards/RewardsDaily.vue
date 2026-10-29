<template>
    <div class="rewards-daily">
        <div class="card-icon"><UiIcon name="calendar" /></div>
        <h3>
            Daily reward
            <span v-if="dailyAffiliated === true" class="badge-affiliated">Affiliated</span>
            <span v-if="dailyStreak > 0" class="badge-streak">{{ dailyStreak }} day streak</span>
        </h3>
        <p>
            Claim free coins every 24 hours. Claim on consecutive days to grow your streak, up to <span>x4 on day {{ dailyStreakMax }}</span>. Miss a day and it starts over.
            <template v-if="dailyLoaded === true && dailyAffiliated !== true">Redeem a code to get <span>10x more</span>.</template>
        </p>
        <div class="daily-streak">
            <div v-for="(reward, index) in dailyRewards" v-bind:key="index" class="streak-day" v-bind:class="{
                'day-done': index < dailyStreakDone,
                'day-next': index + 1 === dailyStreakNext
            }">
                <span class="day-label">Day {{ index + 1 }}</span>
                <span class="day-amount">{{ dailyFormat(reward).replace('.00', '') }}</span>
            </div>
        </div>
        <div class="daily-bottom">
            <div class="bottom-earnings">
                <span>{{ dailyCooldownLeft > 0 ? 'Next reward in' : 'Available' }}</span>
                <div v-if="dailyCooldownLeft > 0" class="earnings-amount amount-timer">{{ dailyTimer }}</div>
                <div v-else class="earnings-amount">
                    <img src="@/assets/img/icons/coin.svg" alt="coin" />
                    {{ dailyFormat(dailyReward) }}
                </div>
            </div>
            <button v-on:click="dailyClaim()" class="button-claim" v-bind:disabled="dailyButtonDisabled">
                {{ dailyLoading === true ? 'Claiming…' : (dailyCooldownLeft > 0 ? 'Claimed' : 'Claim') }}
            </button>
        </div>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';
    import UiIcon from '@/components/UiIcon';
    import sfx from '@/utils/sfx';

    export default {
        name: 'RewardsDaily',
        components: {
            UiIcon
        },
        data() {
            return {
                dailyReward: 10000,
                dailyAffiliated: false,
                dailyCooldownEnd: 0,
                dailyNow: Date.now(),
                dailyTimerId: null,
                dailyStreak: 0,
                dailyStreakMax: 7,
                dailyRewards: [],
                dailyLoaded: false,
                dailyLoading: false
            }
        },
        methods: {
            ...mapActions([
                'notificationShow'
            ]),
            dailyFormat(value) {
                return parseFloat(Math.floor(value / 10) / 100).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            },
            dailyEmit(event, data) {
                return new Promise((resolve) => {
                    this.socketGeneral.emit(event, data, (res) => resolve(res));
                });
            },
            dailySetStatus(status) {
                this.dailyReward = status.reward;
                this.dailyAffiliated = status.affiliated === true;
                this.dailyCooldownEnd = Date.now() + status.cooldownLeft;
                this.dailyStreak = status.streak || 0;
                this.dailyStreakMax = status.streakMax || 7;
                this.dailyRewards = status.rewards || [];
                this.dailyLoaded = true;
            },
            async dailyLoad() {
                if(this.socketGeneral === null || this.authUser.user === null) { return; }
                const res = await this.dailyEmit('getDailyStatus', {});
                if(res.success === true) { this.dailySetStatus(res.status); }
            },
            async dailyClaim() {
                if(this.dailyButtonDisabled === true) { return; }

                this.dailyLoading = true;
                const res = await this.dailyEmit('sendDailyClaim', {});
                this.dailyLoading = false;

                if(res.success !== true) {
                    this.notificationShow(res.error);
                    this.dailyLoad();
                    return;
                }

                this.$store.commit('auth_update_user', res.user);
                this.dailySetStatus(res.status);
                sfx.cashout();
                this.notificationShow({ type: 'success', message: 'You claimed your daily reward of ' + this.dailyFormat(res.reward) + ' coins!' });
            }
        },
        computed: {
            ...mapGetters([
                'authUser',
                'socketGeneral',
                'socketSendLoading'
            ]),
            dailyCooldownLeft() {
                return Math.max(0, this.dailyCooldownEnd - this.dailyNow);
            },
            // Days of the week row already claimed (past day 7 the row stays full, day 7 is the next one)
            dailyStreakDone() {
                const done = Math.min(this.dailyStreak, this.dailyStreakMax);
                return this.dailyCooldownLeft <= 0 && done === this.dailyStreakMax ? done - 1 : done;
            },
            dailyStreakNext() {
                return this.dailyCooldownLeft > 0 ? null : Math.min(this.dailyStreak + 1, this.dailyStreakMax);
            },
            dailyButtonDisabled() {
                return this.dailyLoaded !== true || this.dailyLoading === true || this.dailyCooldownLeft > 0;
            },
            dailyTimer() {
                const seconds = Math.ceil(this.dailyCooldownLeft / 1000);
                const pad = (value) => value.toString().padStart(2, '0');
                return pad(Math.floor(seconds / 3600)) + ':' + pad(Math.floor((seconds % 3600) / 60)) + ':' + pad(seconds % 60);
            }
        },
        watch: {
            socketGeneral() {
                this.dailyLoad();
            },
            // Redeeming an affiliate code upgrades the daily reward
            socketSendLoading(value, previous) {
                if(previous === 'AffiliatesClaimCode' && value === null) { this.dailyLoad(); }
            }
        },
        created() {
            this.dailyLoad();
            this.dailyTimerId = setInterval(() => { this.dailyNow = Date.now(); }, 1000);
        },
        beforeDestroy() {
            clearInterval(this.dailyTimerId);
        }
    }
</script>

<style scoped>
    .rewards-daily {
        flex: 1 1 0;
        min-width: 300px;
        position: relative;
        padding: 26px 28px;
        border-radius: 12px;
        background: radial-gradient(90% 120% at 100% 0%, rgba(127, 168, 255, 0.14) 0%, rgba(0, 0, 0, 0) 60%), #213743;
        box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.05);
        overflow: hidden;
    }

    .rewards-daily .card-icon {
        width: 44px;
        height: 44px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 16px;
        border-radius: 10px;
        background: rgba(127, 168, 255, 0.14);
        color: #9ec0ff;
    }

    .rewards-daily .card-icon .ui-icon { width: 22px; height: 22px; }

    .rewards-daily h3 {
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 20px;
        font-weight: 700;
        color: #ffffff;
    }

    .rewards-daily .badge-affiliated {
        padding: 3px 10px;
        border-radius: 999px;
        background: rgba(0, 231, 1, 0.14);
        font-size: 12px;
        font-weight: 700;
        color: #00e701;
    }

    .rewards-daily p {
        margin: 8px 0 16px 0;
        max-width: 420px;
        font-size: 14px;
        font-weight: 500;
        line-height: 1.55;
        color: #b1bad3;
    }

    .rewards-daily p span { color: #ffffff; font-weight: 700; }

    .rewards-daily .badge-streak {
        padding: 3px 10px;
        border-radius: 999px;
        background: rgba(255, 166, 0, 0.14);
        font-size: 12px;
        font-weight: 700;
        color: #ffb02e;
    }

    .rewards-daily .daily-streak {
        display: grid;
        grid-template-columns: repeat(7, minmax(0, 1fr));
        gap: 6px;
    }

    .rewards-daily .streak-day {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 2px;
        padding: 8px 2px;
        border-radius: 8px;
        background: #1a2c38;
        box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.04);
    }

    .rewards-daily .day-label {
        font-size: 10px;
        font-weight: 600;
        color: #557086;
        white-space: nowrap;
    }

    .rewards-daily .day-amount {
        font-size: 13px;
        font-weight: 800;
        color: #b1bad3;
    }

    .rewards-daily .streak-day.day-done { background: rgba(0, 231, 1, 0.10); box-shadow: inset 0 0 0 1px rgba(0, 231, 1, 0.25); }
    .rewards-daily .streak-day.day-done .day-amount { color: #00e701; }
    .rewards-daily .streak-day.day-next { background: rgba(158, 192, 255, 0.14); box-shadow: inset 0 0 0 1px #9ec0ff; }
    .rewards-daily .streak-day.day-next .day-amount { color: #ffffff; }

    .rewards-daily .daily-bottom {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 26px;
    }

    .rewards-daily .bottom-earnings span {
        font-size: 12px;
        font-weight: 600;
        color: #557086;
    }

    .rewards-daily .earnings-amount {
        display: flex;
        align-items: center;
        gap: 6px;
        margin-top: 2px;
        font-size: 18px;
        font-weight: 800;
        color: #ffffff;
    }

    .rewards-daily .amount-timer { font-variant-numeric: tabular-nums; }

    .rewards-daily .earnings-amount img { width: 16px; height: 16px; }

    .rewards-daily button.button-claim {
        height: 42px;
        padding: 0 24px;
        border-radius: 6px;
        background: #9ec0ff;
        font-size: 14px;
        font-weight: 700;
        color: #05080a;
        transition: filter .15s ease, transform .15s ease;
    }

    .rewards-daily button.button-claim:hover:not(:disabled) { filter: brightness(1.08); }
    .rewards-daily button.button-claim:active:not(:disabled) { transform: scale(.96); }
    .rewards-daily button.button-claim:disabled { opacity: .6; cursor: not-allowed; }
</style>
