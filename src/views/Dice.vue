<template>
    <OriginalsShell class="dice">
        <template v-slot:panel>
            <OriginalsPanel v-bind:multiplier="diceMultiplier" v-bind:busy="diceSending" v-bind:disabled="diceSending" v-on:bet="diceBet" />
        </template>

        <div class="dice-stage">
            <transition-group name="history" tag="div" class="dice-history">
                <div v-for="item in diceHistory" v-bind:key="item.id" class="history-item" v-bind:class="{ 'item-won': item.won }">
                    {{ item.roll.toFixed(2) }}
                </div>
            </transition-group>

            <div class="dice-slider">
                <div class="slider-frame">
                    <div class="slider-track" v-bind:style="diceTrackStyle">
                        <div v-if="diceResult !== null" class="track-result" v-bind:class="{ 'result-won': diceResult.won, 'result-show': diceResultShow }"
                            v-bind:style="{ left: diceResult.roll + '%' }">
                            <div class="result-badge">{{ diceResult.roll.toFixed(2) }}</div>
                        </div>
                        <input v-model.number="diceTarget" v-on:input="diceClampTarget" type="range" min="0" max="100" step="1" aria-label="Target" />
                    </div>
                </div>

                <div class="slider-scale">
                    <span v-for="mark in [0, 25, 50, 75, 100]" v-bind:key="mark" v-bind:style="{ left: mark + '%' }">{{ mark }}</span>
                </div>
            </div>

            <div class="dice-fields">
                <label class="field">
                    <span class="field-label">Multiplier</span>
                    <div class="field-box">
                        <input v-bind:value="diceMultiplier.toFixed(4)" v-on:change="diceSetMultiplier($event.target.value)" type="text" inputmode="decimal" />
                        <span class="field-unit">×</span>
                    </div>
                </label>
                <div class="field">
                    <span class="field-label">Roll {{ diceDirection === 'under' ? 'Under' : 'Over' }}</span>
                    <button v-on:click="diceToggleDirection()" class="field-box field-toggle">
                        <span>{{ diceTarget.toFixed(2) }}</span>
                        <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 5h9l-2.5-2.5M13 11H4l2.5 2.5" /></svg>
                    </button>
                </div>
                <label class="field">
                    <span class="field-label">Win Chance</span>
                    <div class="field-box">
                        <input v-bind:value="diceChance.toFixed(4)" v-on:change="diceSetChance($event.target.value)" type="text" inputmode="decimal" />
                        <span class="field-unit">%</span>
                    </div>
                </label>
            </div>
        </div>
    </OriginalsShell>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';
    import OriginalsShell from '@/components/originals/OriginalsShell';
    import OriginalsPanel from '@/components/originals/OriginalsPanel';
    import sfx from '@/utils/sfx';

    export default {
        name: 'Dice',
        metaInfo: {
            title: 'Dice - YourStake.fr'
        },
        components: {
            OriginalsShell,
            OriginalsPanel
        },
        data() {
            return {
                diceTarget: 50,
                diceDirection: 'over',
                diceSending: false,
                diceResult: null,
                diceResultShow: false,
                diceHistory: []
            }
        },
        methods: {
            ...mapActions([
                'socketConnectOriginals',
                'socketDisconnectOriginals',
                'originalsSendBetSocket',
                'originalsSettle',
                'originalsFlush'
            ]),
            diceClampTarget() {
                this.diceTarget = Math.min(98, Math.max(2, Math.round(Number(this.diceTarget) * 100) / 100));
            },
            diceSetChance(value) {
                const chance = Math.min(98, Math.max(2, parseFloat(String(value).replace(',', '.')) || 50));
                this.diceTarget = Math.round((this.diceDirection === 'under' ? chance : 100 - chance) * 100) / 100;
            },
            diceSetMultiplier(value) {
                const multiplier = parseFloat(String(value).replace(',', '.'));
                if(isNaN(multiplier) === true || multiplier <= 0) { return; }
                this.diceSetChance(this.diceEdge * 100 / multiplier);
            },
            diceToggleDirection() {
                this.diceDirection = this.diceDirection === 'under' ? 'over' : 'under';
                this.diceTarget = Math.round((100 - this.diceTarget) * 100) / 100;
            },
            async diceBet(amount) {
                if(this.diceSending === true) { return; }
                this.diceSending = true;

                const game = await this.originalsSendBetSocket({ game: 'dice', amount: amount, target: this.diceTarget, direction: this.diceDirection });
                this.diceSending = false;
                if(game === null) { return; }

                const won = game.payout > 0;
                sfx.roll();

                this.diceResultShow = false;
                this.diceResult = { roll: game.outcome.roll, won: won };
                this.$nextTick(() => { this.diceResultShow = true; });

                setTimeout(() => {
                    this.originalsSettle(game);
                    if(won === true) { game.multiplier >= 1000 ? sfx.bigWin() : sfx.win(); }
                    else { sfx.lose(); }

                    this.diceHistory.unshift({ id: game._id, roll: game.outcome.roll, won: won });
                    this.diceHistory = this.diceHistory.slice(0, 6);
                }, 420);
            }
        },
        computed: {
            ...mapGetters([
                'originalsConfig'
            ]),
            diceEdge() {
                return this.originalsConfig !== null ? this.originalsConfig.diceEdge : 0.99;
            },
            diceChance() {
                return this.diceDirection === 'under' ? this.diceTarget : 100 - this.diceTarget;
            },
            diceMultiplier() {
                return Math.floor((this.diceEdge * 100 / this.diceChance) * 10000) / 10000;
            },
            diceTrackStyle() {
                const red = '#ff3b5c';
                const green = '#00e701';
                const left = this.diceDirection === 'under' ? green : red;
                const right = this.diceDirection === 'under' ? red : green;
                return { background: 'linear-gradient(90deg, ' + left + ' 0 ' + this.diceTarget + '%, ' + right + ' ' + this.diceTarget + '% 100%)' };
            }
        },
        created() {
            this.socketConnectOriginals();
        },
        beforeRouteLeave(to, from, next) {
            this.originalsFlush();
            this.socketDisconnectOriginals();
            next();
        }
    }
</script>

<style scoped>
    .dice-stage {
        position: absolute;
        inset: 0;
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 56px;
        padding: 70px 48px 40px 48px;
    }

    .dice-history {
        position: absolute;
        top: 18px;
        right: 18px;
        display: flex;
        gap: 6px;
    }

    .dice-history .history-item {
        padding: 6px 10px;
        border-radius: 999px;
        background: #2f4553;
        font-size: 12px;
        font-weight: 700;
        font-variant-numeric: tabular-nums;
        color: #b1bad3;
    }

    .dice-history .history-item.item-won {
        background: #00e701;
        color: #05080a;
    }

    .dice-history .history-enter-active {
        transition: transform .45s cubic-bezier(.32, .72, 0, 1), opacity .3s ease;
    }

    .dice-history .history-enter {
        transform: scale(.6);
        opacity: 0;
    }

    .dice-history .history-leave-active {
        display: none;
    }

    .dice-history .history-move {
        transition: transform .45s cubic-bezier(.32, .72, 0, 1);
    }

    .dice-slider {
        position: relative;
        width: 100%;
        max-width: 760px;
        margin: 0 auto;
    }

    .dice-slider .slider-scale {
        position: relative;
        height: 20px;
        margin: 12px 22px 0 22px;
    }

    .dice-slider .slider-scale span {
        position: absolute;
        transform: translateX(-50%);
        font-size: 13px;
        font-weight: 700;
        color: #b1bad3;
    }

    .dice-slider .slider-frame {
        padding: 18px 22px;
        border-radius: 999px;
        background: #2f4553;
        box-shadow: inset 0 -3px 0 rgba(0, 0, 0, 0.2);
    }

    .dice-slider .slider-track {
        position: relative;
        height: 10px;
        border-radius: 5px;
        transition: background .25s ease;
    }

    .dice-slider .slider-track input {
        position: absolute;
        top: 50%;
        left: -14px;
        width: calc(100% + 28px);
        height: 34px;
        transform: translateY(-50%);
        -webkit-appearance: none;
        appearance: none;
        background: transparent;
        cursor: grab;
    }

    .dice-slider .slider-track input:active {
        cursor: grabbing;
    }

    .dice-slider .slider-track input::-webkit-slider-runnable-track {
        height: 34px;
        background: transparent;
    }

    .dice-slider .slider-track input::-moz-range-track {
        height: 34px;
        background: transparent;
    }

    .dice-slider .slider-track input::-webkit-slider-thumb {
        width: 28px;
        height: 34px;
        -webkit-appearance: none;
        appearance: none;
        border-radius: 6px;
        background:
            linear-gradient(90deg, transparent 9px, #7aa3c2 9px 11px, transparent 11px 13px, #7aa3c2 13px 15px, transparent 15px 17px, #7aa3c2 17px 19px, transparent 19px) center / 100% 40% no-repeat,
            #4d8fd6;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.35), inset 0 -3px 0 rgba(0, 0, 0, 0.2);
        transition: transform .2s ease;
    }

    .dice-slider .slider-track input::-moz-range-thumb {
        width: 28px;
        height: 34px;
        border: none;
        border-radius: 6px;
        background: #4d8fd6;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.35);
    }

    .dice-slider .slider-track input:active::-webkit-slider-thumb {
        transform: scale(1.06);
    }

    .dice-slider .track-result {
        position: absolute;
        bottom: 34px;
        transform: translateX(-50%);
        transition: left .45s cubic-bezier(.32, .72, 0, 1);
        pointer-events: none;
        z-index: 2;
    }

    .dice-slider .result-badge {
        position: relative;
        min-width: 64px;
        padding: 10px 12px;
        border-radius: 10px;
        background: #ffffff;
        text-align: center;
        font-size: 17px;
        font-weight: 800;
        font-variant-numeric: tabular-nums;
        color: #ff3b5c;
        box-shadow: 0 10px 24px rgba(0, 0, 0, 0.35);
        transform: translateY(8px) scale(.85);
        opacity: 0;
        transition: transform .45s cubic-bezier(.32, .72, 0, 1), opacity .25s ease, color .2s ease;
    }

    .dice-slider .result-badge::after {
        content: '';
        position: absolute;
        left: 50%;
        bottom: -6px;
        width: 12px;
        height: 12px;
        background: #ffffff;
        transform: translateX(-50%) rotate(45deg);
        border-radius: 2px;
    }

    .dice-slider .track-result.result-won .result-badge {
        color: #00b301;
    }

    .dice-slider .track-result.result-show .result-badge {
        transform: none;
        opacity: 1;
    }

    .dice-fields {
        width: 100%;
        max-width: 760px;
        margin: 0 auto;
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 12px;
        padding: 14px;
        border-radius: 12px;
        background: #213743;
    }

    .dice-fields .field-label {
        display: block;
        margin-bottom: 6px;
        font-size: 13px;
        font-weight: 600;
        color: #b1bad3;
    }

    .dice-fields .field-box {
        width: 100%;
        height: 42px;
        display: flex;
        align-items: center;
        padding: 0 12px;
        border-radius: 6px;
        border: 2px solid #2f4553;
        background: #0f212e;
        transition: border-color .2s ease;
    }

    .dice-fields .field-box:hover,
    .dice-fields .field-box:focus-within {
        border-color: #557086;
    }

    .dice-fields .field-box input {
        flex: 1;
        min-width: 0;
        height: 100%;
        outline: none;
        background: transparent;
        font-size: 14px;
        font-weight: 600;
        font-variant-numeric: tabular-nums;
        color: #ffffff;
    }

    .dice-fields .field-unit {
        font-size: 14px;
        font-weight: 700;
        color: #b1bad3;
    }

    .dice-fields button.field-toggle {
        justify-content: space-between;
        font-size: 14px;
        font-weight: 600;
        font-variant-numeric: tabular-nums;
        color: #ffffff;
    }

    .dice-fields button.field-toggle svg {
        width: 16px;
        height: 16px;
        fill: none;
        stroke: #b1bad3;
        stroke-width: 1.8;
        stroke-linecap: round;
        stroke-linejoin: round;
        transition: transform .4s cubic-bezier(.32, .72, 0, 1), stroke .2s ease;
    }

    .dice-fields button.field-toggle:hover svg {
        stroke: #ffffff;
        transform: rotate(180deg);
    }

    @media only screen and (max-width: 850px) {
        .dice-stage { padding: 64px 18px 24px 18px; gap: 40px; }
        .dice-fields { grid-template-columns: 1fr; }
    }
</style>
