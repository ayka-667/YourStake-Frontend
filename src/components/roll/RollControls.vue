<template>
    <div class="roll-controls">
        <div class="controls-amount">
            <input v-model="rollAmount" v-on:input="rollValidateInput" type="text" placeholder="Bet Amount" />
            <img src="@/assets/img/icons/coin.svg" alt="icon" />
            <div class="amount-buttons">
                <button v-on:click="rollSetAmount('clear')">
                    <div class="button-inner">Clear</div>
                </button>
                <button v-on:click="rollSetAmount('+1k')" class="button-add">
                    <div class="button-inner">+1,000</div>
                </button>
                <button v-on:click="rollSetAmount('+5k')" class="button-add">
                    <div class="button-inner">+5,000</div>
                </button>
                <button v-on:click="rollSetAmount('+10k')" class="button-add">
                    <div class="button-inner">+10,000</div>
                </button>
                <button v-on:click="rollSetAmount('+50k')" class="button-add">
                    <div class="button-inner">+50,000</div>
                </button>
                <button v-on:click="rollSetAmount('1/2')">
                    <div class="button-inner">1/2</div>
                </button>
                <button v-on:click="rollSetAmount('2x')">
                    <div class="button-inner">2x</div>
                </button>
                <button v-on:click="rollSetAmount('max')" class="button-max">
                    <div class="button-inner">Max</div>
                </button>
            </div>
        </div>
        <div class="controls-bet">
            <div class="bet-multiplier">
                <input v-model="rollMultiplier" type="text" placeholder="Target Multiplier" />
            </div>
            <button v-on:click="rollBetButton" class="button-bet">
                <div class="button-inner">Bet</div>
            </button>
        </div>
        <div class="controls-recent">
            <div class="recent-title">Recent Bets</div>
            <div class="recent-list">

                <RollRecentElement v-for="bet of rollGetRecentBets" v-bind:key="bet._id" v-on:click.native="rollSetBet(bet)" v-bind:bet="bet" />

            </div>
        </div>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';
    import RollRecentElement from '@/components/roll/RollRecentElement';

    export default {
        name: 'RollControls',
        components: {
            RollRecentElement
        },
        data() {
            return {
                rollAmount: null,
                rollMultiplier: null,
                rollRepeat: false
            }
        },
        methods: {
            ...mapActions(['notificationShow', 'rollSendBetSocket']),
            rollValidateInput() {
                this.rollAmount = this.rollAmount.replace(',', '.').replace(/[^\d.]/g, '');
                this.rollAmount = this.rollAmount.indexOf('.') >= 0 ? this.rollAmount.substr(0, this.rollAmount.indexOf('.')) + '.' + this.rollAmount.substr((this.rollAmount.indexOf('.') + 1), 2).replace('.', '') : this.rollAmount;
            },
            rollSetAmount(action) {
                let amount = Math.floor(this.rollAmount * 1000);

                if(action === 'clear') {
                    amount = 0;
                } else if(action === '+1k') {
                    amount = Math.floor(amount + 1000000);
                } else if(action === '+5k') {
                    amount = Math.floor(amount + 5000000);
                } else if(action === '+10k') {
                    amount = Math.floor(amount + 10000000);
                } else if(action === '+50k') {
                    amount = Math.floor(amount + 50000000);
                } else if(action === '1/2') {
                    amount = Math.floor(amount / 2);
                } else if(action === '2x') {
                    amount = Math.floor(amount * 2);
                } else if(action === 'max') {
                    amount = this.authUser.user.balance <= 1000000 ? this.authUser.user.balance : 1000000;
                }

                this.rollAmount = parseFloat(Math.floor(amount / 10) / 100).toFixed(2);
            },
            rollSetBet(bet) {
                this.rollAmount = parseFloat(bet.amount / 1000).toFixed(2);
                this.rollMultiplier = parseFloat(bet.multiplier / 100).toFixed(2);
            },
            rollToggleRepeat() {
                this.rollRepeat = !this.rollRepeat;
            },
            rollBetButton() {
                if(this.socketSendLoading !== null) { return; }

                if(this.authUser.user === null) {
                    this.notificationShow({ type: 'error', message: 'Please sign in to perform this action.' });
                    return;
                }

                const amount = Math.floor(this.rollAmount * 1000);
                const multiplier = Math.floor(this.rollMultiplier * 100);

                if(amount === null || isNaN(amount) === true || amount <= 0) {
                    this.notificationShow({type: 'error', message: 'Your entered bet amount is invalid.'});
                    return;
                }

                if(multiplier === null || isNaN(multiplier) === true || multiplier <= 100) {
                    this.notificationShow({type: 'error', message: 'Your entered bet multiplier is invalid.'});
                    return;
                }

                const data = { amount: amount, multiplier: multiplier };
                this.rollSendBetSocket(data);
            }
        },
        computed: {
            ...mapGetters(['socketSendLoading', 'rollRecent', 'authUser']),
            rollGetRecentBets() {
                let bets = [];

                for(let bet of this.rollRecent) {
                    const index = bets.findIndex((element) => element.baseAmount === bet.amount && element.multiplier === bet.multiplier);
                    
                    if(index !== -1) { 
                        bets[index].amount = bets[index].amount + bet.amount; 
                    } else { 
                        bet = { ...bet, baseAmount: bet.amount } 
                        bets.push(bet);
                    }
                }

                bets.sort(function(a, b) { return +b.amount - +a.amount; });

                return bets;
            }
        }
    }
</script>

<style scoped>
    .roll-controls {
        width: 100%;
        margin-top: 15px;
        padding: 20px 35px;
        border-radius: 15px;
        background: rgba(15, 49, 75, 0.25);
        border: 1px solid rgba(20, 68, 104, 0.35);
    }

    .roll-controls .controls-amount {
        width: 970px;
        height: 50px;
        position: relative;
        padding: 1px;
    }

    .roll-controls .controls-amount::before {
        content: '';
        width: 100%;
        height: 50px;
        position: absolute;
        top: 0;
        left: 0;
        background: #213743;
        border-radius: 4px;
        isolation: isolate;
    }

    .roll-controls .controls-amount input {
        width: 100%;
        height: 100%;
        padding: 0 100px 0 43px;
        font-size: 12px;
        font-weight: 600;
        color: #ffffff;
        background-color: #0f212e;
        border-radius: 4px;
        isolation: isolate;
    }

    .roll-controls .controls-amount input::placeholder {
        color: #557086;
    }

    .roll-controls .controls-amount img {
        width: 19px;
        height: 19px;
        position: absolute;
        top: 50%;
        left: 15px;
        transform: translate(0, -50%);
    }

    .roll-controls .amount-buttons {
        position: absolute;
        top: 50%;
        right: 15px;
        transform: translate(0, -50%);
    }

    .roll-controls .amount-buttons button {
        min-width: 45px;
        height: 31px;
        margin-right: 8px;
        filter: none;
        transition: all .2s;
    }

    .amount-buttons button:hover {
        transition-duration: .1s;   
        opacity: 0.8;
    }
    .amount-buttons button:active {
        transition-duration: .2s;
        scale: .9;
    }

    .roll-controls .amount-buttons button.button-max {
        filter: none;
        transition: all .2s;
    }

    .button-max:hover {
        transition-duration: .1s;   
        opacity: 0.8;
    }
    .button-max:active {
        transition-duration: .2s;
        scale: .9;
    }

    .roll-controls .amount-buttons button:last-of-type {
        margin-right: 0;
    }

    .roll-controls .amount-buttons button .button-inner {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0 9px;
        font-size: 12px;
        font-weight: 700;
        color: #b1bad3;
        background-color: #2f4553;
        border-radius: 4px;
        isolation: isolate;
    }

    .roll-controls .amount-buttons button.button-max .button-inner {
        font-weight: 700;
        color: #ffffff;
        background: #00e701;
    }

    .roll-controls .controls-bet {
        width: 100%;
        display: flex;
        align-items: center;
        margin-top: 25px;
    }

    .roll-controls .bet-multiplier {
        width: 200px;
        height: 51px;
        position: relative;
        margin-right: 25px;
        padding: 1px;
    }

    .roll-controls .bet-multiplier::before {
        content: '';
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background: #213743;
        border-radius: 4px;
        isolation: isolate;
    }

    .roll-controls .bet-multiplier input {
        width: 100%;
        height: 100%;
        padding: 0 5px 0 15px;
        font-size: 12px;
        font-weight: 600;
        color: #ffffff;
        background-color: #0f212e;
        border-radius: 4px;
        isolation: isolate;
    }

    .roll-controls .bet-multiplier input::placeholder {
        color: #557086;
    }

    .roll-controls button.button-bet {
        width: 240px;
        height: 51px;
        position: relative;
        margin-right: 12px;
        filter: none;
        transition: all .2s;
    }

    .button-bet:hover {
        transition-duration: .1s;   
        opacity: 0.8;
    }
    .button-bet:active {
        transition-duration: .2s;
        scale: .9;
    }

    .roll-controls button.button-bet .button-inner {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 16px;
        font-weight: 700;
        color: #ffffff;
        background: #00e701;
        border-radius: 4px;
        isolation: isolate;
    }

    .roll-controls .controls-recent {
        width: 100%;
        display: flex;
        margin-top: 20px;
    }

    .roll-controls .recent-title {
        height: 48px;
        display: flex;
        align-items: center;
        margin-right: 20px;
        font-size: 12px;
        font-weight: 700;
        color: #557086;
    }

    .roll-controls .recent-list {
        width: calc(100% - 98px);
        display: flex;
        flex-wrap: wrap;
    }

    @media only screen and (max-width: 1750px) {

        .roll-controls .controls-amount {
            width: 100%;
        }

    }

    @media only screen and (max-width: 750px) {

        .roll-controls {
            padding: 20px;
        }

        .roll-controls .amount-buttons button.button-add {
            display: none;
        }

        .roll-controls .controls-bet {
            flex-wrap: wrap;
            margin-top: 15px;
        }

        .roll-controls .bet-multiplier {
            width: 100%;
            margin-bottom: 15px;
            margin-right: 0;
        }

        .roll-controls button.button-bet {
            width: calc(100% - 144px);
        }

        .roll-controls .controls-recent {
            flex-direction: column;
        }

        .roll-controls .recent-list {
            width: 100%;
        }

    }
</style>
