<template>
    <button v-on:click="crashInfoButton" class="crash-history-element" v-bind:class="{
        'element-high': crashGetOutcome >= 10,
        'element-mid': crashGetOutcome < 10 && crashGetOutcome >= 2
    }">
        <div class="element-inner">
            <span>{{crashGetOutcome}}x</span>
        </div>
    </button>
</template>

<script>
    import { mapActions } from 'vuex';

    export default {
        name: 'CrashHistoryElement',
        props: [
            'game'
        ],
        methods: {
            ...mapActions([
                'modalsSetData', 
                'modalsSetShow'
            ]),
            crashInfoButton() {
                this.modalsSetData({ game: this.game });
                this.modalsSetShow('FairGame');
            }
        },
        computed: {
            crashGetOutcome() {
                return parseFloat(this.game.outcome / 100).toFixed(2);
            }
        }
    }
</script>

<style scoped>
    button.crash-history-element {
        width: 70px;
        height: 35px;
        position: relative;
        flex-shrink: 0;
        margin-right: 4px;
    }

    button.crash-history-element:last-of-type {
        margin-right: 0;
    }

    button.crash-history-element::before {
        content: '';
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background: transparent;
        border-radius: 4px;
        isolation: isolate;
    }

    button.crash-history-element.element-high::before {
        background: transparent;
    }

    button.crash-history-element.element-mid::before {
        background: transparent;
    }

    button.crash-history-element.element-high::after,
    button.crash-history-element.element-mid::after {
        content: '';
        width: calc(100% - 2px);
        height: calc(100% - 2px);
        position: absolute;
        top: 1px;
        left: 1px;
        background-color: #072c44;
        border-radius: 4px;
        isolation: isolate;
    }

    button.crash-history-element .element-inner {
        width: calc(100% - 2px);
        height: calc(100% - 2px);
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        top: 1px;
        left: 1px;
        background: #213743;
        border-radius: 4px;
        z-index: 1;
        isolation: isolate;
    }

    button.crash-history-element.element-high .element-inner {
        background: #2f4553;
    }

    button.crash-history-element.element-mid .element-inner {
        background: #2f4553;
    }

    button.crash-history-element .element-inner span {
        font-size: 14px;
        font-weight: 700;
        color: #b1bad3;
    }

    button.crash-history-element.element-high .element-inner span {
        background: #ffa600;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        text-fill-color: transparent;
    }

    button.crash-history-element.element-mid .element-inner span {
        background: #00e701;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        text-fill-color: transparent;
    }
</style>
