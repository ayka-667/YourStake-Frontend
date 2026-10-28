<template>
    <div class="originals-shell">
        <div class="shell-game">
            <slot name="panel"></slot>
            <div class="shell-stage">
                <slot></slot>
            </div>
        </div>

        <Bets />
    </div>
</template>

<script>
    import Bets from '@/components/bets/Bets';

    export default {
        name: 'OriginalsShell',
        components: {
            Bets
        }
    }
</script>

<style scoped>
    .originals-shell {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 40px 10px;
    }

    .originals-shell .shell-game {
        width: 100%;
        max-width: 1200px;
        display: flex;
        border-radius: 12px;
        box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.04), 0 24px 48px -24px rgba(0, 0, 0, 0.6);
        animation: shell-in .7s cubic-bezier(.32, .72, 0, 1) both;
    }

    .originals-shell .shell-stage {
        position: relative;
        flex: 1;
        min-width: 0;
        min-height: 600px;
        border-radius: 0 12px 12px 0;
        background: #0f212e;
        overflow: hidden;
    }

    @keyframes shell-in {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: none; }
    }

    /* Bets docks itself to the bottom on small screens; keep it in the flow under the game */
    @media only screen and (max-width: 950px) {
        .originals-shell .bets {
            position: static;
            margin-top: 30px;
        }
    }

    @media only screen and (max-width: 850px) {
        .originals-shell { padding: 20px 10px; }
        .originals-shell .shell-game { flex-direction: column-reverse; }
        .originals-shell .shell-stage { min-height: 420px; border-radius: 12px 12px 0 0; }
    }
</style>
