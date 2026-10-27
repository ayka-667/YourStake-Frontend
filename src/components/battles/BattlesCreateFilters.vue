<template>
    <div class="battles-create-filters">
        <div class="filters-left">
            <BattlesFilterMode />
            <div class="left-type">
                <button v-on:click="battlesTypeButton('standard')" v-bind:class="{ 'button-active': battlesFilterType === 'standard' }">Standard</button>
                <button v-on:click="battlesTypeButton('group')" v-bind:class="{ 'button-active': battlesFilterType === 'group' }" v-bind:disabled="battlesFilterMode === '2v2'">Group</button>
            </div>
        </div>
        <div class="filters-settings">
            <div class="settings-level" v-bind:class="{ 'level-active': battlesLevel >= 1 }">
                Min. level 
                <span>{{ battlesLevel }}</span>
                <input v-model="battlesLevel" v-on:input="battlesSetFilterLevel(battlesLevel)" type="range" min="0" max="100" step="1">
            </div>
            <div class="settings-funding" v-bind:class="{ 'funding-active': battlesFunding >= 1 }">
                Battle funding
                <input v-model="battlesFunding" v-on:input="battlesSetFilterFunding(battlesFunding)" type="range" min="0" max="100" step="1">
            </div>
        </div>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';
    import BattlesFilterMode from '@/components/battles/BattlesFilterMode';

    export default {
        name: 'BattlesCreateFilters',
        components: {
            BattlesFilterMode
        },
        data() {
            return {
                battlesLevel: 0,
                battlesFunding: 0
            }
        },
        methods: {
            ...mapActions([
                'battlesSetFilterType',
                'battlesSetFilterLevel',
                'battlesSetFilterFunding'
            ]),
            battlesTypeButton(value) {
                this.battlesSetFilterType(value);
            }
        },
        computed: {
            ...mapGetters([
                'battlesFilterMode',
                'battlesFilterType',
                'battlesFilterLevel',
                'battlesFilterFunding'
            ]) 
        },
        created() {
            this.battlesLevel = this.battlesFilterLevel;
            this.battlesFunding = this.battlesFilterFunding;
        }
    }
</script>

<style scoped>
    .battles-create-filters {
        width: 100%;
        display: flex;
        justify-content: space-between;
    }

    .battles-create-filters .filters-left,
    .battles-create-filters .filters-settings {
        display: flex;
        align-items: center;
    }

    .battles-create-filters .left-type  {
        position: relative;
        display: flex;
        align-items: center;
        margin-left: 20px;
        padding-left: 20px;
    }

    .battles-create-filters .left-type:before {
        content: '';
        width: 1px;
        height: 27px;
        position: absolute;
        top: 50%;
        left: 0;
        transform: translate(0, -50%);
        background: transparent;
    }

    .battles-create-filters .left-type button  {
        height: 40px;
        margin-right: 9px;
        padding: 0 23px;
        font-size: 14px;
        font-weight: 700;
        color: #b1bad3;       
        background: linear-gradient(0deg, rgba(255, 255, 255, 0.01) 0%, rgba(255, 255, 255, 0.01) 100%), 
                    linear-gradient(223deg, rgba(15, 33, 46, 0.35) 0%, rgba(31, 99, 153, 0.1) 50%, rgba(15, 33, 46, 0.35) 100%);
        border: 1px solid #1a2c38;
        opacity: 0.75;
        transition: all 0.3s ease;
    }

    .battles-create-filters .left-type button:last-child {
        margin-right: 0;
    }

    .battles-create-filters .left-type button.button-active {
        color: #ffffff;
        opacity: 1;
    }

    .battles-create-filters .settings-level,
    .battles-create-filters .settings-funding {
        display: flex;
        align-items: center;
        font-size: 14px;
        font-weight: 700;
        color: #537795;
    }

    .battles-create-filters .settings-funding {
        position: relative;
        margin-left: 20px;
        padding-left: 20px;
    }

    .battles-create-filters .settings-funding:before {
        content: '';
        width: 1px;
        height: 27px;
        position: absolute;
        top: 50%;
        left: 0;
        transform: translate(0, -50%);
        background: transparent;
    }

    .battles-create-filters .settings-level span {
        margin-left: 5px;
        color: #c0c7cc;
    }

    .battles-create-filters .settings-level input,
    .battles-create-filters .settings-funding input {
        width: 135px;
        height: 15px;
        position: relative;
        margin-left: 12px;
        -webkit-appearance: none;
        -moz-apperance: none;
        background-color: transparent;
        filter: none;
    }

    .battles-create-filters .settings-level input::before,
    .battles-create-filters .settings-funding input::before {
        content: '';
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background-color: #031523;
        border-radius: 4px;
        transition: background 0.3s ease;
        isolation: isolate;
    }

    .battles-create-filters .settings-level.level-active input::before,
    .battles-create-filters .settings-funding.funding-active input::before {
        background: rgba(0, 231, 1, 0.12);
    }

    .battles-create-filters .settings-level input::-webkit-slider-thumb,
    .battles-create-filters .settings-funding input::-webkit-slider-thumb {
        width: 25px;
        height: 19px;
        -webkit-appearance: none;
        appearance: none;
        background: #1c5064;
        border-radius: 4px;
        cursor: pointer;
        isolation: isolate;
    }

    .battles-create-filters .settings-level.level-active input::-webkit-slider-thumb,
    .battles-create-filters .settings-funding.funding-active input::-webkit-slider-thumb {
        background: #00e701;
    }

   .battles-create-filters .settings-level input::-moz-range-thumb,
   .battles-create-filters .settings-funding input::-moz-range-thumb {
        width: 25px;
        height: 19px;
        background: #1c5064;
        border-radius: 4px;
        cursor: pointer;
        isolation: isolate;
    }

    .battles-create-filters .settings-level.level-active input::-moz-slider-thumb,
    .battles-create-filters .settings-funding.funding-active input::-moz-slider-thumb {
        background: #00e701;
    }

    @media only screen and (max-width: 1100px) {

        .battles-create-filters {
            flex-direction: column;
        }

        .battles-create-filters .filters-left,
        .battles-create-filters .filters-settings {
            width: 100%;
        }

        .battles-create-filters .filters-settings {
            margin-top: 25px;
        }

    }

    @media only screen and (max-width: 600px) {

        .battles-create-filters .settings-level,
        .battles-create-filters .settings-funding {
            flex-wrap: wrap;
        }

        .battles-create-filters .settings-level input,
        .battles-create-filters .settings-funding input {
            width: 100%;
            margin-top: 10px;
            margin-left: 0;
        }

    }

    @media only screen and (max-width: 500px) {

        .battles-create-filters .filters-left {
            flex-direction: column;
        }

        .battles-create-filters .left-type  {
            width: 100%;
            margin-top: 10px;
            margin-left: 0;
            padding-left: 0;
        }

        .battles-create-filters .left-type:before  {
            display: none;
        }

        .battles-create-filters .left-type button {
            width: calc(50% - 4.5px);
        }

    }
</style>