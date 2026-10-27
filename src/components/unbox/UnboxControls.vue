<template>
    <div class="unbox-controls">
        <div class="controls-count">
            <button v-on:click="unboxSetCount(1)" v-bind:class="{ 'button-active': unboxCount === 1 }" v-bind:disabled="socketSendLoading !== null || unboxRunning === true">
                <div class="button-inner">1</div>
            </button>
            <button v-on:click="unboxSetCount(2)" v-bind:class="{ 'button-active': unboxCount === 2 }" v-bind:disabled="socketSendLoading !== null || unboxRunning === true">
                <div class="button-inner">2</div>
            </button>
            <button v-on:click="unboxSetCount(3)" v-bind:class="{ 'button-active': unboxCount === 3 }" v-bind:disabled="socketSendLoading !== null || unboxRunning === true">
                <div class="button-inner">3</div>
            </button>
            <button v-on:click="unboxSetCount(4)" v-bind:class="{ 'button-active': unboxCount === 4 }" v-bind:disabled="socketSendLoading !== null || unboxRunning === true">
                <div class="button-inner">4</div>
            </button>
        </div>
        <div class="controls-bet">
            <button v-on:click="unboxBetButton()" class="button-bet" v-bind:disabled="socketSendLoading !== null || unboxRunning === true">
                <div class="button-inner">
                    Open Case
                    <div class="inner-amount">
                        <img src="@/assets/img/icons/coin.svg" alt="icon" />
                        <div class="amount-value">
                            <span>{{ unboxFormatValue(unboxBoxData.box.amount * unboxCount).split('.')[0] }}</span>.{{ unboxFormatValue(unboxBoxData.box.amount * unboxCount).split('.')[1] }}
                        </div>
                    </div>
                </div>
            </button>
            <button v-on:click="unboxDemoButton()" class="button-demo" v-bind:disabled="socketSendLoading !== null || unboxRunning === true">
                <div class="button-inner">DEMO SPIN</div>
            </button>
        </div>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';

    export default {
        name: 'UnboxControls',
        methods: {
            ...mapActions([
                'notificationShow',
                'unboxSetCount',
                'unboxSetRunnning',
                'unboxSetGames',
                'unboxSendBetSocket'
            ]),
            unboxFormatValue(value) {
                return parseFloat(Math.floor(value / 10) / 100).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            },
            unboxBetButton() {
                if(this.authUser.user === null) {
                    this.notificationShow({ type: 'error', message: 'Please sign in to perform this action.' });
                    return;
                }

                const data = { boxId: this.unboxBoxData.box._id, unboxCount: this.unboxCount };
                this.unboxSendBetSocket(data);
            },
            unboxDemoButton() {
                let games = [];

                for(let i = 0; i < this.unboxCount; i++) {
                    games.push({ demo: true, outcome: Math.floor(Math.random() * (100000 - 1 + 1)) + 1, updatedAt: new Date() });
                }

                this.unboxSetRunnning(true);
                this.unboxSetGames(games);
            }
        },
        computed: {
            ...mapGetters([
                'socketSendLoading',
                'authUser',
                'unboxCount',
                'unboxRunning',
                'unboxBoxData'
            ])
        }
    }
</script>

<style scoped>
    .unbox-controls {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 25px;
    }

    .unbox-controls .controls-count,
    .unbox-controls .controls-bet {
        display: flex;
        align-items: center;
    }

    .unbox-controls .controls-count button {
        width: 48px;
        height: 44px;
        position: relative;
        margin-right: 6px;
        padding: 1px;
        filter: none;
        z-index: 1;
    }

    .unbox-controls .controls-count button:last-child {
        margin-right: 0;
    }

    .unbox-controls .controls-count button::before {
        content: '';
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background: #1a2c38;
        border-radius: 4px;
        z-index: -1;
        isolation: isolate;
    }

    .unbox-controls .controls-count button.button-active::before {
        background: transparent;
    }

    .unbox-controls .controls-count button.button-active::after {
        content: '';
        width: calc(100% - 2px);
        height: calc(100% - 2px);
        position: absolute;
        top: 1px;
        left: 1px;
        background-color: #1a2c38;
        border-radius: 4px;
        z-index: -1;
        isolation: isolate;
    }

    .unbox-controls .controls-count button .button-inner {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        font-weight: 600;
        color: #557086;
        background-color: #1a2c38;
        border-radius: 4px;
        isolation: isolate;
    }

    .unbox-controls .controls-count button.button-active .button-inner {
        color: #00fff2;
        background: #2f4553;
    }

    .unbox-controls .controls-bet button.button-bet {
        width: 240px;
        height: 45px;
        position: relative;
        margin-right: 12px;
        padding: 1px;
        transition: all .2s;
    }  

    .unbox-controls .controls-bet button.button-bet:hover {
        transition-duration: .2s;
        opacity: .8;
    }
    .unbox-controls .controls-bet button.button-bet:active {
        transition-duration: .2s;
        scale: .9;
    }
    .unbox-controls .controls-bet button.button-bet:before {
        content: '';
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background: transparent;
        border-radius: 4px;
        isolation: isolate;
    }

    .unbox-controls .controls-bet button.button-bet .button-inner {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 15px;
        font-weight: 700;
        color: #ffffff;
        background: #00e701;
        border-radius: 4px;
        isolation: isolate;
    }
    .unbox-controls .controls-bet button.button-bet .inner-amount {
        display: flex;
        align-items: center;
        margin-left: 8px;
    }

    .unbox-controls .controls-bet button.button-bet .inner-amount img {
        width: 18px;
        height: 18px;
        margin-right: 8px;
    }

    .unbox-controls .controls-bet button.button-bet .amount-value {
        font-size: 12px;
        font-weight: 600;
        color: rgba(255, 255, 255, 0.75);
    }

    .unbox-controls .controls-bet button.button-bet .amount-value span {
        font-size: 15px;
        font-weight: 700;
        color: #ffffff;
    }

    .unbox-controls .controls-bet button.button-demo {
        width: 107px;
        height: 45px;
        transition: all .2s;
    }
    .unbox-controls .controls-bet button.button-demo:hover {
        transition-duration: .2s; 
        opacity: .8;
    }
    .unbox-controls .controls-bet button.button-demo:active {
        transition-duration: .2s;
        scale: .9;
    }

    .unbox-controls .controls-bet button.button-demo .button-inner {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 14px;
        font-weight: 700;
        color: #b1bad3;
        background: #2f4553;
        border-radius: 4px;
        transition: color 0.3s ease;
        isolation: isolate;
    }

    .unbox-controls .controls-bet button.button-demo:hover .button-inner {
        color: #ffffff;
    }

    @media only screen and (max-width: 650px) {

        .unbox-controls {
            flex-direction: column;
        }

        .unbox-controls .controls-bet {
            margin-top: 15px;
        }

    }
</style>