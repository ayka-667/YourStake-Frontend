<template>
    <div class="admin-user-settings">
        <div class="settings-element element-toggle">
            <div class="element-name">Rain lock</div>
            <button v-on:click="adminValueButton('limits.blockRain', !modalsData.user.limits.blockRain)" v-bind:class="{ 
                'button-active': modalsData.user.limits.blockRain === true 
            }" v-bind:disabled="socketSendLoading !== null"></button>
        </div>
        <div class="settings-element element-toggle">
            <div class="element-name">Tip lock</div>
            <button v-on:click="adminValueButton('limits.blockTip', !modalsData.user.limits.blockTip)" v-bind:class="{ 
                'button-active': modalsData.user.limits.blockTip === true 
            }" v-bind:disabled="socketSendLoading !== null"></button>
        </div>
        <div v-if="modalsData.user.limits.blockTip === true" class="settings-element element-sub element-number">
            <div class="element-name">Set tip limit</div>
            <div class="element-input">
                <img src="@/assets/img/icons/coin.svg" alt="icon" />
                <input v-model="adminLimitTip" type="text" />
                <button v-on:click="adminValueButton('limits.limitTip', Math.floor(adminLimitTip * 1000))" v-bind:disabled="socketSendLoading !== null">
                    <div class="button-inner">Update</div>
                </button>
            </div>
        </div>
        <div class="settings-element element-toggle">
            <div class="element-name">Sponsorship lock</div>
            <button v-on:click="adminValueButton('limits.blockSponsor', !modalsData.user.limits.blockSponsor)" v-bind:class="{ 
                'button-active': modalsData.user.limits.blockSponsor === true 
            }" v-bind:disabled="socketSendLoading !== null"></button>
        </div>
        <div class="settings-element element-toggle">
            <div class="element-name">Leaderboard lock</div>
            <button v-on:click="adminValueButton('limits.blockLeaderboard', !modalsData.user.limits.blockLeaderboard)" v-bind:class="{ 
                'button-active': modalsData.user.limits.blockLeaderboard === true 
            }" v-bind:disabled="socketSendLoading !== null"></button>
        </div>
        <div class="settings-element element-button">
            <div class="element-name">Clear leaderboard</div>
            <button v-on:click="adminValueButton('leaderboard.points', 0)">
                <div class="button-inner">Clear</div>
            </button>
        </div>
        <div class="settings-element element-select">
            <div class="element-name">Set rank</div>
            <div class="element-input">
                <select v-model="adminRank">
                    <option value="user">User</option>
                    <option value="partner">Partner</option>
                    <option value="mod">Mod</option>
                    <option value="admin">Admin</option>
                </select>
                <button v-on:click="adminValueButton('rank', adminRank)" v-bind:disabled="socketSendLoading !== null">
                    <div class="button-inner">Update</div>
                </button>
            </div>
        </div>
        <AdminUserCredit v-bind:userId="modalsData.user._id" />
        <div class="settings-element element-number">
            <div class="element-name">Set balance</div>
            <div class="element-input">
                <img src="@/assets/img/icons/coin.svg" alt="icon" />
                <input v-model="adminBalance" type="text" />
                <button v-on:click="adminBalanceButton()" v-bind:disabled="socketSendLoading !== null">
                    <div class="button-inner">Update</div>
                </button>
            </div>
        </div>
        <div class="settings-element element-number">
            <div class="element-name">Set vault</div>
            <div class="element-input">
                <img src="@/assets/img/icons/coin.svg" alt="icon" />
                <input v-model="adminVault" type="text" />
                <button v-on:click="adminValueButton('vault.amount', Math.floor(adminVault * 1000))" v-bind:disabled="socketSendLoading !== null">
                    <div class="button-inner">Update</div>
                </button>
            </div>
        </div>
        <div class="settings-element element-number">
            <div class="element-name">Set deposit</div>
            <div class="element-input">
                <img src="@/assets/img/icons/coin.svg" alt="icon" />
                <input v-model="adminDeposit" type="text" />
                <button v-on:click="adminValueButton('stats.deposit', Math.floor(adminDeposit * 1000))" v-bind:disabled="socketSendLoading !== null">
                    <div class="button-inner">Update</div>
                </button>
            </div>
        </div>
        <div class="settings-element element-number">
            <div class="element-name">Set withdraw</div>
            <div class="element-input">
                <img src="@/assets/img/icons/coin.svg" alt="icon" />
                <input v-model="adminWithdraw" type="text" />
                <button v-on:click="adminValueButton('stats.withdraw', Math.floor(adminWithdraw * 1000))" v-bind:disabled="socketSendLoading !== null">
                    <div class="button-inner">Update</div>
                </button>
            </div>
        </div>
        <div class="settings-element element-button">
            <div class="element-name">Mute user</div>
            <button v-on:click="adminMuteButton()" class="button-red">
                <div class="button-inner">Mute</div>
            </button>
        </div>
        <div class="settings-element element-button">
            <div class="element-name">Ban user</div>
            <button v-on:click="adminBanButton()" class="button-red">
                <div class="button-inner">Ban</div>
            </button>
        </div>
    </div>
</template>

<script>
    import AdminUserCredit from '@/components/admin/user/AdminUserCredit';
    import { mapGetters, mapActions } from 'vuex';

    export default {
        name: 'AdminUserSettings',
        components: {
            AdminUserCredit
        },
        data() {
            return {
                adminLimitTip: null,
                adminRank: null,
                adminBalance: null,
                adminVault: null,
                adminDeposit: null,
                adminWithdraw: null
            }
        },
        methods: {
            ...mapActions([
                'notificationShow',
                'modalsSetShow',
                'adminSendUserValueSocket',
                'adminSendUserBalanceSocket', 
                'generalSetUserInfoData'
            ]),
            adminValueButton(setting, value) {
                if(setting === 'limits.limitTip' && (isNaN(value) === true || value < 0)) {
                    this.notificationShow({type: 'error', message: 'Your entered tip limit is invalid.'});
                    return;
                }

                const data = { userId: this.modalsData.user._id, setting: setting, value: value };
                this.adminSendUserValueSocket(data);
            },
            adminBalanceButton() {
                const balance = Math.floor(this.adminBalance * 1000);

                if(balance === null || isNaN(balance) === true || balance < 0) {
                    this.notificationShow({type: 'error', message: 'Your entered user balance is invalid.'});
                    return;
                }

                const data = { userId: this.modalsData.user._id, balance: balance };
                this.adminSendUserBalanceSocket(data);
            },
            adminMuteButton() {
                this.modalsSetShow(null);
                this.generalSetUserInfoData(this.modalsData.user);

                setTimeout(() => { this.modalsSetShow('Mute'); }, 300);
            },
            adminBanButton() {
                this.modalsSetShow(null);
                this.generalSetUserInfoData(this.modalsData.user);

                setTimeout(() => { this.modalsSetShow('Ban'); }, 300);
            }
        },
        computed: {
            ...mapGetters([
                'socketSendLoading',  
                'modalsData'
            ])
        },
        watch: {
            'modalsData': {
                handler(data, oldData) {
                    this.adminLimitTip = (Math.floor(this.modalsData.user.limits.limitTip / 10) / 100).toFixed(2);
                    this.adminRank = this.modalsData.user.rank;
                    this.adminBalance = (Math.floor(this.modalsData.user.balance / 10) / 100).toFixed(2);
                    this.adminVault = (Math.floor(this.modalsData.user.vault.amount / 10) / 100).toFixed(2);
                    this.adminDeposit = (Math.floor(this.modalsData.user.stats.deposit / 10) / 100).toFixed(2);
                    this.adminWithdraw = (Math.floor(this.modalsData.user.stats.withdraw / 10) / 100).toFixed(2);
                },
                deep: true
            }
        },
        created() {
            this.adminLimitTip = (Math.floor(this.modalsData.user.limits.limitTip / 10) / 100).toFixed(2);
            this.adminRank = this.modalsData.user.rank;
            this.adminBalance = (Math.floor(this.modalsData.user.balance / 10) / 100).toFixed(2);
            this.adminVault = (Math.floor(this.modalsData.user.vault.amount / 10) / 100).toFixed(2);
            this.adminDeposit = (Math.floor(this.modalsData.user.stats.deposit / 10) / 100).toFixed(2);
            this.adminWithdraw = (Math.floor(this.modalsData.user.stats.withdraw / 10) / 100).toFixed(2);
        }
    }
</script>

<style scoped>
    .admin-user-settings {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .admin-user-settings .settings-element {
        width: 100%;
        height: 47px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 15px;
        padding: 0 20px;
        border-radius: 5px;
        background: rgba(47, 69, 83, 0.3);
    }

    .admin-user-settings .settings-element:first-of-type {
        margin-top: 0;
    }

    .admin-user-settings .element-name {
        display: flex;
        align-items: center;
        font-size: 14px;
        font-weight: 700;
        color: #b1bad3;
    }

    .admin-user-settings .settings-element.element-toggle button {
        width: 40px;
        height: 22px;
        position: relative;
        flex: none;
        border-radius: 999px;
        background: #2f4553;
        filter: none;
        transition: background .2s ease;
    }

    .admin-user-settings .settings-element.element-toggle button:disabled {
        cursor: not-allowed;
        opacity: .6;
    }

    .admin-user-settings .settings-element.element-toggle button::after {
        content: '';
        width: 16px;
        height: 16px;
        position: absolute;
        top: 3px;
        left: 3px;
        border-radius: 50%;
        background: #ffffff;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
        transition: transform .25s cubic-bezier(.32, .72, 0, 1);
    }

    .admin-user-settings .settings-element.element-toggle button.button-active {
        background: #00e701;
    }

    .admin-user-settings .settings-element.element-toggle button.button-active::after {
        transform: translateX(18px);
    }

    .admin-user-settings .settings-element.element-text .element-input,
    .admin-user-settings .settings-element.element-number .element-input {
        position: relative;
        display: flex;
        align-items: center;
    }

    .admin-user-settings .settings-element.element-number .element-input img {
        width: 15px;
        height: 15px;
        position: absolute;
        top: 9px;
        left: 15px;
    }

    .admin-user-settings .settings-element.element-text .element-input input,
    .admin-user-settings .settings-element.element-number .element-input input,
    .admin-user-settings .settings-element.element-select .element-input select {
        width: 220px;
        height: 33px;
        margin-right: 20px;
        padding: 0 15px;
        border-radius: 5px;
        font-size: 12px;
        font-weight: 600;
        color: #ffffff;
        background: #0f212e;
    }

    .admin-user-settings .settings-element.element-number .element-input input {
        padding: 0 15px 0 37px;
    }

    .admin-user-settings .settings-element.element-button button,
    .admin-user-settings .settings-element.element-text .element-input button,
    .admin-user-settings .settings-element.element-number .element-input button,
    .admin-user-settings .settings-element.element-select .element-input button {
        width: 60px;
        height: 30px;
        filter: none;
    }

    .admin-user-settings .settings-element.element-button button .button-inner,
    .admin-user-settings .settings-element.element-text .element-input button .button-inner,
    .admin-user-settings .settings-element.element-number .element-input button .button-inner,
    .admin-user-settings .settings-element.element-select .element-input button .button-inner {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 12px;
        font-weight: 700;
        color: #ffffff;
        background: #00e701;
        border-radius: 4px;
        isolation: isolate;
    }

   .admin-user-settings .settings-element.element-button button.button-red .button-inner {
       background: #f55046;
   }

   @media only screen and (max-width: 793px) {

        .admin-user-settings {
            padding: 0 20px;
        }

    }
</style>
