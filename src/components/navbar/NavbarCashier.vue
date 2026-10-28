<template>
    <div class="navbar-cashier">
        <div class="cashier-balance">
            <AmountNumber v-bind:amount="authUser.user.balance" />
            <img class="balance-chip" src="@/assets/img/icons/coin.svg" alt="" />
        </div>
        <button v-on:click="modalsSetShow('Cashier')" class="button-wallet">
            <UiIcon name="wallet" class="wallet-icon" />
            <span>Wallet</span>
        </button>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';
    import AmountNumber from '@/components/AmountNumber';
    import UiIcon from '@/components/UiIcon';

    export default {
        name: 'NavbarCashier',
        components: {
            AmountNumber,
            UiIcon
        },
        methods: {
            ...mapActions([
                'modalsSetShow'
            ])
        },
        computed: {
            ...mapGetters([
                'authUser'
            ])
        }
    }
</script>

<style scoped>
    .navbar-cashier {
        display: flex;
        align-items: center;
        border-radius: 4px;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2);
    }

    .navbar-cashier .cashier-balance {
        height: 44px;
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 0 16px;
        border-radius: 4px 0 0 4px;
        background: #0f212e;
        font-size: 15px;
        font-weight: 700;
        color: #ffffff;
    }

    .navbar-cashier .cashier-balance img.balance-chip {
        width: 18px;
        height: 18px;
        flex: none;
    }

    .navbar-cashier button.button-wallet {
        height: 44px;
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 0 18px;
        border-radius: 0 4px 4px 0;
        background: #1475e1;
        font-size: 14px;
        font-weight: 700;
        color: #ffffff;
        transition: filter .15s ease;
    }

    .navbar-cashier button.button-wallet:hover {
        filter: brightness(1.12);
    }

    @media only screen and (max-width: 650px) {

        .navbar-cashier button.button-wallet span {
            display: none;
        }

    }
</style>
