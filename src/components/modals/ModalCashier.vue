<template>
    <div class="modal-cashier">
        <div class="cashier-title">
            <UiIcon name="wallet" />
            Wallet
        </div>

        <div class="cashier-tabs" v-bind:class="['tabs-' + modalTab, { 'tabs-ads': modalAdsEnabled }]">
            <span class="tabs-thumb"></span>
            <button v-on:click="modalSetTab('overview')" v-bind:class="{ 'tab-active': modalTab === 'overview' }">Overview</button>
            <button v-if="modalAdsEnabled" v-on:click="modalSetTab('free')" v-bind:class="{ 'tab-active': modalTab === 'free' }">Free coins</button>
            <button v-on:click="modalSetTab('withdraw')" v-bind:class="{ 'tab-active': modalTab === 'withdraw' }">Withdraw</button>
        </div>

        <div class="cashier-balance">
            <span class="balance-label">Balance</span>
            <div class="balance-value">
                <AmountNumber v-bind:amount="authUser.user.balance" />
                <img src="@/assets/img/icons/coin.svg" alt="coin" />
            </div>
        </div>

        <transition name="pane" mode="out-in">
            <div v-if="modalTab === 'overview'" key="overview" class="cashier-pane">
                <p class="cashier-info">
                    Get coins from rewards, chat rain or a bonus code.
                </p>

                <router-link v-on:click.native="modalsSetShow(null)" to="/rewards" class="cashier-rewards">
                    <UiIcon name="gift" />
                    View Rewards
                </router-link>

                <div class="cashier-code">
                    <label>Bonus Code</label>
                    <div class="code-input">
                        <input v-model="modalGiftCode" type="text" placeholder="Enter your code" />
                        <button v-on:click="modalRedeemButton()" v-bind:disabled="socketSendLoading !== null">Redeem</button>
                    </div>
                </div>
            </div>

            <div v-else-if="modalTab === 'free'" key="free" class="cashier-pane">
                <AdsRewarded />
            </div>

            <div v-else-if="modalWithdrawState !== 'done'" key="withdraw" class="cashier-pane">
                <div class="withdraw-network">
                    <span class="network-coin">
                        <svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="16" fill="#345d9d" /><path d="M10.6 21.6l1-3.8-1.6.6.4-1.6 1.6-.6 2.2-8.3h3.4l-1.7 6.3 1.6-.6-.4 1.6-1.6.6-1.1 4h6.3l-.6 2.2H10.4z" fill="#ffffff" /></svg>
                    </span>
                    <div class="network-text">
                        <span class="network-name">Litecoin</span>
                        <span class="network-sub">LTC network</span>
                    </div>
                </div>

                <div class="withdraw-field">
                    <label>LTC address</label>
                    <div class="field-input" v-bind:class="{ 'field-error': modalAddressError }">
                        <input v-model.trim="modalAddress" type="text" placeholder="ltc1q... or L... / M..." spellcheck="false" autocomplete="off" />
                        <button v-on:click="modalPasteButton()" class="field-side">Paste</button>
                    </div>
                    <span v-if="modalAddressError" class="field-hint">This doesn't look like a Litecoin address.</span>
                </div>

                <div class="withdraw-field">
                    <label>Amount</label>
                    <div class="field-input" v-bind:class="{ 'field-error': modalAmountError }">
                        <img src="@/assets/img/icons/coin.svg" alt="" />
                        <input v-model="modalAmount" type="text" inputmode="decimal" placeholder="0.00" />
                        <button v-on:click="modalMaxButton()" class="field-side">Max</button>
                    </div>
                    <span v-if="modalAmountError" class="field-hint">{{ modalAmountError }}</span>
                </div>

                <div class="withdraw-summary">
                    <div><span>Network fee</span><span>0.0001 LTC</span></div>
                    <div><span>Estimated arrival</span><span>~ 4 hours</span></div>
                </div>

                <button v-on:click="modalWithdrawButton()" v-bind:disabled="!modalCanWithdraw" class="button-withdraw">
                    <span v-if="modalWithdrawState === 'loading'" class="button-spinner"></span>
                    <span v-else>Withdraw</span>
                </button>
            </div>

            <div v-else key="done" class="cashier-pane withdraw-done">
                <div class="done-check">
                    <svg viewBox="0 0 52 52" aria-hidden="true"><circle cx="26" cy="26" r="24" /><path d="M15 27l7 7 15-16" /></svg>
                </div>
                <div class="done-title">Withdrawal requested</div>
                <div class="done-amount">
                    <img src="@/assets/img/icons/coin.svg" alt="" />
                    {{ modalDoneAmount }}
                </div>
                <div class="done-address">{{ modalDoneAddress }}</div>
                <p class="done-note">Sent on the Litecoin network.</p>
                <button v-on:click="modalResetWithdraw()" class="button-again">Done</button>
            </div>
        </transition>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';
    import AmountNumber from '@/components/AmountNumber';
    import UiIcon from '@/components/UiIcon';
    import AdsRewarded from '@/components/ads/AdsRewarded';
    import { rewardedAdUnit } from '@/utils/rewardedAd';

    // Legacy (L.../M.../3...) and bech32 (ltc1...) Litecoin addresses.
    const LTC_ADDRESS = /^([LM3][a-km-zA-HJ-NP-Z1-9]{25,33}|ltc1[02-9ac-hj-np-z]{8,87})$/;

    export default {
        name: 'ModalCashier',
        components: {
            AmountNumber,
            UiIcon,
            AdsRewarded
        },
        data() {
            return {
                modalGiftCode: null,
                modalTab: 'overview',
                // The Free coins tab only shows once a rewarded ad unit is configured and the admin switch is on
                modalAdsEnabled: rewardedAdUnit() !== null && (((this.$store.getters.generalSettings || {}).general || {}).ads || {}).enabled !== false,
                modalAddress: '',
                modalAmount: '',
                modalWithdrawState: 'idle',
                modalDoneAmount: '',
                modalDoneAddress: ''
            }
        },
        methods: {
            ...mapActions([
                'notificationShow',
                'modalsSetShow',
                'modalsSetData'
            ]),
            modalSetTab(tab) {
                if(this.modalWithdrawState === 'loading') { return; }
                this.modalTab = tab;
            },
            modalRedeemButton() {
                if(this.modalGiftCode === null || this.modalGiftCode.trim() === '') {
                    this.notificationShow({ type: 'error', message: 'Invalid bonus code.' });
                    return;
                }

                this.modalsSetShow(null);

                setTimeout(() => {
                    this.modalsSetData({ typeCaptcha: 'promoClaim', data: { code: this.modalGiftCode.trim() } });
                    this.modalsSetShow('Captcha');
                }, 200);
            },
            async modalPasteButton() {
                try {
                    this.modalAddress = (await navigator.clipboard.readText()).trim();
                } catch(err) {
                    this.notificationShow({ type: 'error', message: 'Clipboard access was blocked.' });
                }
            },
            modalMaxButton() {
                this.modalAmount = (Math.floor(this.authUser.user.balance / 10) / 100).toFixed(2);
            },
            // Purely cosmetic: nothing leaves the browser and the balance is not touched.
            modalWithdrawButton() {
                if(!this.modalCanWithdraw) { return; }

                this.modalWithdrawState = 'loading';
                setTimeout(() => {
                    this.modalDoneAmount = this.modalAmountValue.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                    this.modalDoneAddress = this.modalAddress.slice(0, 10) + '…' + this.modalAddress.slice(-6);
                    this.modalWithdrawState = 'done';
                }, 1400);
            },
            modalResetWithdraw() {
                this.modalAddress = '';
                this.modalAmount = '';
                this.modalWithdrawState = 'idle';
            }
        },
        computed: {
            ...mapGetters([
                'authUser',
                'socketSendLoading'
            ]),
            modalAmountValue() {
                return parseFloat(String(this.modalAmount).replace(',', '.'));
            },
            modalAddressError() {
                return this.modalAddress !== '' && !LTC_ADDRESS.test(this.modalAddress);
            },
            modalAmountError() {
                if(this.modalAmount === '') { return null; }
                if(isNaN(this.modalAmountValue) || this.modalAmountValue <= 0) { return 'Enter a valid amount.'; }
                if(this.modalAmountValue < 1) { return 'Minimum withdrawal is 1.00.'; }
                if(this.modalAmountValue * 1000 > this.authUser.user.balance) { return 'Not enough balance.'; }
                return null;
            },
            modalCanWithdraw() {
                return this.modalWithdrawState === 'idle' && this.modalAddress !== '' && !this.modalAddressError
                    && this.modalAmount !== '' && this.modalAmountError === null;
            }
        }
    }
</script>

<style scoped>
    .modal-cashier {
        width: 460px;
        max-width: 100%;
        display: flex;
        flex-direction: column;
        gap: 18px;
        padding: 24px;
    }

    .modal-cashier .cashier-title {
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 16px;
        font-weight: 700;
        color: #ffffff;
    }

    .modal-cashier .cashier-title .ui-icon {
        color: #b1bad3;
    }

    .modal-cashier .cashier-tabs {
        position: relative;
        display: grid;
        grid-template-columns: 1fr 1fr;
        padding: 4px;
        border-radius: 12px;
        background: #0f212e;
    }

    .modal-cashier .tabs-thumb {
        position: absolute;
        top: 4px;
        bottom: 4px;
        left: 4px;
        width: calc(50% - 4px);
        border-radius: 9px;
        background: #2f4553;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        transition: transform .45s cubic-bezier(.32, .72, 0, 1);
    }

    .modal-cashier .cashier-tabs.tabs-withdraw .tabs-thumb {
        transform: translateX(100%);
    }

    /* Three tabs when rewarded ads are on: Overview, Free coins, Withdraw */
    .modal-cashier .cashier-tabs.tabs-ads {
        grid-template-columns: 1fr 1fr 1fr;
    }

    .modal-cashier .cashier-tabs.tabs-ads .tabs-thumb {
        width: calc((100% - 8px) / 3);
    }

    .modal-cashier .cashier-tabs.tabs-ads.tabs-free .tabs-thumb {
        transform: translateX(100%);
    }

    .modal-cashier .cashier-tabs.tabs-ads.tabs-withdraw .tabs-thumb {
        transform: translateX(200%);
    }

    .modal-cashier .cashier-tabs button {
        position: relative;
        height: 36px;
        font-size: 14px;
        font-weight: 600;
        color: #b1bad3;
        transition: color .3s ease;
    }

    .modal-cashier .cashier-tabs button.tab-active {
        color: #ffffff;
    }

    .modal-cashier .cashier-balance {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 18px 20px;
        border-radius: 8px;
        background: #0f212e;
    }

    .modal-cashier .balance-label {
        font-size: 14px;
        font-weight: 600;
        color: #b1bad3;
    }

    .modal-cashier .balance-value {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 22px;
        font-weight: 800;
        color: #ffffff;
    }

    .modal-cashier .balance-value img {
        width: 20px;
        height: 20px;
    }

    .modal-cashier .cashier-pane {
        display: flex;
        flex-direction: column;
        gap: 18px;
    }

    .modal-cashier .pane-enter-active,
    .modal-cashier .pane-leave-active {
        transition: opacity .25s ease, transform .35s cubic-bezier(.32, .72, 0, 1);
    }

    .modal-cashier .pane-enter {
        opacity: 0;
        transform: translateY(8px);
    }

    .modal-cashier .pane-leave-to {
        opacity: 0;
        transform: translateY(-4px);
    }

    .modal-cashier .cashier-info {
        font-size: 14px;
        font-weight: 500;
        line-height: 1.55;
        color: #b1bad3;
    }

    .modal-cashier a.cashier-rewards {
        height: 44px;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 8px;
        border-radius: 4px;
        background: #1475e1;
        font-size: 14px;
        font-weight: 700;
        color: #ffffff;
        transition: filter .15s ease;
    }

    .modal-cashier a.cashier-rewards:hover {
        filter: brightness(1.12);
    }

    .modal-cashier .cashier-code label,
    .modal-cashier .withdraw-field label {
        display: block;
        margin-bottom: 6px;
        font-size: 14px;
        font-weight: 600;
        color: #b1bad3;
    }

    .modal-cashier .code-input {
        display: flex;
        border-radius: 4px;
        border: 2px solid #2f4553;
        background: #0f212e;
        overflow: hidden;
    }

    .modal-cashier .code-input input {
        flex: 1;
        min-width: 0;
        height: 40px;
        padding: 0 12px;
        background: transparent;
        font-size: 14px;
        font-weight: 600;
        color: #ffffff;
    }

    .modal-cashier .code-input input::placeholder {
        color: #557086;
    }

    .modal-cashier .code-input button {
        padding: 0 18px;
        background: #2f4553;
        font-size: 14px;
        font-weight: 700;
        color: #ffffff;
    }

    .modal-cashier .code-input button:hover {
        background: #3d5564;
    }

    .modal-cashier .withdraw-network {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px 14px;
        border-radius: 12px;
        background: #0f212e;
    }

    .modal-cashier .network-coin svg {
        display: block;
        width: 32px;
        height: 32px;
    }

    .modal-cashier .network-text {
        display: flex;
        flex-direction: column;
    }

    .modal-cashier .network-name {
        font-size: 14px;
        font-weight: 700;
        color: #ffffff;
    }

    .modal-cashier .network-sub {
        font-size: 12px;
        font-weight: 500;
        color: #7f92a5;
    }

    .modal-cashier .field-input {
        height: 44px;
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 0 6px 0 12px;
        border-radius: 10px;
        border: 2px solid #2f4553;
        background: #0f212e;
        transition: border-color .25s ease;
    }

    .modal-cashier .field-input:focus-within {
        border-color: #557086;
    }

    .modal-cashier .field-input.field-error {
        border-color: #ed4163;
    }

    .modal-cashier .field-input img {
        width: 16px;
        height: 16px;
    }

    .modal-cashier .field-input input {
        flex: 1;
        min-width: 0;
        height: 100%;
        outline: none;
        background: transparent;
        font-size: 14px;
        font-weight: 600;
        font-variant-numeric: tabular-nums;
        color: #ffffff;
    }

    .modal-cashier .field-input input::placeholder {
        color: #557086;
    }

    .modal-cashier button.field-side {
        height: 30px;
        padding: 0 12px;
        border-radius: 7px;
        background: #2f4553;
        font-size: 12px;
        font-weight: 700;
        color: #ffffff;
        transition: background .2s ease;
    }

    .modal-cashier button.field-side:hover {
        background: #3d5564;
    }

    .modal-cashier .field-hint {
        display: block;
        margin-top: 6px;
        font-size: 12px;
        font-weight: 500;
        color: #ed4163;
    }

    .modal-cashier .withdraw-summary {
        display: flex;
        flex-direction: column;
        gap: 8px;
        padding: 12px 14px;
        border-radius: 12px;
        background: rgba(15, 33, 46, 0.6);
        font-size: 13px;
        font-weight: 500;
        color: #7f92a5;
    }

    .modal-cashier .withdraw-summary div {
        display: flex;
        justify-content: space-between;
    }

    .modal-cashier .withdraw-summary span:last-child {
        font-weight: 600;
        color: #ffffff;
    }

    .modal-cashier button.button-withdraw,
    .modal-cashier button.button-again {
        height: 46px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 10px;
        background: #1475e1;
        font-size: 14px;
        font-weight: 700;
        color: #ffffff;
        transition: filter .2s ease, opacity .3s ease, transform .3s cubic-bezier(.32, .72, 0, 1);
    }

    .modal-cashier button.button-withdraw:hover:not(:disabled),
    .modal-cashier button.button-again:hover {
        filter: brightness(1.12);
    }

    .modal-cashier button.button-withdraw:active:not(:disabled),
    .modal-cashier button.button-again:active {
        transform: scale(.98);
    }

    .modal-cashier button.button-withdraw:disabled {
        opacity: .45;
        cursor: not-allowed;
    }

    .modal-cashier .button-spinner {
        width: 18px;
        height: 18px;
        border-radius: 50%;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-top-color: #ffffff;
        animation: cashier-spin .8s linear infinite;
    }

    .modal-cashier .withdraw-done {
        align-items: center;
        gap: 10px;
        padding-top: 6px;
        text-align: center;
    }

    .modal-cashier .done-check svg {
        width: 64px;
        height: 64px;
        fill: none;
        stroke: #22d36b;
        stroke-width: 3;
        stroke-linecap: round;
        stroke-linejoin: round;
    }

    .modal-cashier .done-check circle {
        stroke-dasharray: 151;
        stroke-dashoffset: 151;
        animation: cashier-draw .6s cubic-bezier(.32, .72, 0, 1) forwards;
    }

    .modal-cashier .done-check path {
        stroke-dasharray: 36;
        stroke-dashoffset: 36;
        animation: cashier-draw .4s cubic-bezier(.32, .72, 0, 1) .45s forwards;
    }

    .modal-cashier .done-title {
        font-size: 18px;
        font-weight: 700;
        color: #ffffff;
    }

    .modal-cashier .done-amount {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 26px;
        font-weight: 800;
        font-variant-numeric: tabular-nums;
        color: #ffffff;
    }

    .modal-cashier .done-amount img {
        width: 20px;
        height: 20px;
    }

    .modal-cashier .done-address {
        padding: 6px 12px;
        border-radius: 999px;
        background: #0f212e;
        font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
        font-size: 12px;
        color: #b1bad3;
    }

    .modal-cashier .done-note {
        max-width: 340px;
        font-size: 13px;
        line-height: 1.5;
        color: #7f92a5;
    }

    .modal-cashier button.button-again {
        align-self: stretch;
        margin-top: 6px;
    }

    @keyframes cashier-spin {
        to { transform: rotate(360deg); }
    }

    @keyframes cashier-draw {
        to { stroke-dashoffset: 0; }
    }
</style>
