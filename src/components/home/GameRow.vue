<template>
    <section class="game-row">
        <div class="row-head">
            <div class="row-title">
                <UiIcon v-bind:name="icon" />
                {{ title }}
            </div>
            <div class="row-arrows">
                <button v-on:click="rowScroll(-1)" v-bind:disabled="rowAtStart" aria-label="Scroll left">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                </button>
                <button v-on:click="rowScroll(1)" v-bind:disabled="rowAtEnd" aria-label="Scroll right">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                </button>
            </div>
        </div>

        <div class="row-scroll" ref="scroller" v-on:scroll.passive="rowUpdateEdges">
            <router-link v-for="(game, index) in games" v-bind:key="game.to" v-bind:to="game.to"
                class="game-tile"
                v-bind:style="{ '--tile-a': game.colors[0], '--tile-b': game.colors[1], '--delay': (index * 60) + 'ms' }"
            >
                <div class="tile-art">
                    <span v-if="live" class="tile-live"><i></i>Live</span>
                    <div class="tile-visual">
                        <GameArt v-bind:game="game.icon" />
                    </div>
                    <div class="tile-meta">
                        <div class="tile-name">{{ game.name }}</div>
                        <div class="tile-brand">YourStake Originals</div>
                    </div>
                </div>
            </router-link>
        </div>
    </section>
</template>

<script>
    import UiIcon from '@/components/UiIcon';
    import GameArt from '@/components/home/GameArt';

    export default {
        name: 'GameRow',
        components: {
            UiIcon,
            GameArt
        },
        props: ['title', 'icon', 'games', 'live'],
        data() {
            return {
                rowAtStart: true,
                rowAtEnd: true
            }
        },
        methods: {
            rowScroll(direction) {
                const scroller = this.$refs.scroller;
                scroller.scrollBy({ left: direction * scroller.clientWidth * 0.8, behavior: 'smooth' });
            },
            rowUpdateEdges() {
                const scroller = this.$refs.scroller;
                if(!scroller) { return; }
                this.rowAtStart = scroller.scrollLeft <= 2;
                this.rowAtEnd = scroller.scrollLeft + scroller.clientWidth >= scroller.scrollWidth - 2;
            }
        },
        watch: {
            games() { this.$nextTick(this.rowUpdateEdges); }
        },
        mounted() {
            this.rowUpdateEdges();
            window.addEventListener('resize', this.rowUpdateEdges);
        },
        beforeDestroy() {
            window.removeEventListener('resize', this.rowUpdateEdges);
        }
    }
</script>

<style scoped>
    .game-row {
        margin-top: 32px;
    }

    .row-head {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 14px;
    }

    .row-title {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 18px;
        font-weight: 700;
        color: #ffffff;
    }

    .row-title .ui-icon { color: #b1bad3; }

    .row-arrows {
        display: flex;
        gap: 6px;
    }

    .row-arrows button {
        width: 34px;
        height: 34px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 999px;
        background: #213743;
        color: #ffffff;
        transition: background .15s ease, opacity .15s ease, transform .15s ease;
    }

    .row-arrows button svg { width: 16px; height: 16px; }
    .row-arrows button:hover:not(:disabled) { background: #2f4553; }
    .row-arrows button:active:not(:disabled) { transform: scale(.92); }
    .row-arrows button:disabled { opacity: .35; cursor: default; }

    .row-scroll {
        display: flex;
        gap: 14px;
        margin: -10px -4px 0 -4px;
        padding: 10px 4px 6px 4px;
        overflow-x: auto;
        scroll-snap-type: x mandatory;
        scroll-padding: 4px;
        scrollbar-width: none;
    }

    .row-scroll::-webkit-scrollbar { display: none; }

    a.game-tile {
        flex: 0 0 calc((100% - 14px * 5) / 6);
        min-width: 140px;
        scroll-snap-align: start;
        opacity: 0;
        animation: tile-in .6s cubic-bezier(.22, 1, .36, 1) var(--delay) forwards;
    }

    .tile-art {
        aspect-ratio: 3 / 4;
        position: relative;
        display: flex;
        flex-direction: column;
        border-radius: 10px;
        background:
            radial-gradient(90% 60% at 50% 30%, color-mix(in srgb, var(--tile-a) 32%, transparent) 0%, transparent 70%),
            linear-gradient(180deg, #1c3342 0%, #132532 100%);
        box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.06), 0 4px 12px rgba(0, 0, 0, 0.25);
        overflow: hidden;
        transition: transform .35s cubic-bezier(.22, 1, .36, 1), box-shadow .35s ease;
    }

    /* accent line at the top, in the game colour */
    .tile-art::before {
        content: '';
        position: absolute;
        top: 0;
        left: 16%;
        right: 16%;
        height: 2px;
        border-radius: 0 0 2px 2px;
        background: var(--tile-a);
        opacity: .8;
        box-shadow: 0 0 12px var(--tile-a);
    }

    /* light sweep on hover */
    .tile-art::after {
        content: '';
        position: absolute;
        top: 0;
        left: -60%;
        width: 50%;
        height: 100%;
        background: linear-gradient(100deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.12) 50%, rgba(255, 255, 255, 0) 100%);
        transform: skewX(-18deg);
        pointer-events: none;
    }

    a.game-tile:hover .tile-art {
        transform: translateY(-6px);
        box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--tile-a) 45%, transparent), 0 14px 30px rgba(0, 0, 0, 0.4), 0 0 30px color-mix(in srgb, var(--tile-a) 20%, transparent);
    }

    a.game-tile:hover .tile-art::after { animation: shine .9s ease; }
    a.game-tile:active .tile-art { transform: translateY(-2px) scale(.98); }

    .tile-visual {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 18% 12% 4% 12%;
        transition: transform .5s cubic-bezier(.22, 1, .36, 1);
    }

    a.game-tile:hover .tile-visual { transform: scale(1.07); }

    .tile-meta {
        padding: 0 14px 14px 14px;
    }

    .tile-name {
        font-size: 16px;
        font-weight: 700;
        letter-spacing: -0.01em;
        color: #ffffff;
    }

    .tile-brand {
        margin-top: 2px;
        font-size: 11px;
        font-weight: 600;
        color: #557086;
    }

    .tile-live {
        position: absolute;
        top: 10px;
        left: 10px;
        display: flex;
        align-items: center;
        gap: 5px;
        padding: 3px 8px 3px 6px;
        border-radius: 999px;
        background: rgba(5, 8, 10, 0.55);
        font-size: 11px;
        font-weight: 700;
        color: #ffffff;
        backdrop-filter: blur(4px);
        z-index: 1;
    }

    .tile-live i {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: #00e701;
        animation: live-blink 1.6s ease-in-out infinite;
    }

    @keyframes tile-in {
        from { opacity: 0; transform: translateY(18px) scale(.96); }
        to { opacity: 1; transform: none; }
    }

    @keyframes shine {
        from { left: -60%; }
        to { left: 130%; }
    }

    @keyframes live-blink {
        0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(0, 231, 1, 0.6); }
        50% { opacity: .55; box-shadow: 0 0 0 4px rgba(0, 231, 1, 0); }
    }

    @media only screen and (max-width: 1300px) {
        a.game-tile { flex-basis: calc((100% - 14px * 4) / 5); }
    }

    @media only screen and (max-width: 800px) {
        a.game-tile { flex-basis: 42%; }
    }
</style>
