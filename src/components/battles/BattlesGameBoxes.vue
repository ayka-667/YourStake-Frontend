<template>
    <div class="battles-game-boxes" v-bind:class="{ 'boxes-rolling': game !== null && game.state === 'rolling' }">
        <div class="boxes-background">
            <div class="background-inner"></div>
        </div>
        <div class="boxes-selector">
            <div class="selector-inner">
                <IconCheckGradient v-if="game !== null && game.state === 'completed'" />
            </div>
        </div>
        <transition-group class="boxes-list" name="list" tag="div">

            <button v-for="(box, index) in battlesGetBoxes" v-bind:key="box.pos" v-on:click="battlesBoxButton(box.box)" class="button-box" v-bind:class="{ 
                'button-active': index === 0 && ['created', 'countdown', 'pending'].includes(game.state) === true || box.pos === battlesGetRound - 1
            }">
                <img v-bind:src="unboxImagePath + '/public/img/' + box.box.slug + '.png'" />
            </button>

        </transition-group>
    </div>
</template>

<script>
    import { mapActions } from 'vuex';
    import IconCheckGradient from '@/components/icons/IconCheckGradient';

    export default {
        name: 'BattlesGameBoxes',
        components: {
            IconCheckGradient
        },
        props: ['game'],
        data() {
            return {
                unboxImagePath: process.env.VUE_APP_BACKEND_URL
            }
        },
        methods: {
            ...mapActions([
                'modalsSetShow',
                'modalsSetData'
            ]),
            battlesBoxButton(box) {
                this.modalsSetData({ box: box });
                this.modalsSetShow('Box');
            }
        },
        computed: {
            battlesGetRound() {
                let round = 1;

                if(this.game !== null && this.game.bets[0].outcomes !== undefined && this.game.bets[0].outcomes.length >= 1) { round = this.game.bets[0].outcomes.length; }

                return round;
            },
            battlesGetBoxes() {
                let pos = 0;
                let boxes = [];

                if(this.game !== null) {
                    for(const box of this.game.boxes) {
                        for(let i = 0; i < box.count; i++) { 
                            boxes.push({ pos: pos, box: box.box });
                            pos = pos + 1; 
                        }
                    }
                }

                return boxes.slice(this.battlesGetRound - 1, this.battlesGetRound + 11);
            }
        }
    }
</script>

<style scoped>
    .battles-game-boxes {
        image-rendering: pixelated;
        width: 100%;
        height: 64px;
        position: relative;
        display: flex;
        align-items: center;
        border-radius: 4px;
        z-index: 1;
    }

    .battles-game-boxes .boxes-background {
        width: 100%;
        height: 100%;
        position: absolute;
        padding: 1px;
        z-index: -1;
        image-rendering: pixelated;
    }

    .battles-game-boxes .boxes-background:before {
        content: '';
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background: #0d314e;
        border-radius: 4px;
        z-index: -1;
        isolation: isolate;
    }

    .battles-game-boxes .background-inner {
        width: 100%;
        height: 100%;
        display: flex;
        background: #052138;
        border-radius: 4px;
        isolation: isolate;
    }

    .battles-game-element .battles-game-boxes .background-inner {
        background: #07243b;
    }

    .battles-game-boxes .boxes-selector {
        width: 77px;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        padding: 1px;
        z-index: -1;
    }

    .battles-game-boxes .boxes-selector:before {
        content: '';
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background: transparent;
        border-radius: 4px;
        z-index: -1;
        isolation: isolate;
    }

    .battles-game-boxes .boxes-selector:after {
        content: '';
        width: calc(100% - 2px);
        height: calc(100% - 2px);
        position: absolute;
        top: 1px;
        left: 1px;
        background: #061e32;
        border-radius: 4px;
        z-index: -1;
        isolation: isolate;
    }

    .battles-game-boxes .selector-inner {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        background: #2f4553;
        border-radius: 4px;
        isolation: isolate;
    }

    .battles-game-boxes .selector-inner svg {
        z-index: 10;
    }

    .battles-game-boxes .boxes-list {
        position: relative;
        display: flex;
        align-items: center;
    }

    .battles-game-boxes .boxes-list .list-move,
    .battles-game-boxes .boxes-list .list-leave-active {
        transition: all 0.3s;
    }

    .battles-game-boxes .boxes-list .list-leave-active {
        position: absolute;
    }

    .battles-game-boxes .boxes-list .list-leave-to {
        transform: translateX(-62px);
    }

    .battles-game-boxes button.button-box {
        height: 100%;
        display: flex;
        flex-shrink: 0;
        justify-content: center;
        align-items: center;
        margin-right: 14px;
    }

    .battles-game-element .battles-game-boxes button.button-box  {
        pointer-events: none;
    }

    .battles-game-boxes button.button-box.button-active {
        width: 77px;
        margin-right: 11px;
    }

    .battles-game-boxes button.button-box img {
        width: 48px;
        opacity: 0.3;
    }

    .battles-game-boxes button.button-box.button-active img {
        transform: scale(1.1);
    }

    .battles-game-boxes.boxes-rolling button.button-box.button-active img {
        opacity: 1;
        mix-blend-mode: normal;
    }
</style>