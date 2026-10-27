<template>
    <div class="duels-controls">
        <div class="controls-title">
            <svg width="37" height="36" viewBox="0 0 37 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.90698 20.2069L15.7558 27.0733L13.0174 29.8191L15.7597 32.5668L13.0194 35.3126L8.22287 30.5065L2.74031 36L0 33.2542L5.48256 27.7588L0.686047 22.9546L3.42636 20.2089L6.16667 22.9527L8.90504 20.2069H8.90698ZM1.05814 0L7.93023 0.0058256L30.8314 22.9546L33.5736 20.2089L36.314 22.9546L31.5194 27.7607L37 33.2542L34.2597 36L28.7771 30.5065L23.9806 35.3126L21.2403 32.5668L23.9806 29.8191L1.06395 6.85668L1.05814 0ZM29.0756 0L35.9419 0.0058256L35.9457 6.84697L28.0911 14.7154L21.2384 7.85091L29.0756 0Z" fill="url(#icon-duels-gradient)"/>
                <defs>
                    <linearGradient id="icon-duels-gradient" x1="37" y1="0" x2="-6.31937" y2="10.9114" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#00ffc2"/>
                        <stop offset="1" stop-color="#00aa6d"/>
                    </linearGradient>
                </defs>
            </svg>
            <span>Dice Duels</span>
        </div>
        <div class="controls-actions">
            <div class="actions-amount">
                <input v-model="duelsAmount" v-on:input="duelsValidateInput" type="text" placeholder="Bet Amount" />
                <img src="@/assets/img/icons/coin.svg" alt="icon" />
                <div class="amount-buttons">
                    <button v-on:click="duelsSetAmount('clear')">
                        <div class="button-inner">Clear</div>
                    </button>
                    <button v-on:click="duelsSetAmount('2x')">
                        <div class="button-inner">2x</div>
                    </button>
                    <button v-on:click="duelsSetAmount('max')" class="button-max">
                        <div class="button-inner">MAX</div>
                    </button>
                </div>
            </div>
            <DuelsFilterCount />
            <button v-on:click="duelsCreateButton" class="button-create">
                <div class="button-inner">Create Duel</div>
            </button>
        </div>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';
    import DuelsFilterCount from '@/components/duels/DuelsFilterCount';

    export default {
        name: 'DuelsControls',
        components: {
            DuelsFilterCount
        },
        data() {
            return {
                duelsAmount: null
            }
        },
        methods: {
            ...mapActions([
                'notificationShow', 
                'duelsSendCreateSocket'
            ]),
            duelsValidateInput() {
                this.duelsAmount = this.duelsAmount.replace(',', '.').replace(/[^\d.]/g, '');
                this.duelsAmount = this.duelsAmount.indexOf('.') >= 0 ? this.duelsAmount.substr(0, this.duelsAmount.indexOf('.')) + '.' + this.duelsAmount.substr((this.duelsAmount.indexOf('.') + 1), 2).replace('.', '') : this.duelsAmount;
            },
            duelsSetAmount(action) {
                let amount = Math.floor(this.duelsAmount * 100);

                if(action === 'clear') {
                    amount = 0;
                } else if(action === '2x') {
                    amount = Math.floor(amount * 2);
                } else if(action === 'max') {
                    amount = Math.floor(this.authUser.user.balance / 10);
                }

                this.duelsAmount = parseFloat(amount / 100).toFixed(2);
            },
            duelsCreateButton() {
                if(this.socketSendLoading !== null) { return; }

                if(this.authUser.user === null) {
                    this.notificationShow({ type: 'error', message: 'Please sign in to perform this action.' });
                    return;
                }

                const amount = Math.floor(this.duelsAmount * 1000);

                if(amount === null || isNaN(amount) === true || amount <= 0) {
                    this.notificationShow({type: 'error', message: 'Your entered bet amount is invalid.'});
                    return;
                }

                const data = { amount: amount, playerCount: this.duelsFilterCount };
                this.duelsSendCreateSocket(data);
            }
        },
        computed: {
            ...mapGetters([
                'socketSendLoading', 
                'authUser', 
                'duelsFilterCount'
            ])
        }
    }
</script>

<style scoped>
    .duels-controls {
        width: 100%;
        max-width: 1160px;
        height: 76px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 25px;
        border-radius: 10px;
        background-color: #011828;
        border: 1px solid #0c304c;
    }

    .duels-controls .controls-title {
        height: 50px;
        display: flex;
        align-items: center;
    }

    .duels-controls .controls-title svg {
        margin-right: 12px;
    }

    .duels-controls .controls-title span {
        font-size: 28px;
        font-weight: 700;
        background: #00e701;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        text-fill-color: transparent;
    }

    .duels-controls .controls-actions {
        display: flex;
        align-items: center;
    }

    .duels-controls .actions-amount {
        width: 350px;
        height: 50px;
        position: relative;
        margin-right: 25px;
    }

    .duels-controls .actions-amount::before {
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

    .duels-controls .actions-amount input {
        width: calc(100% - 2px);
        height: calc(100% - 2px);
        position: absolute;
        top: 1px;
        left: 1px;
        padding: 0 175px 0 43px;
        font-size: 12px;
        font-weight: 600;
        color: #ffffff;
        background-color: #07253a;
        border-radius: 4px;
        isolation: isolate;
    }

    .duels-controls .actions-amount input::placeholder {
        color: #557086;
    }

    .duels-controls .actions-amount img {
        width: 19px;
        height: 19px;
        position: absolute;
        top: 50%;
        left: 15px;
        transform: translate(0, -50%);
    }

    .duels-controls .amount-buttons {
        position: absolute;
        top: 50%;
        right: 15px;
        transform: translate(0, -50%);
    }

    .duels-controls .amount-buttons button {
        min-width: 45px;
        height: 31px;
        margin-right: 8px;
        filter: none;
        transition: all .2s;
    }

    .amount-buttons button:hover {
        transition-duration: .2s; 
        opacity: .8;
    }
    .amount-buttons button:active {
        transition-duration: .2s;
        scale: .9;
    }

    .duels-controls .amount-buttons button.button-max {
        filter: none;
    }

    .duels-controls .amount-buttons button:last-of-type {
        margin-right: 0;
    }

    .duels-controls .amount-buttons button .button-inner {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0 8px;
        font-size: 12px;
        font-weight: 700;
        color: #b1bad3;
        background-color: #2f4553;
        border-radius: 4px;
        isolation: isolate;
    }

    .duels-controls .amount-buttons button.button-max .button-inner {
        color: #ffffff;
        background: #00e701;
    }

    .duels-controls .controls-actions button.button-create {
        width: 130px;
        height: 50px;
        filter: none;
        transition: all .2s;
    }

    .button-create:hover {
        transition-duration: .2s; 
        opacity: .8;
    }
    .button-create:active {
        transition-duration: .2s;
        scale: .9;
    }

    .duels-controls .controls-actions button.button-create .button-inner {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 14px;
        font-weight: 700;
        color: #ffffff;
        background: #00e701;
        border-radius: 4px;
        isolation: isolate;
    }

    @media only screen and (max-width: 1180px) {

        .duels-controls {
            width: 100%;
            padding: 12px 10px;
        }

    }

    @media only screen and (max-width: 950px) {

        .duels-controls {
            height: auto;
            flex-direction: column;
            align-items: flex-start;
        }

        .duels-controls .controls-actions {
            width: 100%;
            justify-content: space-between;
            margin-top: 10px;
        }

        .duels-controls .actions-amount {
            width: calc(100% - 237px);
        }

    }

    @media only screen and (max-width: 650px) {

        .duels-controls .controls-actions {
            flex-wrap: wrap;
        }

        .duels-controls .actions-amount {
            width: calc(100% - 92px);
        }

        .duels-controls .controls-actions button.button-create {
            width: 100%;
            margin-top: 10px;
        }

    }

    @media only screen and (max-width: 500px) {

        .duels-controls .actions-amount input {
            padding: 0 70px 0 43px;
        isolation: isolate;
    }

        .duels-controls .amount-buttons button {
            display: none;
            margin-right: 0;
        }

        .duels-controls .amount-buttons button:first-child {
            display: block;
        }

    }
</style>
