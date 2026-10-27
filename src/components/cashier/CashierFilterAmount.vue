<template>
    <div class="cashier-filter-amount">
        <div class="amount-min">
            <input v-on:change="cashierSetValueMin" v-model="cashierValueMin" type="text" placeholder="Min Price" />
            <img src="@/assets/img/icons/coin.svg" />
        </div>
        <div class="amount-max">
            <input v-on:change="cashierSetValueMax" v-model="cashierValueMax" type="text" placeholder="Max Price" />
            <img src="@/assets/img/icons/coin.svg" />
        </div>
    </div>
</template>

<script>
    import { mapActions } from 'vuex';

    export default {
        name: 'CashierFilterAmount',
        data() {
            return  {
                cashierValueMin: '',
                cashierValueMax: ''
            }
        },
        methods: {
            ...mapActions([
                'cashierSetFilterAmountMin',
                'cashierSetFilterAmountMax'
            ]),
            cashierSetValueMin() {
                this.cashierSetFilterAmountMin(this.cashierValueMin);
            },
            cashierSetValueMax() {
                this.cashierSetFilterAmountMax(this.cashierValueMax);
            }
        }
    }
</script>

<style scoped>
    .cashier-filter-amount {
        display: flex;
        align-items: center;
    }

    .cashier-filter-amount .amount-min,
    .cashier-filter-amount .amount-max {
        width: 102px;
        height: 52px;
        position: relative;
        margin-right: 10px;
        padding: 1px;
        z-index: 1;
    }

    .cashier-filter-amount .amount-min:before,
    .cashier-filter-amount .amount-max:before {
        content: '';
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background: linear-gradient(180deg, rgba(4, 19, 31, 0.73) 0%, rgba(34, 58, 78, 0.73) 100%);
        border-radius: 4px;
        z-index: -1;
        isolation: isolate;
    }

    .cashier-filter-amount .amount-min input,
    .cashier-filter-amount .amount-max input {
        width: 100%;
        height: 100%;
        padding: 0 0 0 27px;
        font-size: 12px;
        font-weight: 600;
        color: #ffffff;
        background: #041b2d;
        border-radius: 4px;
        isolation: isolate;
    }

    .cashier-filter-amount .amount-min input::placeholder,
    .cashier-filter-amount .amount-max input::placeholder  {
        color: rgba(110, 149, 182, 0.5);
    }

    .cashier-filter-amount .amount-min img,
    .cashier-filter-amount .amount-max img {
        width: 11px;
        height: 11px;
        position: absolute;
        top: 50%;
        left: 10px;
        transform: translate(0, -50%);
    }

    @media only screen and (max-width: 500px) {

        .cashier-filter-amount {
            width: 100%;
        }

        .cashier-filter-amount .amount-min,
        .cashier-filter-amount .amount-max {
            width: calc(50% - 5px);
        }

        .cashier-filter-amount .amount-max {
            margin-right: 0;
        }

    }
</style>