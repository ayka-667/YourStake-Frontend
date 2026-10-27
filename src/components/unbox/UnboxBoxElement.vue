<template>
    <router-link class="unbox-box-element" v-bind:to="'/unbox/' + box._id" v-bind:style="elementStyle">
        <div class="element-stage">
            <CaseArt v-bind:slug="box.slug" />
        </div>
        <div class="element-info">
            <div class="info-name">{{ box.name }}</div>
            <div class="info-price">
                <img src="@/assets/img/icons/coin.svg" alt="" />
                {{ unboxFormatValue(box.amount) }}
            </div>
        </div>
        <div class="element-cta">
            Open
            <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M6 3l5 5-5 5" /></svg>
        </div>
    </router-link>
</template>

<script>
    import CaseArt from '@/components/CaseArt';
    import { caseTheme } from '@/utils/caseTheme';

    export default {
        name: 'UnboxBoxElement',
        components: {
            CaseArt
        },
        props: [
            'box',
            'index'
        ],
        methods: {
            unboxFormatValue(value) {
                return parseFloat(Math.floor(value / 10) / 100).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            }
        },
        computed: {
            elementStyle() {
                return { '--case-glow': caseTheme(this.box.slug).glow, '--i': this.index || 0 };
            }
        }
    }
</script>

<style scoped>
    a.unbox-box-element {
        position: relative;
        display: flex;
        flex-direction: column;
        padding: 10px 10px 14px 10px;
        border-radius: 16px;
        background: #1a2c38;
        box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.05);
        overflow: hidden;
        isolation: isolate;
        animation: case-card-in .7s cubic-bezier(.32, .72, 0, 1) both;
        animation-delay: calc(var(--i) * 45ms);
        transition: transform .5s cubic-bezier(.32, .72, 0, 1), box-shadow .5s cubic-bezier(.32, .72, 0, 1), background .3s ease;
    }

    a.unbox-box-element::before {
        content: '';
        position: absolute;
        inset: 0;
        background: radial-gradient(90% 70% at 50% 30%, var(--case-glow) 0%, transparent 70%);
        opacity: .1;
        transition: opacity .5s ease;
        z-index: -1;
    }

    a.unbox-box-element:hover {
        transform: translateY(-4px);
        background: #1e3240;
        box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.08), 0 18px 40px -18px rgba(0, 0, 0, 0.7);
    }

    a.unbox-box-element:hover::before { opacity: .22; }

    a.unbox-box-element:active { transform: translateY(-2px) scale(.985); }

    .unbox-box-element .element-stage {
        padding: 4px 10px 0 10px;
    }

    .unbox-box-element .element-info {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 6px;
        margin-top: 2px;
    }

    .unbox-box-element .info-name {
        max-width: 100%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        font-size: 15px;
        font-weight: 600;
        letter-spacing: -0.01em;
        color: #ffffff;
    }

    .unbox-box-element .info-price {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 4px 10px;
        border-radius: 999px;
        background: rgba(15, 33, 46, 0.8);
        font-size: 13px;
        font-weight: 700;
        font-variant-numeric: tabular-nums;
        color: #ffffff;
    }

    .unbox-box-element .info-price img { width: 14px; height: 14px; }

    .unbox-box-element .element-cta {
        position: absolute;
        top: 12px;
        right: 12px;
        display: flex;
        align-items: center;
        gap: 2px;
        padding: 5px 8px 5px 11px;
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        font-size: 12px;
        font-weight: 600;
        color: #ffffff;
        opacity: 0;
        transform: translateY(-4px);
        transition: opacity .35s ease, transform .5s cubic-bezier(.32, .72, 0, 1);
    }

    .unbox-box-element .element-cta svg {
        width: 12px;
        height: 12px;
        fill: none;
        stroke: currentColor;
        stroke-width: 2;
        stroke-linecap: round;
        stroke-linejoin: round;
    }

    a.unbox-box-element:hover .element-cta {
        opacity: 1;
        transform: none;
    }

    @keyframes case-card-in {
        from { opacity: 0; transform: translateY(14px) scale(.97); }
        to { opacity: 1; transform: none; }
    }

    @media (prefers-reduced-motion: reduce) {
        a.unbox-box-element { animation: none; }
    }
</style>
