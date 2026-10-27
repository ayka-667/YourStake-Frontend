<template>
    <div class="profile-stats">
        <div class="stats-element">
            <div class="element-title">Total deposited</div>
            <div class="element-amount">
                <div class="amount-inner">
                    <img src="@/assets/img/icons/coin.svg" alt="icon" />
                    <div class="inner-value">
                        <span>{{profileFormatValue(authUser.user.stats.deposit).split('.')[0]}}</span>.{{profileFormatValue(authUser.user.stats.deposit).split('.')[1]}}
                    </div>
                </div>
            </div>
        </div>
        <div class="stats-element">
            <div class="element-title">Total withdrawn</div>
            <div class="element-amount">
                <div class="amount-inner">
                    <img src="@/assets/img/icons/coin.svg" alt="icon" />
                    <div class="inner-value">
                        <span>{{profileFormatValue(authUser.user.stats.withdraw).split('.')[0]}}</span>.{{profileFormatValue(authUser.user.stats.withdraw).split('.')[1]}}
                    </div>
                </div>
            </div>
        </div>
        <div class="stats-element">
            <div class="element-title">Total Wagered</div>
            <div class="element-amount">
                <div class="amount-inner">
                    <img src="@/assets/img/icons/coin.svg" alt="icon" />
                    <div class="inner-value">
                        <span>{{profileFormatValue(authUser.user.stats.bet).split('.')[0]}}</span>.{{profileFormatValue(authUser.user.stats.bet).split('.')[1]}}
                    </div>
                </div>
            </div>
        </div>
        <div class="stats-element element-profit" v-bind:class="{ 'element-negative': (authUser.user.stats.withdraw - authUser.user.stats.deposit) < 0 }">
            <div class="element-title">Total Profit</div>
            <div class="element-amount">
                <div class="amount-inner">
                    <img src="@/assets/img/icons/coin.svg" alt="icon" />
                    <div class="inner-value">
                        <span>{{profileFormatValue(authUser.user.stats.withdraw - authUser.user.stats.deposit).split('.')[0]}}</span>.{{profileFormatValue(authUser.user.stats.withdraw - authUser.user.stats.deposit).split('.')[1]}}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex';

    export default {
        name: 'ProfileStats',
        methods: {
            profileFormatValue(value) {
                return parseFloat(Math.floor(value / 10) / 100).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            }
        },
        computed: {
            ...mapGetters([
                'authUser'
            ])
        }
    }
</script>

<style scoped>
    .profile-stats {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 35px;
        padding-top: 30px;
        border-top: 1px solid rgba(255, 255, 255, 0.04);
    }

    .profile-stats .stats-element {
        width: calc(25% - 15px);
    }

    .profile-stats .element-title {
        text-align: center;
        font-size: 12px;
        font-weight: 600;
        color: #557086;
    }

    .profile-stats .stats-element.element-profit .element-title {
        background: #00e701;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        text-fill-color: transparent;
    }

    .profile-stats .stats-element.element-negative .element-title {
        background: linear-gradient(250deg, #d15e5e 0%, #ff4545 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        text-fill-color: transparent;
    }

    .profile-stats .element-amount {
        width: 100%;
        height: 70px;
        position: relative;
        margin-top: 12px;
        padding: 1px;
    }

    .profile-stats .element-amount::before {
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

    .profile-stats .stats-element.element-profit .element-amount::before {
        background: #213743;
    }

    .profile-stats .stats-element.element-negative .element-amount::before {
        background: linear-gradient(180deg, #0f212e 25%, #cf5048 100%);
    }

    .profile-stats .amount-inner {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #041e30;
        border-radius: 4px;
        z-index: 1;
        isolation: isolate;
    }

    .profile-stats .stats-element.element-profit .amount-inner {
        background: #2f4553;
    }

    .profile-stats .stats-element.element-negative .amount-inner {
        background: #2f4553;
    }

    .profile-stats .amount-inner img {
        width: 17px;
        height: 17px;
        margin-right: 8px;
    }

    .profile-stats .inner-value {
        font-size: 14px;
        font-weight: 600;
        color: #c1c1c1;
    }

    .profile-stats .inner-value span {
        font-size: 16px;
        font-weight: 700;
        color: #ffffff;
    }

    @media only screen and (max-width: 950px) {

        .profile-stats {
            flex-wrap: wrap;
        }

        .profile-stats .stats-element {
            width: calc(33.33% - 10px);
        }

        .profile-stats .stats-element.element-profit {
            width: 100%;
            margin-top: 20px;
        }

    }

    @media only screen and (max-width: 650px) {

        .profile-stats .stats-element {
            width: calc(50% - 7.5px);
        }

        .profile-stats .stats-element:nth-child(3) {
            width: 100%;
            margin-top: 20px;
        }

    }
</style>