<template>
    <div class="admin-settings-toggle">
        <div class="toggle-name">{{name}}</div>
        <button 
            v-on:click="adminSettingsToggle(!adminGetValue)" 
            v-bind:class="{ 'button-active': adminGetValue === true }" 
            v-bind:disabled="socketSendLoading !== null"
        ></button>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';

    export default {
        name: 'AdminSettingsToggle',
        props: [
            'name', 
            'setting'
        ],
        methods: {
            ...mapActions([
                'adminSendSettingValueSocket'
            ]),
            adminSettingsToggle(value) {
                const data = { setting: this.setting, value: value };
                this.adminSendSettingValueSocket(data);
            }
        },
        computed: {
            ...mapGetters([
                'socketSendLoading',
                'generalSettings'
            ]),
            adminGetValue() {
                let value = this.generalSettings;

                for(let key of this.setting.split('.')) {
                    value = value[key];
                }

                return value
            }
        }
    }
</script>

<style scoped>
    .admin-settings-toggle {
        width: 100%;
        height: 47px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 10px;
        padding: 0 10px;
        border-radius: 5px;
        background-color: rgba(47, 69, 83, 0.3);
    }

    .admin-settings-toggle .toggle-name {
        display: flex;
        align-items: center;
        font-size: 14px;
        font-weight: 700;
        color: #b1bad3;
    }

    .admin-settings-toggle button {
        width: 45px;
        height: 15px;
        position: relative;
        filter: none;
    }

    .admin-settings-toggle button:disabled {
        cursor: not-allowed;
    }

    .admin-settings-toggle button::before {
        content: '';
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background-color: #1a2c38;
        border-radius: 4px;
        isolation: isolate;
    }

    .admin-settings-toggle button::after {
        content: '';
        width: 25px;
        height: 19px;
        position: absolute;
        top: -2px;
        left: 0;
        background: #1c5064;
        border-radius: 4px;
        transition: all 0.3s ease;
        isolation: isolate;
    }

    .admin-settings-toggle button.button-active::after {
        transform: translate(20px, 0);
        background: #00e701;
    }
</style>