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
                    value = value !== undefined && value !== null ? value[key] : undefined;
                }

                // The server only blocks a game when its setting is explicitly false
                return value === undefined ? true : value;
            }
        }
    }
</script>

<style scoped>
    .admin-settings-toggle {
        width: 100%;
        height: 46px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 8px;
        padding: 0 12px;
        border-radius: 8px;
        background-color: #1a2c38;
    }

    .admin-settings-toggle .toggle-name {
        display: flex;
        align-items: center;
        font-size: 14px;
        font-weight: 600;
        color: #ffffff;
    }

    .admin-settings-toggle button {
        width: 40px;
        height: 22px;
        position: relative;
        flex: none;
        border-radius: 999px;
        background: #2f4553;
        filter: none;
        transition: background .2s ease;
    }

    .admin-settings-toggle button:disabled {
        cursor: not-allowed;
        opacity: .6;
    }

    .admin-settings-toggle button::after {
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

    .admin-settings-toggle button.button-active {
        background: #00e701;
    }

    .admin-settings-toggle button.button-active::after {
        transform: translateX(18px);
    }
</style>
