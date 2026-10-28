<template>
    <div class="ads-rewarded">
        <div class="rewarded-card">
            <div class="card-icon">
                <UiIcon name="play" />
            </div>
            <div class="card-text">
                <div class="text-title">Watch an ad, get free coins</div>
                <div class="text-sub">
                    Earn
                    <img src="@/assets/img/icons/coin.svg" alt="" />
                    <strong>{{ adsFormat(adsReward) }}</strong>
                    for each ad you watch to the end.
                </div>
            </div>
        </div>

        <div class="rewarded-progress">
            <div class="progress-label">
                <span>Today</span>
                <span class="label-value">{{ adsWatched }} / {{ adsLimit }}</span>
            </div>
            <div class="progress-track">
                <div class="track-fill" v-bind:style="{ transform: 'scaleX(' + (adsLimit > 0 ? Math.min(1, adsWatched / adsLimit) : 0) + ')' }"></div>
            </div>
        </div>

        <button v-on:click="adsWatch()" class="rewarded-button" v-bind:disabled="adsButtonDisabled">
            <span v-if="adsState === 'loading' || adsState === 'claiming'" class="button-spinner"></span>
            <UiIcon v-else name="play" />
            {{ adsButtonLabel }}
        </button>

        <p class="rewarded-note">
            The ad opens on top of the page; you can close it at any time, but the reward is only given once it has been watched.
            Coins are play money for this site only and have no cash value.
        </p>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';
    import UiIcon from '@/components/UiIcon';
    import sfx from '@/utils/sfx';
    import { rewardedAdUnit, showRewardedAd } from '@/utils/rewardedAd';

    const MESSAGES = {
        closed: 'The ad was closed before the end, so no coins this time.',
        nofill: 'No ad is available right now. Please try again in a few minutes.',
        unsupported: 'Rewarded ads are not available in this browser.',
        blocked: 'The ad could not load. If you use an ad blocker, pause it for this site and try again.'
    };

    export default {
        name: 'AdsRewarded',
        components: {
            UiIcon
        },
        data() {
            return {
                adsReward: 0,
                adsLimit: 0,
                adsWatched: 0,
                adsCooldownEnd: 0,
                adsNow: Date.now(),
                adsTimer: null,
                adsState: 'idle'
            }
        },
        methods: {
            ...mapActions([
                'notificationShow'
            ]),
            adsFormat(value) {
                return parseFloat(Math.floor(value / 10) / 100).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            },
            adsEmit(event, data) {
                return new Promise((resolve) => {
                    this.socketGeneral.emit(event, data, (res) => resolve(res));
                });
            },
            adsSetStatus(status) {
                this.adsReward = status.reward;
                this.adsLimit = status.limit;
                this.adsWatched = status.watched;
                this.adsCooldownEnd = Date.now() + status.cooldownLeft;
            },
            async adsLoad() {
                const res = await this.adsEmit('getAdsStatus', {});
                if(res.success === true) { this.adsSetStatus(res.status); }
            },
            async adsWatch() {
                if(this.adsButtonDisabled === true) { return; }

                const unit = rewardedAdUnit();
                if(unit === null) { return; }

                this.adsState = 'loading';
                const start = await this.adsEmit('sendAdsStart', {});
                if(start.success !== true) {
                    this.adsState = 'idle';
                    this.notificationShow(start.error);
                    return;
                }

                this.adsState = 'playing';
                const result = await showRewardedAd(unit);

                if(result !== 'granted') {
                    this.adsState = 'idle';
                    this.notificationShow({ type: 'error', message: MESSAGES[result] });
                    return;
                }

                this.adsState = 'claiming';
                const claim = await this.adsEmit('sendAdsClaim', { token: start.token });
                this.adsState = 'idle';

                if(claim.success !== true) {
                    this.notificationShow(claim.error);
                    return;
                }

                this.authUpdateUser(claim.user);
                this.adsSetStatus(claim.status);
                sfx.cashout();
                this.notificationShow({ type: 'success', message: 'You received ' + this.adsFormat(claim.reward) + ' coins. Thanks for watching!' });
            },
            authUpdateUser(user) {
                this.$store.commit('auth_update_user', user);
            }
        },
        computed: {
            ...mapGetters([
                'socketGeneral'
            ]),
            adsCooldownLeft() {
                return Math.max(0, this.adsCooldownEnd - this.adsNow);
            },
            adsButtonDisabled() {
                return this.adsState !== 'idle' || this.adsLimit === 0 || this.adsWatched >= this.adsLimit || this.adsCooldownLeft > 0;
            },
            adsButtonLabel() {
                if(this.adsState === 'loading') { return 'Loading ad…'; }
                if(this.adsState === 'playing') { return 'Ad playing…'; }
                if(this.adsState === 'claiming') { return 'Adding coins…'; }
                if(this.adsLimit > 0 && this.adsWatched >= this.adsLimit) { return 'Come back tomorrow'; }
                if(this.adsCooldownLeft > 0) { return 'Next ad in ' + Math.ceil(this.adsCooldownLeft / 1000) + 's'; }
                return 'Watch ad';
            }
        },
        created() {
            this.adsLoad();
            this.adsTimer = setInterval(() => { this.adsNow = Date.now(); }, 500);
        },
        beforeDestroy() {
            clearInterval(this.adsTimer);
        }
    }
</script>

<style scoped>
    .ads-rewarded {
        display: flex;
        flex-direction: column;
        gap: 16px;
    }

    .ads-rewarded .rewarded-card {
        display: flex;
        align-items: center;
        gap: 14px;
        padding: 16px;
        border-radius: 12px;
        background: linear-gradient(135deg, rgba(0, 231, 1, 0.12) 0%, rgba(0, 231, 1, 0) 65%), #0f212e;
        box-shadow: inset 0 0 0 1px rgba(0, 231, 1, 0.18);
    }

    .ads-rewarded .card-icon {
        width: 44px;
        height: 44px;
        flex: none;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 12px;
        background: rgba(0, 231, 1, 0.14);
        color: #00e701;
    }

    .ads-rewarded .card-icon .ui-icon {
        width: 22px;
        height: 22px;
    }

    .ads-rewarded .text-title {
        font-size: 15px;
        font-weight: 700;
        color: #ffffff;
    }

    .ads-rewarded .text-sub {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 4px;
        margin-top: 4px;
        font-size: 13px;
        color: #b1bad3;
    }

    .ads-rewarded .text-sub img {
        width: 14px;
        height: 14px;
    }

    .ads-rewarded .text-sub strong {
        color: #ffffff;
    }

    .ads-rewarded .progress-label {
        display: flex;
        justify-content: space-between;
        margin-bottom: 8px;
        font-size: 13px;
        font-weight: 600;
        color: #b1bad3;
    }

    .ads-rewarded .label-value {
        color: #ffffff;
        font-variant-numeric: tabular-nums;
    }

    .ads-rewarded .progress-track {
        height: 8px;
        border-radius: 999px;
        background: #0f212e;
        overflow: hidden;
    }

    .ads-rewarded .track-fill {
        height: 100%;
        border-radius: 999px;
        background: #00e701;
        transform-origin: left center;
        transition: transform .5s cubic-bezier(.32, .72, 0, 1);
    }

    .ads-rewarded button.rewarded-button {
        height: 48px;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 8px;
        border-radius: 8px;
        background: #00e701;
        font-size: 15px;
        font-weight: 700;
        color: #05080a;
        transition: filter .2s ease, opacity .2s ease, transform .2s ease;
    }

    .ads-rewarded button.rewarded-button:hover:not(:disabled) {
        filter: brightness(1.08);
    }

    .ads-rewarded button.rewarded-button:active:not(:disabled) {
        transform: scale(.98);
    }

    .ads-rewarded button.rewarded-button:disabled {
        opacity: .5;
        cursor: not-allowed;
    }

    .ads-rewarded button.rewarded-button .ui-icon {
        width: 16px;
        height: 16px;
    }

    .ads-rewarded .button-spinner {
        width: 16px;
        height: 16px;
        border-radius: 50%;
        border: 2px solid rgba(5, 8, 10, 0.25);
        border-top-color: #05080a;
        animation: ads-spin .7s linear infinite;
    }

    .ads-rewarded .rewarded-note {
        margin: 0;
        font-size: 12px;
        line-height: 1.5;
        color: #557086;
    }

    @keyframes ads-spin {
        to { transform: rotate(360deg); }
    }
</style>
