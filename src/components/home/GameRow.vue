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
                    <span v-if="live" class="tile-live"><i></i>LIVE</span>
                    <UiIcon v-bind:name="game.icon" />
                    <div class="tile-name">{{ game.name }}</div>
                    <div class="tile-brand">ORIGINALS</div>
                </div>
            </router-link>
        </div>
    </section>
</template>

<script>
    import UiIcon from '@/components/UiIcon';

    export default {
        name: 'GameRow',
        components: {
            UiIcon
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
        justify-content: center;
        align-items: center;
        border-radius: 10px;
        background:
            radial-gradient(120% 70% at 50% 0%, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0) 60%),
            linear-gradient(160deg, var(--tile-a) 0%, var(--tile-b) 100%);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
        overflow: hidden;
        transition: transform .35s cubic-bezier(.22, 1, .36, 1), box-shadow .35s ease;
    }

    /* light sweep on hover */
    .tile-art::after {
        content: '';
        position: absolute;
        top: 0;
        left: -60%;
        width: 50%;
        height: 100%;
        background: linear-gradient(100deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.35) 50%, rgba(255, 255, 255, 0) 100%);
        transform: skewX(-18deg);
        pointer-events: none;
    }

    a.game-tile:hover .tile-art {
        transform: translateY(-6px);
        box-shadow: 0 14px 28px rgba(0, 0, 0, 0.35);
    }

    a.game-tile:hover .tile-art::after { animation: shine .8s ease; }
    a.game-tile:active .tile-art { transform: translateY(-2px) scale(.98); }

    .tile-art .ui-icon {
        width: 56px;
        height: 56px;
        margin-bottom: 18px;
        color: #ffffff;
        stroke-width: 1.6;
        filter: drop-shadow(0 4px 10px rgba(0, 0, 0, 0.3));
        transition: transform .45s cubic-bezier(.34, 1.56, .64, 1);
    }

    a.game-tile:hover .tile-art .ui-icon { transform: translateY(-4px) scale(1.12) rotate(-4deg); }

    .tile-name {
        font-size: 20px;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: .02em;
        color: #ffffff;
    }

    .tile-brand {
        position: absolute;
        bottom: 12px;
        font-size: 10px;
        font-weight: 700;
        letter-spacing: .16em;
        color: rgba(255, 255, 255, 0.7);
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
        font-size: 10px;
        font-weight: 800;
        letter-spacing: .04em;
        color: #ffffff;
        backdrop-filter: blur(4px);
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
