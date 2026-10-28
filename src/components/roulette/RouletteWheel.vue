<template>
    <div class="roulette-wheel">
        <svg class="wheel-stator" viewBox="0 0 300 300" aria-hidden="true">
            <defs>
                <radialGradient id="rw-wood" cx=".5" cy=".42" r=".6">
                    <stop offset="0" stop-color="#8a5326" />
                    <stop offset=".75" stop-color="#5b3317" />
                    <stop offset="1" stop-color="#341b0b" />
                </radialGradient>
                <radialGradient id="rw-track" cx=".5" cy=".5" r=".5">
                    <stop offset=".85" stop-color="#1b2a35" />
                    <stop offset=".93" stop-color="#2b3d4a" />
                    <stop offset="1" stop-color="#121c24" />
                </radialGradient>
            </defs>
            <circle cx="150" cy="150" r="150" fill="url(#rw-wood)" />
            <circle cx="150" cy="150" r="141" fill="none" stroke="#d4b26a" stroke-width="1.5" stroke-opacity=".7" />
            <circle cx="150" cy="150" r="139" fill="url(#rw-track)" />
            <path v-for="n in 8" v-bind:key="'d' + n" v-bind:d="wheelDiamond((n - 1) * 45)" fill="#d4b26a" />
        </svg>

        <div class="wheel-rotor" v-bind:style="{ transform: 'rotate(' + wheelAngle + 'deg)', transition: wheelTransition }">
            <svg viewBox="0 0 300 300" aria-hidden="true">
                <defs>
                    <radialGradient id="rw-cone" cx=".42" cy=".38" r=".7">
                        <stop offset="0" stop-color="#8a5a2b" />
                        <stop offset=".6" stop-color="#5e3a1a" />
                        <stop offset="1" stop-color="#3b220d" />
                    </radialGradient>
                    <linearGradient id="rw-gold" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0" stop-color="#fff0b8" />
                        <stop offset=".5" stop-color="#d4a73c" />
                        <stop offset="1" stop-color="#8a6416" />
                    </linearGradient>
                </defs>
                <circle cx="150" cy="150" r="129" fill="#d4b26a" />
                <path v-for="(number, index) in wheelOrder" v-bind:key="'p' + number"
                    v-bind:d="wheelSector(111, 128, index * wheelStep - wheelStep / 2, index * wheelStep + wheelStep / 2)"
                    v-bind:fill="wheelColor(number)" v-bind:class="{ 'pocket-win': number === wheelResult }"
                    stroke="#d4b26a" stroke-width=".9" />
                <path v-for="(number, index) in wheelOrder" v-bind:key="'h' + number"
                    v-bind:d="wheelSector(97, 111, index * wheelStep - wheelStep / 2, index * wheelStep + wheelStep / 2)"
                    fill="#24150a" stroke="#d4b26a" stroke-width="1.1" />
                <text v-for="(number, index) in wheelOrder" v-bind:key="'t' + number" class="wheel-number"
                    x="150" y="33.5" text-anchor="middle" v-bind:transform="'rotate(' + index * wheelStep + ' 150 150)'">{{ number }}</text>
                <circle cx="150" cy="150" r="97" fill="none" stroke="#d4b26a" stroke-width="2" />
                <circle cx="150" cy="150" r="95" fill="url(#rw-cone)" />
                <circle v-for="n in 4" v-bind:key="'r' + n" cx="150" cy="150" v-bind:r="95 - n * 14" fill="none" stroke="#000" stroke-opacity=".12" />
                <g fill="url(#rw-gold)">
                    <rect x="146" y="88" width="8" height="124" rx="4" />
                    <rect x="88" y="146" width="124" height="8" rx="4" />
                    <circle cx="150" cy="88" r="6" />
                    <circle cx="150" cy="212" r="6" />
                    <circle cx="88" cy="150" r="6" />
                    <circle cx="212" cy="150" r="6" />
                    <circle cx="150" cy="150" r="17" />
                </g>
                <circle cx="150" cy="150" r="10" fill="#fff4cc" opacity=".55" />
            </svg>
        </div>

        <div class="wheel-orbit" v-bind:style="{ transform: 'rotate(' + wheelBallAngle + 'deg)', transition: wheelBallTransition }">
            <span class="orbit-ball" v-bind:class="{ 'ball-hidden': wheelResult === null && wheelSpinning === false }"
                v-bind:style="{ top: wheelBallTop + '%', transition: wheelBallDrop }"></span>
        </div>
    </div>
</template>

<script>
    import sfx from '@/utils/sfx';

    const WHEEL_ORDER = [0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26];
    const RED = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
    const SPIN_TIME = 4200;
    // Ball distance from the top edge, in % of the wheel: on the track, then sitting in a pocket.
    const BALL_TRACK = 5.3;
    const BALL_POCKET = 15.2;

    export default {
        name: 'RouletteWheel',
        data() {
            return {
                wheelOrder: WHEEL_ORDER,
                wheelStep: 360 / WHEEL_ORDER.length,
                wheelAngle: 0,
                wheelTransition: 'none',
                wheelBallAngle: 0,
                wheelBallTransition: 'none',
                wheelBallTop: BALL_TRACK,
                wheelBallDrop: 'none',
                wheelResult: null,
                wheelSpinning: false,
                wheelTimers: []
            }
        },
        methods: {
            wheelPoint(radius, angle) {
                const rad = angle * Math.PI / 180;
                return (150 + radius * Math.sin(rad)).toFixed(2) + ' ' + (150 - radius * Math.cos(rad)).toFixed(2);
            },
            wheelSector(inner, outer, from, to) {
                return 'M' + this.wheelPoint(outer, from) + ' A' + outer + ' ' + outer + ' 0 0 1 ' + this.wheelPoint(outer, to) +
                    ' L' + this.wheelPoint(inner, to) + ' A' + inner + ' ' + inner + ' 0 0 0 ' + this.wheelPoint(inner, from) + ' Z';
            },
            wheelDiamond(angle) {
                return 'M' + this.wheelPoint(137, angle) + ' L' + this.wheelPoint(133, angle + 2.2) + ' L' + this.wheelPoint(129, angle) + ' L' + this.wheelPoint(133, angle - 2.2) + ' Z';
            },
            wheelColor(number) {
                if(number === 0) { return '#0f9d58'; }
                return RED.includes(number) === true ? '#d0233a' : '#16202a';
            },
            wheelClearTimers() {
                this.wheelTimers.forEach((timer) => clearTimeout(timer));
                this.wheelTimers = [];
            },
            // Shows the ball already resting in `number`, e.g. when joining mid spin.
            place(number) {
                this.wheelClearTimers();
                this.wheelTransition = 'none';
                this.wheelBallTransition = 'none';
                this.wheelBallDrop = 'none';
                this.wheelBallAngle = this.wheelAngle + WHEEL_ORDER.indexOf(number) * this.wheelStep;
                this.wheelBallTop = BALL_POCKET;
                this.wheelSpinning = false;
                this.wheelResult = number;
            },
            // Spins the rotor clockwise and the ball the other way, landing on `number`.
            // Resolves once the ball has settled.
            spin(number, duration = SPIN_TIME) {
                this.wheelClearTimers();
                this.wheelResult = null;
                this.wheelSpinning = true;

                const index = WHEEL_ORDER.indexOf(number);
                const wheelEnd = this.wheelAngle + 720 + Math.random() * 360;
                const pocket = (((wheelEnd + index * this.wheelStep) % 360) + 360) % 360;
                const ballFloor = this.wheelBallAngle - 1800;
                const ballEnd = ballFloor - ((((ballFloor - pocket) % 360) + 360) % 360);

                // Lift the ball back onto the track before it starts rolling.
                this.wheelBallDrop = 'top .35s ease-out';
                this.wheelBallTop = BALL_TRACK;

                this.$nextTick(() => {
                    requestAnimationFrame(() => {
                        this.wheelTransition = 'transform ' + duration + 'ms cubic-bezier(.12, .62, .22, 1)';
                        this.wheelAngle = wheelEnd;
                        this.wheelBallTransition = 'transform ' + duration + 'ms cubic-bezier(.08, .58, .18, 1)';
                        this.wheelBallAngle = ballEnd;
                        this.wheelBallDrop = 'top 1.1s cubic-bezier(.5, 0, .75, 1.35) ' + Math.max(0, duration - 1450) + 'ms';
                        this.wheelBallTop = BALL_POCKET;
                    });
                });

                sfx.ball(duration / 1000);

                // Fret clicks once the ball drops in, slowing down until it settles.
                let at = Math.max(0, duration - 1150);
                let gap = 70;
                while(at < duration - 60) {
                    const pitch = 1 - (at / duration) * 0.25;
                    this.wheelTimers.push(setTimeout(() => sfx.fret(pitch), at));
                    at += gap;
                    gap *= 1.32;
                }

                return new Promise((resolve) => {
                    this.wheelTimers.push(setTimeout(() => {
                        this.wheelSpinning = false;
                        this.wheelResult = number;
                        resolve(number);
                    }, duration));
                });
            }
        },
        beforeDestroy() {
            this.wheelClearTimers();
        }
    }
</script>

<style scoped>
    .roulette-wheel {
        position: relative;
        width: 100%;
        aspect-ratio: 1 / 1;
        border-radius: 50%;
        box-shadow: 0 18px 40px -12px rgba(0, 0, 0, 0.7);
    }

    .roulette-wheel svg {
        display: block;
        width: 100%;
        height: 100%;
    }

    .roulette-wheel .wheel-stator,
    .roulette-wheel .wheel-rotor,
    .roulette-wheel .wheel-orbit {
        position: absolute;
        inset: 0;
    }

    .roulette-wheel .wheel-rotor {
        will-change: transform;
    }

    .roulette-wheel .wheel-number {
        font-size: 9.5px;
        font-weight: 700;
        fill: #ffffff;
        font-family: 'Inter', sans-serif;
    }

    .roulette-wheel .pocket-win {
        animation: pocket-glow 1s ease-in-out 3;
    }

    .roulette-wheel .wheel-orbit {
        pointer-events: none;
        will-change: transform;
    }

    .roulette-wheel .orbit-ball {
        position: absolute;
        left: 50%;
        width: 3.6%;
        height: 3.6%;
        border-radius: 50%;
        transform: translate(-50%, -50%);
        background: radial-gradient(circle at 35% 30%, #ffffff 0%, #e9eef3 45%, #9aa6b2 100%);
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.6);
        transition: opacity .3s ease;
    }

    .roulette-wheel .orbit-ball.ball-hidden {
        opacity: 0;
    }

    @keyframes pocket-glow {
        50% { filter: brightness(1.8); }
    }
</style>
