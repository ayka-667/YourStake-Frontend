<template>
    <div class="originals-panel">
        <div class="panel-field">
            <div class="field-label">
                <span>{{ amountLabel }}</span>
                <span class="label-value">{{ panelFormatValue(panelAmountValue) }}</span>
            </div>
            <div class="field-amount">
                <div class="amount-input">
                    <input v-model="panelAmount" v-on:input="panelValidateInput" v-on:blur="panelFormatInput" type="text" inputmode="decimal" placeholder="0.00" />
                    <img src="@/assets/img/icons/coin.svg" alt="" />
                </div>
                <button v-on:click="panelSetAmount('half')" class="amount-side">½</button>
                <button v-on:click="panelSetAmount('double')" class="amount-side">2×</button>
                <button v-on:click="panelSetAmount('max')" class="amount-side">Max</button>
            </div>
        </div>

        <slot></slot>

        <div v-if="showProfit" class="panel-field">
            <div class="field-label">
                <span>Profit on Win</span>
                <span class="label-value">{{ multiplier > 0 ? multiplier.toFixed(2) + '×' : '–' }}</span>
            </div>
            <div class="field-readonly">
                <span>{{ panelFormatValue(panelProfit) }}</span>
                <img src="@/assets/img/icons/coin.svg" alt="" />
            </div>
        </div>

        <button v-on:click="panelBetButton()" class="panel-bet" v-bind:class="{ 'bet-busy': busy }" v-bind:disabled="disabled">
            <span v-if="busy" class="bet-spinner"></span>
            <span v-else>{{ label }}</span>
        </button>

        <div class="panel-footer">
            <button v-on:click="panelFairButton()">
                <UiIcon name="shield" />
                Fairness
            </button>
        </div>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';
    import UiIcon from '@/components/UiIcon';

    export default {
        name: 'OriginalsPanel',
        components: {
            UiIcon
        },
        props: {
            label: { type: String, default: 'Bet' },
            amountLabel: { type: String, default: 'Bet Amount' },
            showProfit: { type: Boolean, default: true },
            multiplier: { type: Number, default: 0 },
            busy: { type: Boolean, default: false },
            disabled: { type: Boolean, default: false }
        },
        data() {
            return {
                panelAmount: '1.00'
            }
        },
        methods: {
            ...mapActions([
                'notificationShow',
                'modalsSetShow'
            ]),
            panelFormatValue(value) {
                return parseFloat(Math.floor(value / 10) / 100).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            },
            panelValidateInput() {
                let value = String(this.panelAmount).replace(',', '.').replace(/[^\d.]/g, '');
                const dot = value.indexOf('.');
                if(dot >= 0) { value = value.substr(0, dot) + '.' + value.substr(dot + 1, 2).replace('.', ''); }
                this.panelAmount = value;
            },
            panelFormatInput() {
                this.panelAmount = (Math.floor(this.panelAmountValue / 10) / 100).toFixed(2);
            },
            panelSetAmount(action) {
                let amount = this.panelAmountValue;

                if(action === 'half') { amount = Math.floor(amount / 2); }
                else if(action === 'double') { amount = Math.floor(amount * 2); }
                else if(action === 'max') { amount = this.authUser.user !== null ? this.authUser.user.balance : 0; }

                if(this.authUser.user !== null) { amount = Math.min(amount, this.authUser.user.balance); }
                this.panelAmount = (Math.floor(amount / 10) / 100).toFixed(2);
            },
            panelBetButton() {
                if(this.authUser.user === null) {
                    this.notificationShow({ type: 'error', message: 'Please sign in to perform this action.' });
                    return;
                }

                if(this.panelAmountValue <= 0) {
                    this.notificationShow({ type: 'error', message: 'Your entered bet amount is invalid.' });
                    return;
                }

                this.$emit('bet', this.panelAmountValue);
            },
            panelFairButton() {
                if(this.authUser.user === null) {
                    this.notificationShow({ type: 'error', message: 'Please sign in to perform this action.' });
                    return;
                }

                this.modalsSetShow('FairSeed');
            }
        },
        watch: {
            // Lets games that place several chips read the current chip value.
            panelAmountValue: {
                handler(value) { this.$emit('amount', value); },
                immediate: true
            }
        },
        computed: {
            ...mapGetters([
                'authUser'
            ]),
            // Amount in internal units (1 coin = 1000).
            panelAmountValue() {
                const value = Math.floor(parseFloat(this.panelAmount) * 1000);
                return isNaN(value) === true || value < 0 ? 0 : value;
            },
            panelProfit() {
                return this.multiplier > 0 ? Math.max(0, Math.floor(this.panelAmountValue * this.multiplier) - this.panelAmountValue) : 0;
            }
        }
    }
</script>

<style scoped>
    .originals-panel {
        width: 300px;
        flex: none;
        display: flex;
        flex-direction: column;
        gap: 14px;
        padding: 16px;
        border-radius: 12px 0 0 12px;
        background: var(--bg-panel, #213743);
    }

    .originals-panel .field-label {
        display: flex;
        justify-content: space-between;
        margin-bottom: 6px;
        font-size: 13px;
        font-weight: 600;
        color: #b1bad3;
    }

    .originals-panel .label-value {
        font-variant-numeric: tabular-nums;
    }

    .originals-panel .field-amount {
        height: 42px;
        display: flex;
        border-radius: 6px;
        background: #2f4553;
        padding: 2px;
        gap: 2px;
    }

    .originals-panel .amount-input {
        position: relative;
        flex: 1;
        min-width: 0;
    }

    .originals-panel .amount-input input {
        width: 100%;
        height: 100%;
        padding: 0 32px 0 10px;
        border-radius: 4px 0 0 4px;
        border: 2px solid transparent;
        outline: none;
        background: #0f212e;
        font-size: 14px;
        font-weight: 600;
        font-variant-numeric: tabular-nums;
        color: #ffffff;
        transition: border-color .2s ease;
    }

    .originals-panel .amount-input input:hover,
    .originals-panel .amount-input input:focus {
        border-color: #557086;
    }

    .originals-panel .amount-input img,
    .originals-panel .field-readonly img {
        position: absolute;
        top: 50%;
        right: 10px;
        width: 16px;
        height: 16px;
        transform: translateY(-50%);
    }

    .originals-panel button.amount-side {
        width: 44px;
        font-size: 13px;
        font-weight: 700;
        color: #ffffff;
        transition: background .2s ease;
        border-radius: 0;
    }

    .originals-panel button.amount-side:last-of-type {
        border-radius: 0 4px 4px 0;
    }

    .originals-panel button.amount-side:hover {
        background: #557086;
    }

    .originals-panel .field-readonly {
        position: relative;
        height: 42px;
        display: flex;
        align-items: center;
        padding: 0 32px 0 12px;
        border-radius: 6px;
        border: 2px solid #2f4553;
        background: #2f4553;
        font-size: 14px;
        font-weight: 600;
        font-variant-numeric: tabular-nums;
        color: #ffffff;
    }

    .originals-panel button.panel-bet {
        height: 52px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 6px;
        background: var(--green, #00e701);
        font-size: 15px;
        font-weight: 700;
        color: var(--green-text, #05080a);
        transition: filter .2s ease, transform .3s cubic-bezier(.32, .72, 0, 1), opacity .2s ease;
    }

    .originals-panel button.panel-bet:hover:not(:disabled) {
        filter: brightness(1.1);
    }

    .originals-panel button.panel-bet:active:not(:disabled) {
        transform: scale(.97);
    }

    .originals-panel button.panel-bet:disabled {
        opacity: .5;
        cursor: not-allowed;
    }

    .originals-panel .bet-spinner {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        border: 2.5px solid rgba(5, 8, 10, 0.25);
        border-top-color: #05080a;
        animation: panel-spin .7s linear infinite;
    }

    .originals-panel .panel-footer {
        margin-top: auto;
        display: flex;
    }

    .originals-panel .panel-footer button {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 6px 8px;
        border-radius: 6px;
        font-size: 13px;
        font-weight: 600;
        color: #b1bad3;
        transition: color .2s ease, background .2s ease;
    }

    .originals-panel .panel-footer button:hover {
        background: #2f4553;
        color: #ffffff;
    }

    .originals-panel .panel-footer .ui-icon {
        width: 15px;
        height: 15px;
    }

    @keyframes panel-spin {
        to { transform: rotate(360deg); }
    }

    @media only screen and (max-width: 850px) {
        .originals-panel {
            width: 100%;
            border-radius: 0 0 12px 12px;
        }
    }
</style>
