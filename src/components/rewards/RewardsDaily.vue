<template>
    <div class="rewards-daily" v-bind:class="{ 'daily-hot': dailyStreak > 0, 'daily-burst': dailyBurst === true }">
        <div class="daily-glow"></div>

        <div class="daily-head">
            <div class="head-flame" v-bind:class="{ 'flame-cold': dailyStreak === 0 }">
                <DailyFlame v-bind:state="dailyStreak > 0 ? 'lit' : 'off'" />
                <span class="flame-count">{{ dailyStreak }}</span>
                <span v-for="spark in 6" v-bind:key="'spark-' + spark" class="flame-spark" v-bind:class="'spark-' + spark"></span>
            </div>
            <div class="head-text">
                <h3>
                    Daily reward
                    <span v-if="dailyAffiliated === true" class="badge-affiliated">Affiliated</span>
                </h3>
                <div class="head-streak">
                    <template v-if="dailyStreak > 0"><span>{{ dailyStreak }} day</span> streak</template>
                    <template v-else>Start your streak today</template>
                </div>
            </div>
        </div>

        <p>
            Claim free coins every 24 hours. Every day in a row adds more, up to <span>x4 on day {{ dailyStreakMax }}</span>.
            <template v-if="dailyLoaded === true && dailyAffiliated !== true">Redeem a code to get <span>10x more</span>.</template>
        </p>

        <div class="daily-streak">
            <div class="streak-track">
                <div class="track-fill" v-bind:style="{ width: dailyTrackWidth }"></div>
            </div>
            <div v-for="(reward, index) in dailyRewards" v-bind:key="index" class="streak-day" v-bind:class="{
                'day-done': index < dailyStreakDone,
                'day-next': index + 1 === dailyStreakNext,
                'day-best': index + 1 === dailyStreakMax
            }">
                <span class="day-label">{{ index + 1 === dailyStreakMax ? 'x4' : 'Day ' + (index + 1) }}</span>
                <div class="day-flame" v-bind:style="{ '--flame-size': (16 + index * 2.2) + 'px' }">
                    <DailyFlame v-bind:state="dailyDayState(index)" />
                </div>
                <span class="day-amount">{{ dailyFormat(reward).replace('.00', '') }}</span>
            </div>
        </div>

        <div v-if="dailyAtRisk === true" class="daily-risk">
            <DailyFlame state="next" />
            Claim within <span>{{ dailyRiskTimer }}</span> to keep your streak
        </div>

        <div class="daily-bottom">
            <div class="bottom-earnings">
                <span>{{ dailyCooldownLeft > 0 ? 'Next reward in' : 'Today\'s reward' }}</span>
                <div v-if="dailyCooldownLeft > 0" class="earnings-amount amount-timer">{{ dailyTimer }}</div>
                <div v-else class="earnings-amount">
                    <img src="@/assets/img/icons/coin.svg" alt="coin" />
                    {{ dailyFormat(dailyReward) }}
                </div>
            </div>
            <button v-on:click="dailyClaim()" class="button-claim" v-bind:class="{ 'claim-ready': dailyButtonDisabled !== true }" v-bind:disabled="dailyButtonDisabled">
                <DailyFlame v-if="dailyButtonDisabled !== true" state="gold" />
                {{ dailyLoading === true ? 'Claiming…' : (dailyCooldownLeft > 0 ? 'Claimed' : 'Claim') }}
            </button>
        </div>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';
    import DailyFlame from '@/components/rewards/DailyFlame';
    import sfx from '@/utils/sfx';

    export default {
        name: 'RewardsDaily',
        components: {
            DailyFlame
        },
        data() {
            return {
                dailyReward: 10000,
                dailyAffiliated: false,
                dailyCooldownEnd: 0,
                dailyStreakEnd: 0,
                dailyNow: Date.now(),
                dailyTimerId: null,
                dailyStreak: 0,
                dailyStreakMax: 7,
                dailyRewards: [],
                dailyLoaded: false,
                dailyLoading: false,
                dailyBurst: false
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
                this.dailyStreakEnd = Date.now() + (status.streakLeft || 0);
                this.dailyStreak = status.streak || 0;
                this.dailyStreakMax = status.streakMax || 7;
                this.dailyRewards = status.rewards || [];
                this.dailyLoaded = true;
            },
            dailyDayState(index) {
                if(index < this.dailyStreakDone) { return index + 1 === this.dailyStreakMax ? 'gold' : 'lit'; }
                if(index + 1 === this.dailyStreakNext) { return 'next'; }
                return 'off';
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

                // Flame burst on the streak counter
                this.dailyBurst = false;
                this.$nextTick(() => { this.dailyBurst = true; setTimeout(() => { this.dailyBurst = false; }, 1400); });

                this.notificationShow({ type: 'success', message: 'Day ' + res.status.streak + ' streak! You claimed ' + this.dailyFormat(res.reward) + ' coins.' });
            },
            dailyFormatTime(ms, seconds) {
                const total = Math.floor(ms / 1000);
                const pad = (value) => value.toString().padStart(2, '0');
                if(seconds === true) { return pad(Math.floor(total / 3600)) + ':' + pad(Math.floor((total % 3600) / 60)) + ':' + pad(total % 60); }
                return Math.floor(total / 3600) + 'h ' + pad(Math.floor((total % 3600) / 60)) + 'm';
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
            // Fire line from the first day to the last lit (or claimable) one
            dailyTrackWidth() {
                const reached = Math.max(this.dailyStreakDone, this.dailyStreakNext || 0);
                if(reached <= 1 || this.dailyStreakMax <= 1) { return '0%'; }
                return ((reached - 1) / (this.dailyStreakMax - 1) * 100) + '%';
            },
            // A streak is running, today's reward is ready and the 48h window is closing
            dailyAtRisk() {
                return this.dailyStreak > 0 && this.dailyCooldownLeft <= 0 && this.dailyStreakEnd - this.dailyNow > 0 && this.dailyStreakEnd - this.dailyNow < 1000 * 60 * 60 * 12;
            },
            dailyRiskTimer() {
                return this.dailyFormatTime(Math.max(0, this.dailyStreakEnd - this.dailyNow), false);
            },
            dailyButtonDisabled() {
                return this.dailyLoaded !== true || this.dailyLoading === true || this.dailyCooldownLeft > 0;
            },
            dailyTimer() {
                return this.dailyFormatTime(this.dailyCooldownLeft, true);
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
        isolation: isolate;
    }

    .rewards-daily.daily-hot {
        background: radial-gradient(80% 90% at 0% 0%, rgba(255, 122, 0, 0.16) 0%, rgba(0, 0, 0, 0) 60%), radial-gradient(70% 70% at 100% 100%, rgba(255, 61, 0, 0.08) 0%, rgba(0, 0, 0, 0) 70%), #213743;
        box-shadow: inset 0 0 0 1px rgba(255, 150, 40, 0.16);
    }

    .rewards-daily .daily-glow {
        position: absolute;
        top: -60px;
        left: -40px;
        width: 220px;
        height: 220px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(255, 140, 0, 0.22) 0%, rgba(255, 140, 0, 0) 65%);
        opacity: 0;
        pointer-events: none;
        z-index: -1;
        transition: opacity .4s ease;
    }

    .rewards-daily.daily-hot .daily-glow {
        opacity: 1;
        animation: daily-glow 3.2s ease-in-out infinite;
    }

    @keyframes daily-glow {
        0%, 100% { transform: scale(1); opacity: .85; }
        50% { transform: scale(1.12); opacity: 1; }
    }

    /* ---------- header ---------- */

    .rewards-daily .daily-head {
        display: flex;
        align-items: center;
        gap: 14px;
        margin-bottom: 12px;
    }

    .rewards-daily .head-flame {
        width: 52px;
        height: 60px;
        position: relative;
        flex-shrink: 0;
    }

    .rewards-daily .head-flame .daily-flame {
        width: 100%;
        height: 100%;
    }

    .rewards-daily .flame-count {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 9px;
        text-align: center;
        font-size: 19px;
        font-weight: 900;
        color: #7a2400;
        text-shadow: 0 1px 0 rgba(255, 255, 255, 0.35);
        font-variant-numeric: tabular-nums;
    }

    .rewards-daily .head-flame.flame-cold .flame-count {
        color: #b1bad3;
        text-shadow: none;
    }

    .rewards-daily .flame-spark {
        position: absolute;
        bottom: 30px;
        left: 50%;
        width: 5px;
        height: 5px;
        border-radius: 50%;
        background: #ffc94d;
        box-shadow: 0 0 6px #ff9800;
        opacity: 0;
        pointer-events: none;
    }

    .rewards-daily.daily-burst .flame-spark { animation: daily-spark 1.1s ease-out forwards; }
    .rewards-daily.daily-burst .head-flame { animation: daily-pop .6s cubic-bezier(.3, 1.6, .5, 1); }

    .rewards-daily .spark-1 { --dx: -34px; --dy: -38px; }
    .rewards-daily .spark-2 { --dx: 30px; --dy: -44px; animation-delay: .05s !important; }
    .rewards-daily .spark-3 { --dx: -20px; --dy: -58px; animation-delay: .1s !important; }
    .rewards-daily .spark-4 { --dx: 40px; --dy: -20px; animation-delay: .08s !important; }
    .rewards-daily .spark-5 { --dx: -44px; --dy: -14px; animation-delay: .12s !important; }
    .rewards-daily .spark-6 { --dx: 8px; --dy: -64px; animation-delay: .02s !important; }

    @keyframes daily-spark {
        0% { opacity: 1; transform: translate(-50%, 0) scale(1); }
        100% { opacity: 0; transform: translate(calc(-50% + var(--dx)), var(--dy)) scale(.3); }
    }

    @keyframes daily-pop {
        0% { transform: scale(1); }
        40% { transform: scale(1.25); }
        100% { transform: scale(1); }
    }

    .rewards-daily h3 {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
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

    .rewards-daily .head-streak {
        margin-top: 3px;
        font-size: 13px;
        font-weight: 600;
        color: #b1bad3;
    }

    .rewards-daily .head-streak span {
        font-weight: 800;
        background: linear-gradient(90deg, #ffb300, #ff5722);
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
    }

    .rewards-daily p {
        margin: 0 0 18px 0;
        max-width: 440px;
        font-size: 14px;
        font-weight: 500;
        line-height: 1.55;
        color: #b1bad3;
    }

    .rewards-daily p span { color: #ffffff; font-weight: 700; }

    /* ---------- streak row ---------- */

    .rewards-daily .daily-streak {
        position: relative;
        display: grid;
        grid-template-columns: repeat(7, minmax(0, 1fr));
        gap: 6px;
    }

    .rewards-daily .streak-track {
        position: absolute;
        left: calc(100% / 14);
        right: calc(100% / 14);
        top: 50%;
        height: 4px;
        margin-top: -2px;
        border-radius: 4px;
        background: #1a2c38;
        z-index: 0;
    }

    .rewards-daily .track-fill {
        height: 100%;
        border-radius: 4px;
        background: linear-gradient(90deg, #ff3d00, #ff9100, #ffd54f);
        box-shadow: 0 0 8px rgba(255, 120, 0, 0.6);
        transition: width .6s ease;
    }

    .rewards-daily .streak-day {
        position: relative;
        z-index: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 3px;
        padding: 8px 2px 7px 2px;
        border-radius: 10px;
        background: #1a2c38;
        box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.04);
        transition: transform .2s ease, background .2s ease;
    }

    .rewards-daily .day-label {
        font-size: 10px;
        font-weight: 700;
        color: #557086;
        white-space: nowrap;
    }

    .rewards-daily .day-flame {
        height: 28px;
        display: flex;
        align-items: flex-end;
        justify-content: center;
    }

    .rewards-daily .day-flame .daily-flame {
        width: var(--flame-size);
        height: calc(var(--flame-size) * 1.25);
        max-height: 28px;
    }

    .rewards-daily .day-amount {
        font-size: 12px;
        font-weight: 800;
        color: #7f8fa3;
    }

    .rewards-daily .streak-day.day-done {
        background: linear-gradient(180deg, rgba(255, 120, 0, 0.18) 0%, rgba(255, 61, 0, 0.08) 100%), #1a2c38;
        box-shadow: inset 0 0 0 1px rgba(255, 140, 0, 0.35);
    }

    .rewards-daily .streak-day.day-done .day-label { color: #ffb74d; }
    .rewards-daily .streak-day.day-done .day-amount { color: #ffd180; }

    .rewards-daily .streak-day.day-next {
        transform: translateY(-3px);
        background: linear-gradient(180deg, rgba(255, 200, 0, 0.2) 0%, rgba(255, 120, 0, 0.1) 100%), #1a2c38;
        box-shadow: inset 0 0 0 1.5px #ffb300, 0 4px 14px rgba(255, 150, 0, 0.25);
        animation: daily-next 1.8s ease-in-out infinite;
    }

    .rewards-daily .streak-day.day-next .day-label { color: #ffe082; }
    .rewards-daily .streak-day.day-next .day-amount { color: #ffffff; }

    @keyframes daily-next {
        0%, 100% { box-shadow: inset 0 0 0 1.5px #ffb300, 0 4px 14px rgba(255, 150, 0, 0.2); }
        50% { box-shadow: inset 0 0 0 1.5px #ffd54f, 0 4px 20px rgba(255, 150, 0, 0.45); }
    }

    .rewards-daily .streak-day.day-best .day-label {
        padding: 0 5px;
        border-radius: 4px;
        background: linear-gradient(90deg, #ffb300, #ff6d00);
        color: #2a1100;
    }

    /* ---------- risk + bottom ---------- */

    .rewards-daily .daily-risk {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-top: 14px;
        padding: 8px 12px;
        border-radius: 8px;
        background: rgba(255, 87, 34, 0.12);
        box-shadow: inset 0 0 0 1px rgba(255, 87, 34, 0.3);
        font-size: 13px;
        font-weight: 600;
        color: #ffab91;
    }

    .rewards-daily .daily-risk .daily-flame { width: 14px; height: 18px; flex-shrink: 0; }
    .rewards-daily .daily-risk span { color: #ffffff; font-weight: 800; }

    .rewards-daily .daily-bottom {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 22px;
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
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 0 24px;
        border-radius: 6px;
        background: #2f4553;
        font-size: 14px;
        font-weight: 700;
        color: #b1bad3;
        transition: filter .15s ease, transform .15s ease;
    }

    .rewards-daily button.button-claim.claim-ready {
        background: linear-gradient(90deg, #ff9100 0%, #ff5722 100%);
        box-shadow: 0 4px 16px rgba(255, 100, 0, 0.35);
        color: #ffffff;
    }

    .rewards-daily button.button-claim .daily-flame { width: 13px; height: 17px; }

    .rewards-daily button.button-claim:hover:not(:disabled) { filter: brightness(1.08); }
    .rewards-daily button.button-claim:active:not(:disabled) { transform: scale(.96); }
    .rewards-daily button.button-claim:disabled { cursor: not-allowed; }

    @media (prefers-reduced-motion: reduce) {
        .rewards-daily .daily-glow,
        .rewards-daily .streak-day.day-next,
        .rewards-daily.daily-burst .flame-spark,
        .rewards-daily.daily-burst .head-flame { animation: none !important; }
    }
</style>
