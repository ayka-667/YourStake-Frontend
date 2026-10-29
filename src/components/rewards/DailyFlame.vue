<template>
    <svg class="daily-flame" v-bind:class="'flame-' + state" viewBox="0 0 24 30" aria-hidden="true">
        <defs>
            <linearGradient v-bind:id="'flame-outer-' + _uid" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" v-bind:stop-color="colors[0]" />
                <stop offset="100%" v-bind:stop-color="colors[1]" />
            </linearGradient>
            <linearGradient v-bind:id="'flame-inner-' + _uid" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" v-bind:stop-color="colors[2]" />
                <stop offset="100%" v-bind:stop-color="colors[3]" />
            </linearGradient>
        </defs>
        <g class="flame-body">
            <path v-bind:fill="'url(#flame-outer-' + _uid + ')'" d="M12 1c1 4.5 6.5 7.5 8.6 13 1.9 5-0.8 11.2-6.3 13.5C8 30 2.3 26.6 2 20.4 1.8 16.3 4.2 13.6 6 11.8c.4 2.3 1.4 3.9 3 4.6C8.2 11.2 10 5 12 1z" />
            <path class="flame-core" v-bind:fill="'url(#flame-inner-' + _uid + ')'" d="M12.4 13.5c.8 2.6 4.4 4.4 4.6 8 .2 3.2-2.2 5.6-5 5.6s-5.2-2-5-5c.1-2 1.2-3.4 2.4-4.3.3 1.3 1 2.2 2 2.5-.3-2.6.3-4.9 1-6.8z" />
        </g>
    </svg>
</template>

<script>
    // Flame icon for the daily streak: 'lit' (claimed), 'next' (claimable today), 'gold' (best day), 'off' (not reached yet)
    const PALETTES = {
        lit: ['#ff3d00', '#ffb300', '#ffd54f', '#fff8e1'],
        next: ['#ff6d00', '#ffca28', '#ffe082', '#ffffff'],
        gold: ['#ff8f00', '#ffe14d', '#fff3b0', '#ffffff'],
        off: ['#2f4553', '#3d5564', '#4a6474', '#557086']
    };

    export default {
        name: 'DailyFlame',
        props: {
            state: { type: String, default: 'lit' }
        },
        computed: {
            colors() {
                return PALETTES[this.state] || PALETTES.lit;
            }
        }
    }
</script>

<style scoped>
    .daily-flame {
        display: block;
        overflow: visible;
    }

    .daily-flame .flame-body {
        transform-origin: 50% 100%;
    }

    .daily-flame.flame-lit .flame-body,
    .daily-flame.flame-gold .flame-body {
        filter: drop-shadow(0 0 4px rgba(255, 140, 0, 0.55));
        animation: flame-flicker 1.6s ease-in-out infinite;
    }

    .daily-flame.flame-next .flame-body {
        filter: drop-shadow(0 0 6px rgba(255, 170, 0, 0.8));
        animation: flame-flicker 0.9s ease-in-out infinite;
    }

    .daily-flame.flame-lit .flame-core,
    .daily-flame.flame-next .flame-core,
    .daily-flame.flame-gold .flame-core {
        transform-origin: 50% 100%;
        animation: flame-core 1.1s ease-in-out infinite;
    }

    @keyframes flame-flicker {
        0%, 100% { transform: scale(1, 1) skewX(0deg); }
        25% { transform: scale(1.03, 0.96) skewX(-2deg); }
        50% { transform: scale(0.97, 1.05) skewX(1.5deg); }
        75% { transform: scale(1.02, 0.98) skewX(-1deg); }
    }

    @keyframes flame-core {
        0%, 100% { transform: scale(1); opacity: 1; }
        50% { transform: scale(0.88, 1.08); opacity: 0.85; }
    }

    @media (prefers-reduced-motion: reduce) {
        .daily-flame .flame-body,
        .daily-flame .flame-core { animation: none !important; }
    }
</style>
