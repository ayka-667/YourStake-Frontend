<template>
    <div class="roll-bets">
        <div class="bets-highest">
            <div class="bets-title">
                <UiIcon name="trophy" />
                Highest Bet
            </div>
            <transition name="fade" mode="out-in">
                <RollBetsElement v-if="rollGetBets[0] !== undefined" v-bind:key="rollGetBets[0]._id" v-bind:bet="rollGetBets[0]"
                    v-bind:featured="true" v-bind:result="rollGetResult(rollGetBets[0])" />
                <div v-else key="empty" class="highest-empty">No bets yet this round</div>
            </transition>
        </div>

        <div class="bets-content">
            <div class="content-header">
                <div class="header-players">
                    <UiIcon name="affiliates" />
                    Players
                    <span class="players-count">{{ rollGetPlayerCount }}</span>
                </div>
                <div class="header-amount">
                    <img src="@/assets/img/icons/coin.svg" alt="" />
                    {{ rollFormatValue(rollGetBetsAmount) }}
                </div>
            </div>

            <transition-group name="bet" tag="div" class="content-list">
                <RollBetsElement v-for="bet of rollGetBets.slice(1)" v-bind:key="bet._id" v-bind:bet="bet" v-bind:result="rollGetResult(bet)" />
            </transition-group>
            <div v-if="rollGetBets.length <= 1" class="content-empty">Bets from other players show up here.</div>
        </div>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex';
    import UiIcon from '@/components/UiIcon';
    import RollBetsElement from '@/components/roll/RollBetsElement';

    export default {
        name: 'RollBets',
        components: {
            UiIcon,
            RollBetsElement
        },
        methods: {
            rollFormatValue(value) {
                return parseFloat(Math.floor(value / 10) / 100).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            },
            rollGetResult(bet) {
                if(this.rollGame === null || this.rollGame.state !== 'completed' || this.rollGame.outcome === undefined) { return null; }
                return this.rollGame.outcome >= bet.multiplier ? 'won' : 'lost';
            }
        },
        computed: {
            ...mapGetters(['rollGame', 'rollBets']),
            rollGetBets() {
                let bets = [];

                for(let bet of this.rollBets) {
                    const index = bets.findIndex((element) => element.user._id === bet.user._id && element.baseAmount === bet.amount && element.multiplier === bet.multiplier);

                    if(index !== -1) {
                        bets[index].amount = bets[index].amount + bet.amount;
                    } else {
                        bet = { ...bet, baseAmount: bet.amount };
                        bets.push(bet);
                    }
                }

                bets.sort(function(a, b) { return +b.amount - +a.amount; });

                return bets;
            },
            rollGetPlayerCount() {
                let players = [];

                for(const bet of this.rollBets) {
                    if(players.includes(bet.user._id) === false) { players.push(bet.user._id); }
                }

                return players.length;
            },
            rollGetBetsAmount() {
                let amount = 0;

                for(const bet of this.rollBets) {
                    amount = Math.floor(amount + bet.amount);
                }

                return amount;
            }
        }
    }
</script>

<style scoped>
    .roll-bets {
        width: 300px;
        flex: none;
        align-self: flex-start;
        display: flex;
        flex-direction: column;
        gap: 18px;
        margin-left: 20px;
        padding: 16px;
        border-radius: 12px;
        background: #213743;
    }

    .roll-bets .bets-title {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 10px;
        font-size: 14px;
        font-weight: 700;
        color: #ffffff;
    }

    .roll-bets .bets-title .ui-icon {
        width: 16px;
        height: 16px;
        color: #ffbe0b;
    }

    .roll-bets .highest-empty {
        height: 60px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 8px;
        border: 1px dashed #2f4553;
        font-size: 13px;
        font-weight: 600;
        color: #557086;
    }

    .roll-bets .content-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
    }

    .roll-bets .header-players {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 13px;
        font-weight: 700;
        color: #b1bad3;
    }

    .roll-bets .header-players .ui-icon {
        width: 15px;
        height: 15px;
    }

    .roll-bets .players-count {
        padding: 2px 7px;
        border-radius: 999px;
        background: #2f4553;
        font-size: 12px;
        color: #ffffff;
    }

    .roll-bets .header-amount {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 13px;
        font-weight: 700;
        color: #ffffff;
        font-variant-numeric: tabular-nums;
    }

    .roll-bets .header-amount img {
        width: 15px;
        height: 15px;
    }

    .roll-bets .content-list {
        max-height: 520px;
        display: flex;
        flex-direction: column;
        gap: 6px;
        overflow-y: auto;
    }

    .roll-bets .content-empty {
        padding: 14px 4px;
        text-align: center;
        font-size: 13px;
        color: #557086;
    }

    .roll-bets .bet-enter-active {
        transition: opacity .3s ease, transform .4s cubic-bezier(.32, .72, 0, 1);
    }

    .roll-bets .bet-enter {
        opacity: 0;
        transform: translateX(-8px);
    }

    .roll-bets .bet-move {
        transition: transform .4s cubic-bezier(.32, .72, 0, 1);
    }

    .roll-bets .fade-enter-active,
    .roll-bets .fade-leave-active {
        transition: opacity .2s ease;
    }

    .roll-bets .fade-enter,
    .roll-bets .fade-leave-to {
        opacity: 0;
    }
</style>
