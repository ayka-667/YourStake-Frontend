<template>
    <div class="admin-user-credit">
        <div class="credit-title">{{ userId ? 'Credit balance' : 'Credit a player' }}</div>
        <input v-if="!userId" v-model="creditUsername" type="text" placeholder="Username" class="credit-input" />
        <div class="credit-amount">
            <img src="@/assets/img/icons/coin.svg" alt="coin" />
            <input v-model="creditAmount" v-on:keyup.enter="creditButton(1)" type="text" placeholder="Amount" />
        </div>
        <div class="credit-quick">
            <button v-for="value in [100, 1000, 10000]" v-bind:key="value" v-on:click="creditAmount = value">{{ value.toLocaleString('en-US') }}</button>
        </div>
        <div class="credit-actions">
            <button v-on:click="creditButton(-1)" class="button-remove" v-bind:disabled="socketSendLoading !== null">Remove</button>
            <button v-on:click="creditButton(1)" class="button-credit" v-bind:disabled="socketSendLoading !== null">Credit</button>
        </div>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';

    export default {
        name: 'AdminUserCredit',
        // When userId is given (user modal) the username field is hidden
        props: ['userId'],
        data() {
            return {
                creditUsername: '',
                creditAmount: ''
            }
        },
        methods: {
            ...mapActions([
                'notificationShow',
                'adminSendUserCreditSocket'
            ]),
            creditButton(sign) {
                const amount = Math.floor(parseFloat(String(this.creditAmount).replace(',', '.')) * 1000);
                if(isNaN(amount) || amount <= 0) {
                    this.notificationShow({ type: 'error', message: 'Enter a positive amount.' });
                    return;
                }
                if(!this.userId && this.creditUsername.trim() === '') {
                    this.notificationShow({ type: 'error', message: 'Enter a username.' });
                    return;
                }

                const data = { amount: amount * sign };
                if(this.userId) { data.userId = this.userId; } else { data.username = this.creditUsername.trim(); }
                this.adminSendUserCreditSocket(data);
            }
        },
        computed: {
            ...mapGetters([
                'socketSendLoading'
            ])
        }
    }
</script>

<style scoped>
    .admin-user-credit {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 10px;
        margin-top: 15px;
        padding: 16px;
        border-radius: 8px;
        background: #213743;
    }

    .admin-user-credit .credit-title {
        font-size: 14px;
        font-weight: 700;
        color: #ffffff;
    }

    .admin-user-credit input {
        width: 100%;
        height: 42px;
        padding: 0 12px;
        border-radius: 4px;
        border: 2px solid #2f4553;
        background: #0f212e;
        font-size: 14px;
        font-weight: 600;
        color: #ffffff;
    }

    .admin-user-credit input::placeholder {
        color: #557086;
    }

    .admin-user-credit .credit-amount {
        position: relative;
    }

    .admin-user-credit .credit-amount img {
        width: 16px;
        height: 16px;
        position: absolute;
        top: 13px;
        left: 12px;
    }

    .admin-user-credit .credit-amount input {
        padding-left: 36px;
    }

    .admin-user-credit .credit-quick {
        display: flex;
        gap: 6px;
    }

    .admin-user-credit .credit-quick button {
        flex: 1;
        height: 32px;
        border-radius: 4px;
        background: #2f4553;
        font-size: 13px;
        font-weight: 600;
        color: #ffffff;
    }

    .admin-user-credit .credit-quick button:hover {
        background: #3d5564;
    }

    .admin-user-credit .credit-actions {
        display: flex;
        gap: 8px;
    }

    .admin-user-credit .credit-actions button {
        height: 42px;
        border-radius: 4px;
        font-size: 14px;
        font-weight: 700;
        transition: filter .15s ease;
    }

    .admin-user-credit .credit-actions button:hover:not(:disabled) {
        filter: brightness(1.1);
    }

    .admin-user-credit .button-remove {
        flex: 1;
        background: #2f4553;
        color: #ffffff;
    }

    .admin-user-credit .button-credit {
        flex: 2;
        background: #00e701;
        color: #05080a;
    }
</style>
