<template>
    <div class="admin-settings-select">
        <div class="select-name">{{name}}</div>
        <select v-model="adminValue" v-on:change="adminSettingsSelect()" v-bind:disabled="socketSendLoading !== null">
            <option value="0.5">0.5</option>
            <option value="1">1</option>
            <option value="2">2</option>
        </select>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';

    export default {
        name: 'AdminSettingsSelect',
        props: [
            'name', 
            'setting'
        ],
        data() {
            return {
                adminValue: null
            }
        },
        methods: {
            ...mapActions([
                'adminSendSettingValueSocket'
            ]),
            adminSettingsSelect(value) {
                const data = { setting: this.setting, value: this.adminValue };
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
        },
        created() {
            this.adminValue = this.adminGetValue;
        }
    }
</script>

<style scoped>
    .admin-settings-select {
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

    .admin-settings-select .select-name {
        display: flex;
        align-items: center;
        font-size: 14px;
        font-weight: 600;
        color: #ffffff;
    }

    .admin-settings-select select {
        width: 60px;
        height: 33px;
        padding: 0 5px;
        border-radius: 6px;
        border: 2px solid #2f4553;
        font-size: 12px;
        font-weight: 600;
        color: #ffffff;
        background: #0f212e;
    }
</style>