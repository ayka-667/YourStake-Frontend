<template>
    <div class="modal-cashier">
        <div class="cashier-title">
            <UiIcon name="wallet" />
            Wallet
        </div>

        <div class="cashier-balance">
            <span class="balance-label">Balance</span>
            <div class="balance-value">
                <AmountNumber v-bind:amount="authUser.user.balance" />
                <img src="@/assets/img/icons/coin.svg" alt="coin" />
            </div>
        </div>

        <p class="cashier-info">
            Everything here is play money: no real deposits or withdrawals. Get coins from rewards, chat rain or a bonus code.
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
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';
    import AmountNumber from '@/components/AmountNumber';
    import UiIcon from '@/components/UiIcon';

    export default {
        name: 'ModalCashier',
        components: {
            AmountNumber,
            UiIcon
        },
        data() {
            return {
                modalGiftCode: null
            }
        },
        methods: {
            ...mapActions([
                'notificationShow',
                'modalsSetShow',
                'modalsSetData'
            ]),
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
            }
        },
        computed: {
            ...mapGetters([
                'authUser',
                'socketSendLoading'
            ])
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

    .modal-cashier .cashier-code label {
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
</style>
