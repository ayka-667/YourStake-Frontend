<template>
    <div class="hero-slider"
        v-on:mouseenter="sliderPaused = true"
        v-on:mouseleave="sliderPaused = false"
        v-on:pointerdown="sliderDragStart"
        v-on:pointerup="sliderDragEnd"
        v-on:pointercancel="sliderDragCancel"
    >
        <div class="slider-track" v-bind:style="{ transform: 'translateX(' + sliderOffset + ')' }" v-bind:class="{ 'track-dragging': sliderDragging }">
            <div v-for="(slide, index) in sliderSlides" v-bind:key="slide.id" class="slide" v-bind:class="['slide-' + slide.id, { 'slide-active': index === sliderIndex }]">
                <div class="slide-text">
                    <span class="slide-tag">{{ slide.tag }}</span>
                    <h2 v-html="slide.title"></h2>
                    <p>{{ slide.text }}</p>
                    <router-link v-if="slide.to" v-bind:to="slide.to" class="slide-button" draggable="false">{{ slide.cta }}</router-link>
                    <button v-else v-on:click="modalsSetShow('Login')" class="slide-button">{{ slide.cta }}</button>
                </div>

                <div class="slide-art" aria-hidden="true">
                    <template v-if="slide.id === 'crash'">
                        <svg class="art-curve" viewBox="0 0 300 160" preserveAspectRatio="none">
                            <defs>
                                <linearGradient id="hero-curve-fill" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0" stop-color="#ffa600" stop-opacity=".45"/>
                                    <stop offset="1" stop-color="#ffa600" stop-opacity="0"/>
                                </linearGradient>
                            </defs>
                            <path class="curve-fill" d="M0 158 C 110 155, 190 125, 290 18 L 290 160 L 0 160 Z" fill="url(#hero-curve-fill)"/>
                            <path class="curve-line" d="M0 158 C 110 155, 190 125, 290 18" pathLength="1"/>
                        </svg>
                        <span class="art-dot"></span>
                        <span class="art-multiplier">{{ sliderMultiplier }}×</span>
                    </template>

                    <template v-else-if="slide.id === 'race'">
                        <div class="art-trophy">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3"/></svg>
                        </div>
                        <span v-for="n in 6" v-bind:key="n" class="art-spark" v-bind:style="{ '--i': n }"></span>
                    </template>

                    <template v-else-if="slide.id === 'battles'">
                        <CaseArt v-for="(caseName, n) in ['silver-case', 'gold-case', 'gem-case']" v-bind:key="caseName"
                            class="art-case" v-bind:class="'case-' + n"
                            v-bind:slug="caseName" v-bind:interactive="false" v-bind:float="true" />
                    </template>

                    <template v-else>
                        <img class="art-coin" src="@/assets/img/icons/coin.svg" draggable="false" alt="" />
                        <img class="art-coin coin-small" src="@/assets/img/icons/coin.svg" draggable="false" alt="" />
                        <img class="art-coin coin-tiny" src="@/assets/img/icons/coin.svg" draggable="false" alt="" />
                    </template>
                </div>
            </div>
        </div>

        <button v-on:click="sliderGo(sliderIndex - 1)" class="slider-arrow arrow-prev" aria-label="Previous slide">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <button v-on:click="sliderGo(sliderIndex + 1)" class="slider-arrow arrow-next" aria-label="Next slide">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
        </button>

        <div class="slider-dots">
            <button v-for="(slide, index) in sliderSlides" v-bind:key="slide.id" v-on:click="sliderGo(index)" class="dot" v-bind:class="{ 'dot-active': index === sliderIndex }" v-bind:aria-label="'Slide ' + (index + 1)">
                <span class="dot-fill" v-bind:style="{ transform: 'scaleX(' + (index === sliderIndex ? sliderProgress : (index < sliderIndex ? 1 : 0)) + ')' }"></span>
            </button>
        </div>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';
    import CaseArt from '@/components/CaseArt';

    const SLIDE_DURATION = 6500;

    export default {
        name: 'HeroSlider',
        components: {
            CaseArt
        },
        data() {
            return {
                sliderIndex: 0,
                sliderProgress: 0,
                sliderPaused: false,
                sliderDragging: false,
                sliderDragStartX: 0,
                sliderDragDelta: 0,
                sliderLastTick: 0,
                sliderFrame: null,
                sliderMultiplier: '1.00',
                sliderMultiplierTimer: null,
                sliderImagePath: process.env.VUE_APP_BACKEND_URL
            }
        },
        methods: {
            ...mapActions(['modalsSetShow', 'leaderboardGetDataSocket']),
            sliderGo(index) {
                const count = this.sliderSlides.length;
                this.sliderIndex = (index + count) % count;
                this.sliderProgress = 0;
            },
            sliderTick(time) {
                const delta = this.sliderLastTick ? time - this.sliderLastTick : 0;
                this.sliderLastTick = time;

                if(!this.sliderPaused && !this.sliderDragging && !document.hidden) {
                    this.sliderProgress = Math.min(1, this.sliderProgress + delta / SLIDE_DURATION);
                    if(this.sliderProgress >= 1) { this.sliderGo(this.sliderIndex + 1); }
                }

                this.sliderFrame = requestAnimationFrame(this.sliderTick);
            },
            sliderDragStart(event) {
                if(event.target.closest('button, a')) { return; }
                this.sliderDragging = true;
                this.sliderDragStartX = event.clientX;
                this.sliderDragDelta = 0;
                window.addEventListener('pointermove', this.sliderDragMove);
            },
            sliderDragMove(event) {
                this.sliderDragDelta = event.clientX - this.sliderDragStartX;
            },
            sliderDragEnd() {
                if(!this.sliderDragging) { return; }
                window.removeEventListener('pointermove', this.sliderDragMove);
                const width = this.$el.getBoundingClientRect().width;
                if(Math.abs(this.sliderDragDelta) > width * 0.15) {
                    this.sliderGo(this.sliderIndex + (this.sliderDragDelta < 0 ? 1 : -1));
                }
                this.sliderDragging = false;
                this.sliderDragDelta = 0;
            },
            sliderDragCancel() {
                window.removeEventListener('pointermove', this.sliderDragMove);
                this.sliderDragging = false;
                this.sliderDragDelta = 0;
            },
            sliderRunMultiplier() {
                // Small looping crash counter for the Crash slide
                let value = 1;
                clearInterval(this.sliderMultiplierTimer);
                this.sliderMultiplierTimer = setInterval(() => {
                    value = value >= 8.47 ? 1 : value * 1.035;
                    this.sliderMultiplier = value.toFixed(2);
                }, 80);
            },
            sliderFormat(value) {
                return parseFloat(Math.floor((value || 0) / 10) / 100).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            }
        },
        computed: {
            ...mapGetters(['authUser', 'leaderboardData']),
            sliderPool() {
                const data = this.leaderboardData.data;
                return data ? data.winners.reduce((sum, winner) => sum + (winner.prize || 0), 0) : 0;
            },
            sliderSlides() {
                const user = this.authUser.user;
                return [
                    {
                        id: 'crash',
                        tag: 'Live now',
                        title: user ? 'Welcome back, <span>' + user.username + '</span>' : 'Play <span>Crash</span> live',
                        text: 'Cash out before the rocket crashes. Every round is shared with everyone online.',
                        cta: user ? 'Play Crash' : 'Create an Account',
                        to: user ? '/crash' : null
                    },
                    {
                        id: 'race',
                        tag: 'Weekly Race',
                        title: '<span>' + (this.sliderPool ? this.sliderFormat(this.sliderPool) : '12,300') + '</span> up for grabs',
                        text: 'Wager on any game to climb the leaderboard. The top 10 share the prize pool every week.',
                        cta: 'View Leaderboard',
                        to: '/leaderboard'
                    },
                    {
                        id: 'battles',
                        tag: 'Multiplayer',
                        title: 'Open cases in <span>Case Battles</span>',
                        text: 'Face up to 4 players. The highest total takes every item in the battle.',
                        cta: 'Start a Battle',
                        to: '/battles'
                    },
                    {
                        id: 'rewards',
                        tag: 'Rewards',
                        title: 'Claim your <span>daily rewards</span>',
                        text: 'Redeem bonus codes, catch the chat rain and earn rakeback as you level up.',
                        cta: 'View Rewards',
                        to: '/rewards'
                    }
                ];
            },
            sliderOffset() {
                const drag = this.sliderDragging && this.$el ? (this.sliderDragDelta / this.$el.getBoundingClientRect().width) * 100 : 0;
                return (-this.sliderIndex * 100 + drag) + '%';
            }
        },
        mounted() {
            this.sliderFrame = requestAnimationFrame(this.sliderTick);
            this.sliderRunMultiplier();
            if(this.leaderboardData.data === null && this.leaderboardData.loading === false) { this.leaderboardGetDataSocket({}); }
        },
        beforeDestroy() {
            cancelAnimationFrame(this.sliderFrame);
            clearInterval(this.sliderMultiplierTimer);
            window.removeEventListener('pointermove', this.sliderDragMove);
        }
    }
</script>

<style scoped>
    .hero-slider {
        position: relative;
        border-radius: 12px;
        overflow: hidden;
        touch-action: pan-y;
        user-select: none;
        box-shadow: 0 12px 32px rgba(0, 0, 0, 0.25);
    }

    .slider-track {
        display: flex;
        transition: transform .7s cubic-bezier(.22, 1, .36, 1);
        will-change: transform;
    }

    .slider-track.track-dragging {
        transition: none;
        cursor: grabbing;
    }

    .slide {
        min-width: 100%;
        height: 260px;
        position: relative;
        display: flex;
        align-items: center;
        padding: 0 48px;
        overflow: hidden;
    }

    .slide-crash { background: radial-gradient(120% 140% at 85% 30%, rgba(255, 166, 0, 0.22) 0%, rgba(255, 166, 0, 0) 55%), linear-gradient(120deg, #213743 0%, #1a2c38 60%, #17303a 100%); }
    .slide-race { background: radial-gradient(90% 120% at 80% 40%, rgba(245, 183, 10, 0.28) 0%, rgba(245, 183, 10, 0) 60%), linear-gradient(120deg, #213743 0%, #1d2a2e 100%); }
    .slide-battles { background: radial-gradient(100% 140% at 80% 50%, rgba(193, 60, 255, 0.28) 0%, rgba(193, 60, 255, 0) 60%), linear-gradient(120deg, #213743 0%, #1f2440 100%); }
    .slide-rewards { background: radial-gradient(100% 140% at 80% 50%, rgba(20, 117, 225, 0.4) 0%, rgba(20, 117, 225, 0) 60%), linear-gradient(120deg, #1a3a6b 0%, #0f2847 100%); }

    /* ----- text: slides in when the slide becomes active ----- */
    .slide-text {
        max-width: 420px;
        position: relative;
        z-index: 1;
    }

    .slide-text > * {
        opacity: 0;
        transform: translateY(14px);
        transition: opacity .5s ease, transform .6s cubic-bezier(.22, 1, .36, 1);
    }

    .slide-active .slide-text > * { opacity: 1; transform: none; }
    .slide-active .slide-text > *:nth-child(1) { transition-delay: .15s; }
    .slide-active .slide-text > *:nth-child(2) { transition-delay: .22s; }
    .slide-active .slide-text > *:nth-child(3) { transition-delay: .29s; }
    .slide-active .slide-text > *:nth-child(4) { transition-delay: .36s; }

    .slide-tag {
        display: inline-block;
        padding: 4px 10px;
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.1);
        font-size: 12px;
        font-weight: 700;
        letter-spacing: .02em;
        color: #ffffff;
    }

    .slide-crash .slide-tag { background: rgba(0, 231, 1, 0.15); color: #00e701; }

    .slide h2 {
        margin: 12px 0 10px 0;
        font-size: 32px;
        font-weight: 800;
        line-height: 1.15;
        letter-spacing: -0.02em;
        color: #ffffff;
    }

    .slide h2 >>> span { color: #00e701; }
    .slide-race h2 >>> span { color: #f5b70a; }
    .slide-battles h2 >>> span { color: #d07bff; }
    .slide-rewards h2 >>> span { color: #7cc0ff; }

    .slide p {
        margin-bottom: 20px;
        font-size: 14px;
        font-weight: 500;
        line-height: 1.55;
        color: #b1bad3;
    }

    .slide-button {
        height: 44px;
        display: inline-flex;
        align-items: center;
        padding: 0 22px;
        border-radius: 6px;
        background: #00e701;
        font-size: 14px;
        font-weight: 700;
        color: #05080a;
        transition: opacity .5s ease, transform .6s cubic-bezier(.22, 1, .36, 1), filter .15s ease, box-shadow .2s ease !important;
    }

    .slide-button:hover { filter: brightness(1.08); box-shadow: 0 6px 20px rgba(0, 231, 1, 0.35); }
    .slide-race .slide-button { background: #f5b70a; }
    .slide-battles .slide-button { background: #c13cff; color: #ffffff; }
    .slide-rewards .slide-button { background: #ffffff; color: #0f212e; }

    /* ----- art ----- */
    .slide-art {
        width: 46%;
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        pointer-events: none;
    }

    .art-curve {
        position: absolute;
        left: 6%;
        right: 8%;
        top: 20%;
        bottom: 14%;
        width: 86%;
        height: 66%;
        overflow: visible;
    }

    .curve-line {
        fill: none;
        stroke: #ffa600;
        stroke-width: 3.5;
        stroke-linecap: round;
        stroke-dasharray: 1;
        stroke-dashoffset: 1;
        filter: drop-shadow(0 0 8px rgba(255, 166, 0, 0.6));
    }

    .curve-fill { opacity: 0; }

    .slide-active .curve-line { animation: curve-draw 2.4s cubic-bezier(.45, 0, .2, 1) .3s forwards; }
    .slide-active .curve-fill { animation: fade-in 1s ease 1.6s forwards; }

    .art-dot {
        width: 14px;
        height: 14px;
        position: absolute;
        right: 9%;
        top: calc(20% + 11%);
        border-radius: 50%;
        background: #ffffff;
        box-shadow: 0 0 0 6px rgba(255, 166, 0, 0.25), 0 0 20px rgba(255, 166, 0, 0.9);
        opacity: 0;
    }

    .slide-active .art-dot { animation: fade-in .3s ease 2.6s forwards, pulse 1.6s ease-in-out 2.9s infinite; }

    .art-multiplier {
        position: absolute;
        right: 10%;
        bottom: 12%;
        font-size: 44px;
        font-weight: 800;
        font-variant-numeric: tabular-nums;
        color: #ffffff;
        text-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
    }

    .art-trophy {
        width: 150px;
        height: 150px;
        position: absolute;
        top: 50%;
        left: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(245, 183, 10, 0.25) 0%, rgba(245, 183, 10, 0) 70%);
        color: #f5b70a;
        transform: translate(-50%, -50%);
    }

    .art-trophy svg {
        width: 96px;
        height: 96px;
        filter: drop-shadow(0 8px 24px rgba(245, 183, 10, 0.5));
    }

    .slide-active .art-trophy svg { animation: float 4s ease-in-out infinite; }

    .art-spark {
        width: 6px;
        height: 6px;
        position: absolute;
        top: calc(30% + var(--i) * 7%);
        left: calc(25% + var(--i) * 9%);
        border-radius: 50%;
        background: #f5b70a;
        opacity: 0;
    }

    .slide-active .art-spark { animation: sparkle 2.4s ease-in-out calc(var(--i) * .35s) infinite; }

    .art-case {
        width: 150px;
        position: absolute;
        top: 50%;
        filter: drop-shadow(0 16px 24px rgba(0, 0, 0, 0.45));
    }

    .art-case.case-0 { left: 6%; width: 110px; transform: translateY(-30%) rotate(-10deg); opacity: .85; }
    .art-case.case-1 { left: 32%; transform: translateY(-58%); z-index: 1; }
    .art-case.case-2 { left: 64%; width: 110px; transform: translateY(-36%) rotate(10deg); opacity: .85; }

    .slide-active .art-case.case-0 { animation: float-a 5s ease-in-out infinite; }
    .slide-active .art-case.case-1 { animation: float-b 4.2s ease-in-out infinite; }
    .slide-active .art-case.case-2 { animation: float-c 5.6s ease-in-out infinite; }

    .art-coin {
        width: 120px;
        position: absolute;
        top: 50%;
        left: 42%;
        transform: translate(-50%, -50%);
        filter: drop-shadow(0 12px 24px rgba(0, 0, 0, 0.35));
    }

    .art-coin.coin-small { width: 64px; top: 28%; left: 70%; opacity: .9; }
    .art-coin.coin-tiny { width: 40px; top: 72%; left: 20%; opacity: .75; }

    .slide-active .art-coin { animation: spin-float 6s ease-in-out infinite; }
    .slide-active .art-coin.coin-small { animation-delay: -2s; }
    .slide-active .art-coin.coin-tiny { animation-delay: -4s; }

    /* ----- controls ----- */
    .slider-arrow {
        width: 36px;
        height: 36px;
        position: absolute;
        top: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        background: rgba(15, 33, 46, 0.7);
        color: #ffffff;
        opacity: 0;
        transform: translateY(-50%) scale(.9);
        transition: opacity .2s ease, transform .2s ease, background .2s ease;
        z-index: 2;
        backdrop-filter: blur(6px);
    }

    .slider-arrow svg { width: 18px; height: 18px; }
    .arrow-prev { left: 12px; }
    .arrow-next { right: 12px; }
    .hero-slider:hover .slider-arrow { opacity: 1; transform: translateY(-50%) scale(1); }
    .slider-arrow:hover { background: rgba(47, 69, 83, 0.95); }

    .slider-dots {
        position: absolute;
        left: 48px;
        bottom: 18px;
        display: flex;
        gap: 6px;
        z-index: 2;
    }

    .dot {
        width: 26px;
        height: 4px;
        padding: 0;
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.18);
        overflow: hidden;
        transition: width .4s cubic-bezier(.22, 1, .36, 1);
    }

    .dot.dot-active { width: 48px; }

    .dot-fill {
        display: block;
        width: 100%;
        height: 100%;
        border-radius: 999px;
        background: #ffffff;
        transform-origin: left center;
    }

    @keyframes curve-draw { to { stroke-dashoffset: 0; } }
    @keyframes fade-in { to { opacity: 1; } }
    @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.25); } }
    @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
    @keyframes float-a { 0%, 100% { transform: translateY(-30%) rotate(-10deg); } 50% { transform: translateY(-38%) rotate(-7deg); } }
    @keyframes float-b { 0%, 100% { transform: translateY(-58%); } 50% { transform: translateY(-66%); } }
    @keyframes float-c { 0%, 100% { transform: translateY(-36%) rotate(10deg); } 50% { transform: translateY(-44%) rotate(13deg); } }
    @keyframes spin-float { 0%, 100% { transform: translate(-50%, -50%) rotateY(0deg); } 50% { transform: translate(-50%, -60%) rotateY(180deg); } }
    @keyframes sparkle { 0%, 100% { opacity: 0; transform: scale(.4); } 50% { opacity: 1; transform: scale(1.2); } }

    @media only screen and (max-width: 900px) {
        .slide { height: 300px; padding: 0 24px; align-items: flex-start; padding-top: 32px; }
        .slide-art { width: 100%; opacity: .25; }
        .slide h2 { font-size: 26px; }
        .slider-dots { left: 24px; }
    }
</style>
