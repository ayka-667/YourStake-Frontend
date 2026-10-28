<template>
    <OriginalsShell class="flip">
        <template v-slot:panel>
            <OriginalsPanel v-bind:multiplier="flipMultiplier" v-bind:busy="flipSending || flipSpinning" v-bind:disabled="flipSending || flipSpinning" v-on:bet="flipBet">
                <div class="panel-option">
                    <div class="option-label">Pick a side</div>
                    <div class="option-segment">
                        <button v-on:click="flipSide = 'heads'" v-bind:class="{ 'segment-active': flipSide === 'heads' }" v-bind:disabled="flipSpinning">
                            <FlipCoinFace class="side-dot" side="heads" v-bind:mini="true" />
                            Heads
                        </button>
                        <button v-on:click="flipSide = 'tails'" v-bind:class="{ 'segment-active': flipSide === 'tails' }" v-bind:disabled="flipSpinning">
                            <FlipCoinFace class="side-dot" side="tails" v-bind:mini="true" />
                            Tails
                        </button>
                    </div>
                </div>
            </OriginalsPanel>
        </template>

        <div class="flip-stage" v-bind:class="{ 'stage-won': flipOutcome === 'won', 'stage-lost': flipOutcome === 'lost' }">
            <transition-group name="history" tag="div" class="flip-history">
                <FlipCoinFace v-for="item in flipHistory" v-bind:key="item.id" class="history-coin" v-bind:side="item.result" v-bind:mini="true" />
            </transition-group>

            <div class="flip-scene">
                <div class="scene-toss" v-bind:class="{ 'toss-active': flipSpinning }">
                    <div class="flip-coin" v-bind:style="{ transform: 'rotateX(' + flipRotation + 'deg)', transition: flipTransition }">
                        <div v-for="layer in 13" v-bind:key="layer" class="coin-edge" v-bind:style="{ transform: 'translateZ(' + (layer - 7) + 'px)' }"></div>
                        <div class="coin-face face-heads">
                            <FlipCoinFace side="heads" />
                        </div>
                        <div class="coin-face face-tails">
                            <FlipCoinFace side="tails" />
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
    import FlipCoinFace from '@/components/originals/FlipCoinFace';
    import sfx from '@/utils/sfx';

    const FLIP_TIME = 1100;

    export default {
        name: 'Flip',
        metaInfo: {
            title: 'Flip - YourStake.fr'
        },
        components: {
            OriginalsShell,
            OriginalsPanel,
            FlipCoinFace
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
        width: 16px;
        height: 16px;
        filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.4));
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
        width: 24px;
        height: 24px;
        filter: drop-shadow(0 2px 2px rgba(0, 0, 0, 0.45));
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

    .flip-coin .coin-edge {
        position: absolute;
        inset: 0;
        border-radius: 50%;
        background: linear-gradient(180deg, #d9a52a 0%, #8a5a00 55%, #5e3c00 100%);
        box-shadow: inset 0 0 0 1px rgba(255, 230, 150, 0.25);
    }

    .flip-coin .coin-face {
        position: absolute;
        inset: 0;
        border-radius: 50%;
        backface-visibility: hidden;
        -webkit-backface-visibility: hidden;
        transform: translateZ(7px);
    }

    .flip-coin .face-heads::after,
    .flip-coin .face-tails::after {
        content: '';
        position: absolute;
        inset: 0;
        border-radius: 50%;
        background: linear-gradient(125deg, rgba(255, 255, 255, 0.28) 0%, rgba(255, 255, 255, 0) 38%, rgba(0, 0, 0, 0) 62%, rgba(0, 0, 0, 0.18) 100%);
        pointer-events: none;
    }

    .flip-coin .face-tails {
        transform: rotateX(180deg) translateZ(7px);
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
