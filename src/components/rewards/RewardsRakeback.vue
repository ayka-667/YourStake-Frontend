<template>
    <div class="rewards-rakeback">
        <div class="card-icon"><UiIcon name="coin" /></div>
        <h3>
            Rakeback
            <span class="tier" v-bind:class="'tier-' + (rewardsGetRakebackInfo === null ? 'none' : rewardsGetRakebackInfo.name)">
                {{ rewardsGetRakebackInfo === null ? 'Unranked' : rewardsGetRakebackInfo.name }}
            </span>
        </h3>
        <p>You earn <span>{{ rewardsGetRakebackInfo === null ? '0.00' : rewardsGetRakebackInfo.percentage }}%</span> back on every bet. Level up to unlock a higher tier.</p>
        <div class="rakeback-bar"><div class="bar-progress" v-bind:style="{ 'width': rewardsGetRakebackProgress + '%' }"></div></div>
        <div class="rakeback-bottom">
            <div class="bottom-earnings">
                <span>Available</span>
                <div class="earnings-amount">
                    <img src="@/assets/img/icons/coin.svg" alt="coin" />
                    {{ rewardsFormatValue(authUser.user.rakeback.available) }}
                </div>
            </div>
            <button v-on:click="rewardsClaimButton()" class="button-claim" v-bind:disabled="socketSendLoading !== null">Claim</button>
        </div>
    </div>
</template>

<script>
    import UiIcon from '@/components/UiIcon';
    import { mapGetters, mapActions } from 'vuex';
    import BoxRank from '@/components/BoxRank';

    export default {
        name: 'RewardsRakeback',
        components: {
            UiIcon,
            BoxRank
        },
        methods: {
            ...mapActions([
                'rakebackSendClaimSocket'
            ]),
            rewardsFormatValue(value) {
                return parseFloat(Math.floor(value / 10) / 100).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            },
            rewardsClaimButton() {
                const data = {};
                this.rakebackSendClaimSocket(data);
            }
        },  
        computed: {
            ...mapGetters([
                'authUser', 
                'socketSendLoading'
            ]),
            rewardsGetRakebackInfo() {
                const xp = this.authUser.user.xp / 1000;
                let info = null;

                if(xp >= 100000 && xp < 250000) { info = { name: 'bronze', percentage: 0.05 }; }
                else if(xp >= 250000 && xp < 500000) { info = { name: 'silver', percentage: 0.1 }; }
                else if(xp >= 500000 && xp < 1000000) { info = { name: 'gold', percentage: 0.15 }; }
                else if(xp >= 1000000 && xp < 2000000) { info = { name: 'platinum', percentage: 0.2 }; }
                else if(xp >= 2000000) { info = { name: 'titanium', percentage: 0.25 }; }

                return info;
            },
            rewardsGetRakebackProgress() {
                let progress = 0;

                if(this.rewardsGetRakebackInfo !== null) { progress = 100 / 0.25 * this.rewardsGetRakebackInfo.percentage; }

                return progress;
            }
        }
    }
</script>

<style scoped>
    .rewards-rakeback {
        flex: 1 1 0;
        min-width: 300px;
        position: relative;
        padding: 26px 28px;
        border-radius: 12px;
        background: radial-gradient(90% 120% at 100% 0%, rgba(245, 183, 10, 0.14) 0%, rgba(0, 0, 0, 0) 60%), #213743;
        box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.05);
        overflow: hidden;
    }

    .rewards-rakeback .card-icon {
        width: 44px;
        height: 44px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 16px;
        border-radius: 10px;
        background: rgba(245, 183, 10, 0.12);
        color: #f5b70a;
    }

    .rewards-rakeback .card-icon .ui-icon { width: 22px; height: 22px; }

    .rewards-rakeback h3 {
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 20px;
        font-weight: 700;
        color: #ffffff;
    }

    .rewards-rakeback p {
        margin: 8px 0 20px 0;
        max-width: 420px;
        font-size: 14px;
        font-weight: 500;
        line-height: 1.55;
        color: #b1bad3;
    }

    .rewards-rakeback p span { color: #ffffff; font-weight: 700; }

    .rewards-rakeback .tier {
        padding: 3px 10px;
        border-radius: 999px;
        background: #2f4553;
        font-size: 12px;
        font-weight: 700;
        text-transform: capitalize;
        color: #b1bad3;
    }

    .rewards-rakeback .tier-bronze { background: rgba(205, 127, 50, 0.18); color: #e2a06a; }
    .rewards-rakeback .tier-silver { background: rgba(192, 200, 216, 0.16); color: #d6dce8; }
    .rewards-rakeback .tier-gold { background: rgba(245, 183, 10, 0.16); color: #f5b70a; }
    .rewards-rakeback .tier-platinum { background: rgba(127, 168, 255, 0.16); color: #9ec0ff; }
    .rewards-rakeback .tier-titanium { background: rgba(0, 231, 1, 0.14); color: #00e701; }

    .rewards-rakeback .rakeback-bar {
        height: 6px;
        border-radius: 999px;
        background: #0f212e;
        overflow: hidden;
    }

    .rewards-rakeback .bar-progress {
        height: 100%;
        border-radius: 999px;
        background: linear-gradient(90deg, #f5b70a, #ffd25e);
        transition: width .6s cubic-bezier(.22, 1, .36, 1);
    }

    .rewards-rakeback .rakeback-bottom {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 20px;
    }

    .rewards-rakeback .bottom-earnings span {
        font-size: 12px;
        font-weight: 600;
        color: #557086;
    }

    .rewards-rakeback .earnings-amount {
        display: flex;
        align-items: center;
        gap: 6px;
        margin-top: 2px;
        font-size: 18px;
        font-weight: 800;
        color: #ffffff;
    }

    .rewards-rakeback .earnings-amount img { width: 16px; height: 16px; }

    .rewards-rakeback button.button-claim {
        height: 42px;
        padding: 0 24px;
        border-radius: 6px;
        background: #f5b70a;
        font-size: 14px;
        font-weight: 700;
        color: #05080a;
        transition: filter .15s ease, transform .15s ease;
    }

    .rewards-rakeback button.button-claim:hover:not(:disabled) { filter: brightness(1.08); }
    .rewards-rakeback button.button-claim:active:not(:disabled) { transform: scale(.96); }
    .rewards-rakeback button.button-claim:disabled { opacity: .6; }
</style>