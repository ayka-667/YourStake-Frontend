<template>
    <OriginalsShell class="flip">
        <template v-slot:panel>
            <OriginalsPanel v-bind:multiplier="flipMultiplier" v-bind:busy="flipSending || flipSpinning" v-bind:disabled="flipSending || flipSpinning" v-on:bet="flipBet">
                <div class="panel-option">
                    <div class="option-label">Pick a side</div>
                    <div class="option-segment">
                        <button v-on:click="flipSide = 'heads'" v-bind:class="{ 'segment-active': flipSide === 'heads' }" v-bind:disabled="flipSpinning">
                            <span class="side-dot dot-heads"></span>
                            Heads
                        </button>
                        <button v-on:click="flipSide = 'tails'" v-bind:class="{ 'segment-active': flipSide === 'tails' }" v-bind:disabled="flipSpinning">
                            <span class="side-dot dot-tails"></span>
                            Tails
                        </button>
                    </div>
                </div>
            </OriginalsPanel>
        </template>

        <div class="flip-stage" v-bind:class="{ 'stage-won': flipOutcome === 'won', 'stage-lost': flipOutcome === 'lost' }">
            <transition-group name="history" tag="div" class="flip-history">
                <span v-for="item in flipHistory" v-bind:key="item.id" class="history-coin" v-bind:class="'coin-' + item.result"></span>
            </transition-group>

            <div class="flip-scene">
                <div class="scene-toss" v-bind:class="{ 'toss-active': flipSpinning }">
                    <div class="flip-coin" v-bind:style="{ transform: 'rotateX(' + flipRotation + 'deg)', transition: flipTransition }">
                        <div class="coin-face face-heads">
                            <div class="face-ring">
                                <img src="@/assets/img/logo-chip.png" alt="" />
                            </div>
                        </div>
                        <div class="coin-face face-tails">
                            <div class="face-ring">
                                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1 6.2L12 17.3l-5.5 2.9 1-6.2L3 9.6l6.2-.9z" /></svg>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="scene-shadow" v-bind:class="{ 'shadow-active': flipSpinning }"></div>
            </div>

            <div class="flip-caption">
                <transition name="caption" mode="out-in">
                    <div v-if="flipOutcome === 'won'" key="won" class="caption-won">
                        {{ flipLast === 'heads' ? 'Heads' : 'Tails' }}, you win {{ flipMultiplier.toFixed(2) }}×
                    </div>
                    <div v-else-if="flipOutcome === 'lost'" key="lost" class="caption-lost">
                        {{ flipLast === 'heads' ? 'Heads' : 'Tails' }}
                    </div>
                    <div v-else key="idle" class="caption-idle">Pick a side and flip</div>
                </transition>
            </div>
        </div>
    </OriginalsShell>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';
    import OriginalsShell from '@/components/originals/OriginalsShell';
    import OriginalsPanel from '@/components/originals/OriginalsPanel';
    import sfx from '@/utils/sfx';

    const FLIP_TIME = 1100;

    export default {
        name: 'Flip',
        metaInfo: {
            title: 'Flip - YourStake.fr'
        },
        components: {
            OriginalsShell,
            OriginalsPanel
        },
        data() {
            return {
                flipSide: 'heads',
                flipSending: false,
                flipSpinning: false,
                flipRotation: 0,
                flipTransition: 'none',
                flipOutcome: null,
                flipLast: null,
                flipHistory: []
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
            async flipBet(amount) {
                if(this.flipSending === true || this.flipSpinning === true) { return; }
                this.flipSending = true;

                const game = await this.originalsSendBetSocket({ game: 'flip', amount: amount, side: this.flipSide });
                this.flipSending = false;
                if(game === null) { return; }

                const result = game.outcome.result;
                const won = game.payout > 0;

                // Five full turns, landing on the drawn face (heads = 0deg, tails = 180deg).
                const base = Math.ceil((this.flipRotation + 1800) / 360) * 360;
                this.flipOutcome = null;
                this.flipSpinning = true;
                this.flipTransition = 'transform ' + FLIP_TIME + 'ms cubic-bezier(.2, .75, .25, 1)';
                this.flipRotation = base + (result === 'tails' ? 180 : 0);
                sfx.toss();

                setTimeout(() => {
                    this.flipSpinning = false;
                    this.flipLast = result;
                    this.flipOutcome = won === true ? 'won' : 'lost';
                    this.originalsSettle(game);

                    sfx.land();
                    setTimeout(() => (won === true ? sfx.win() : sfx.lose()), 120);

                    this.flipHistory.unshift({ id: game._id, result: result });
                    this.flipHistory = this.flipHistory.slice(0, 10);
                }, FLIP_TIME);
            }
        },
        computed: {
            ...mapGetters([
                'originalsConfig'
            ]),
            flipMultiplier() {
                return this.originalsConfig !== null ? this.originalsConfig.flipMultiplier : 1.98;
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
    .flip .side-dot {
        width: 12px;
        height: 12px;
        border-radius: 50%;
    }

    .flip .side-dot.dot-heads {
        background: linear-gradient(145deg, #ffe082, #e0a21a);
    }

    .flip .side-dot.dot-tails {
        background: linear-gradient(145deg, #eef2f7, #8f9db0);
    }

    .flip-stage {
        position: absolute;
        inset: 0;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 34px;
        background: radial-gradient(60% 50% at 50% 45%, rgba(255, 255, 255, 0.04), transparent 70%);
        transition: background .6s ease;
    }

    .flip-stage.stage-won {
        background: radial-gradient(60% 50% at 50% 45%, rgba(0, 231, 1, 0.12), transparent 70%);
    }

    .flip-stage.stage-lost {
        background: radial-gradient(60% 50% at 50% 45%, rgba(255, 59, 92, 0.08), transparent 70%);
    }

    .flip-history {
        position: absolute;
        top: 18px;
        right: 18px;
        display: flex;
        gap: 6px;
    }

    .flip-history .history-coin {
        width: 22px;
        height: 22px;
        border-radius: 50%;
        box-shadow: inset 0 -2px 0 rgba(0, 0, 0, 0.25);
    }

    .flip-history .history-coin.coin-heads {
        background: linear-gradient(145deg, #ffe082, #e0a21a);
    }

    .flip-history .history-coin.coin-tails {
        background: linear-gradient(145deg, #eef2f7, #8f9db0);
    }

    .flip-history .history-enter-active {
        transition: transform .45s cubic-bezier(.32, .72, 0, 1), opacity .3s ease;
    }

    .flip-history .history-enter {
        transform: scale(.4);
        opacity: 0;
    }

    .flip-history .history-leave-active {
        display: none;
    }

    .flip-history .history-move {
        transition: transform .45s cubic-bezier(.32, .72, 0, 1);
    }

    .flip-scene {
        position: relative;
        width: 220px;
        height: 260px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        perspective: 900px;
    }

    .flip-scene .scene-toss {
        transform-style: preserve-3d;
    }

    .flip-scene .scene-toss.toss-active {
        animation: flip-toss 1.1s cubic-bezier(.3, .6, .4, 1);
    }

    .flip-coin {
        position: relative;
        width: 190px;
        height: 190px;
        transform-style: preserve-3d;
    }

    .flip-coin .coin-face {
        position: absolute;
        inset: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 50%;
        backface-visibility: hidden;
        -webkit-backface-visibility: hidden;
    }

    .flip-coin .face-heads {
        background: radial-gradient(circle at 32% 28%, #fff4c4 0%, #ffd34d 30%, #e0a21a 70%, #a86a00 100%);
        box-shadow: inset 0 0 0 6px rgba(255, 255, 255, 0.25), inset 0 -10px 20px rgba(120, 70, 0, 0.45), 0 0 40px rgba(245, 183, 10, 0.25);
    }

    .flip-coin .face-tails {
        transform: rotateX(180deg);
        background: radial-gradient(circle at 32% 28%, #ffffff 0%, #dfe6ee 30%, #9aa9ba 70%, #5b6b7d 100%);
        box-shadow: inset 0 0 0 6px rgba(255, 255, 255, 0.35), inset 0 -10px 20px rgba(30, 40, 55, 0.45), 0 0 40px rgba(200, 215, 230, 0.2);
    }

    .flip-coin .face-ring {
        width: 72%;
        height: 72%;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 50%;
        border: 3px dashed rgba(0, 0, 0, 0.18);
    }

    .flip-coin .face-heads img {
        width: 62%;
        filter: drop-shadow(0 2px 2px rgba(120, 70, 0, 0.5));
    }

    .flip-coin .face-tails svg {
        width: 58%;
        fill: #4a5868;
        filter: drop-shadow(0 1px 0 rgba(255, 255, 255, 0.6));
    }

    .flip-scene .scene-shadow {
        width: 150px;
        height: 18px;
        margin-top: 26px;
        border-radius: 50%;
        background: radial-gradient(closest-side, rgba(0, 0, 0, 0.55), transparent);
    }

    .flip-scene .scene-shadow.shadow-active {
        animation: flip-shadow 1.1s cubic-bezier(.3, .6, .4, 1);
    }

    .flip-caption {
        height: 28px;
        font-size: 20px;
        font-weight: 800;
        letter-spacing: -0.01em;
    }

    .flip-caption .caption-won { color: #00e701; }
    .flip-caption .caption-lost { color: #b1bad3; }
    .flip-caption .caption-idle { color: #557086; font-size: 16px; font-weight: 600; }

    .flip-caption .caption-enter-active,
    .flip-caption .caption-leave-active {
        transition: opacity .25s ease, transform .4s cubic-bezier(.32, .72, 0, 1);
    }

    .flip-caption .caption-enter { opacity: 0; transform: translateY(8px); }
    .flip-caption .caption-leave-to { opacity: 0; transform: translateY(-6px); }

    @keyframes flip-toss {
        0% { transform: translateY(0) scale(1); }
        45% { transform: translateY(-90px) scale(1.12); }
        100% { transform: translateY(0) scale(1); }
    }

    @keyframes flip-shadow {
        0% { transform: scale(1); opacity: 1; }
        45% { transform: scale(.55); opacity: .4; }
        100% { transform: scale(1); opacity: 1; }
    }

    @media only screen and (max-width: 850px) {
        .flip-coin { width: 150px; height: 150px; }
    }
</style>
