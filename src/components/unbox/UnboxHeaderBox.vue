<template>
    <div class="unbox-header-box" v-bind:style="heroStyle">
        <router-link class="link-back" to="/unbox">
            <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M10 3L5 8l5 5" /></svg>
            All cases
        </router-link>
        <div v-if="unboxBoxData.box !== null" class="hero-body">
            <div class="hero-art">
                <CaseArt v-bind:slug="unboxBoxData.box.slug" v-bind:float="true" />
            </div>
            <div class="hero-info">
                <span class="info-eyebrow">{{ heroTheme.label }} case</span>
                <h1 class="info-name">{{ unboxBoxData.box.name }}</h1>
                <div class="info-meta">
                    <div class="meta-price">
                        <img src="@/assets/img/icons/coin.svg" alt="" />
                        {{ unboxFormatValue(unboxBoxData.box.amount) }}
                    </div>
                    <span class="meta-note">per case</span>
                </div>
                <button v-on:click="unboxFairButton()" class="button-fair">
                    <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 1.5l5.5 2v4c0 3.4-2.3 6-5.5 7-3.2-1-5.5-3.6-5.5-7v-4z" /><path d="M5.6 8.1l1.7 1.7 3.2-3.4" /></svg>
                    Provably fair
                </button>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';
    import CaseArt from '@/components/CaseArt';
    import { caseTheme } from '@/utils/caseTheme';

    export default {
        name: 'UnboxHeaderBox',
        components: {
            CaseArt
        },
        methods: {
            ...mapActions([
                'notificationShow',
                'modalsSetShow'
            ]),
            unboxFormatValue(value) {
                return parseFloat(Math.floor(value / 10) / 100).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            },
            unboxFairButton() {
                if(this.authUser.user === null) {
                    this.notificationShow({ type: 'error', message: 'Please sign in to perform this action.' });
                    return;
                }

                this.modalsSetShow('FairSeed');
            }
        },
        computed: {
            ...mapGetters([
                'authUser',
                'unboxBoxData'
            ]),
            heroTheme() {
                return caseTheme(this.unboxBoxData.box !== null ? this.unboxBoxData.box.slug : '');
            },
            heroStyle() {
                return { '--case-glow': this.heroTheme.glow };
            }
        }
    }
</script>

<style scoped>
    .unbox-header-box {
        position: relative;
        width: 100%;
        margin-bottom: 18px;
        padding: 22px 28px 28px 28px;
        border-radius: 20px;
        background:
            radial-gradient(60% 120% at 18% 55%, color-mix(in srgb, var(--case-glow) 26%, transparent) 0%, transparent 70%),
            linear-gradient(180deg, #1a2c38 0%, #152733 100%);
        box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.05);
        overflow: hidden;
        animation: hero-in .8s cubic-bezier(.32, .72, 0, 1) both;
    }

    .unbox-header-box a.link-back {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        padding: 6px 12px 6px 8px;
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.06);
        font-size: 13px;
        font-weight: 600;
        color: #b1bad3;
        transition: background .3s ease, color .3s ease;
    }

    .unbox-header-box a.link-back:hover { background: rgba(255, 255, 255, 0.1); color: #ffffff; }

    .unbox-header-box svg {
        width: 16px;
        height: 16px;
        fill: none;
        stroke: currentColor;
        stroke-width: 1.8;
        stroke-linecap: round;
        stroke-linejoin: round;
    }

    .unbox-header-box .hero-body {
        display: flex;
        align-items: center;
        gap: 36px;
        margin-top: 6px;
    }

    .unbox-header-box .hero-art {
        width: 240px;
        flex: none;
    }

    .unbox-header-box .info-eyebrow {
        font-size: 13px;
        font-weight: 600;
        color: var(--case-glow);
    }

    .unbox-header-box .info-name {
        margin: 4px 0 14px 0;
        font-size: 40px;
        font-weight: 800;
        line-height: 1.05;
        letter-spacing: -0.03em;
        color: #ffffff;
    }

    .unbox-header-box .info-meta {
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .unbox-header-box .meta-price {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 8px 14px;
        border-radius: 999px;
        background: rgba(15, 33, 46, 0.75);
        font-size: 18px;
        font-weight: 800;
        font-variant-numeric: tabular-nums;
        color: #ffffff;
    }

    .unbox-header-box .meta-price img { width: 18px; height: 18px; }

    .unbox-header-box .meta-note {
        font-size: 13px;
        font-weight: 500;
        color: #7f92a5;
    }

    .unbox-header-box button.button-fair {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        margin-top: 22px;
        padding: 8px 14px;
        border-radius: 10px;
        background: rgba(255, 255, 255, 0.06);
        font-size: 13px;
        font-weight: 600;
        color: #b1bad3;
        transition: background .3s ease, color .3s ease, transform .3s cubic-bezier(.32, .72, 0, 1);
    }

    .unbox-header-box button.button-fair:hover { background: rgba(255, 255, 255, 0.1); color: #ffffff; }
    .unbox-header-box button.button-fair:active { transform: scale(.97); }

    @keyframes hero-in {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: none; }
    }

    @media only screen and (max-width: 700px) {
        .unbox-header-box { padding: 18px; }
        .unbox-header-box .hero-body { flex-direction: column; text-align: center; gap: 10px; }
        .unbox-header-box .hero-art { width: 180px; }
        .unbox-header-box .info-meta { justify-content: center; }
        .unbox-header-box .info-name { font-size: 30px; }
    }
</style>