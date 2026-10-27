<template>
    <div
        class="case-art"
        v-bind:class="{ 'art-interactive': interactive !== false, 'art-hover': artHover, 'art-float': float === true }"
        v-bind:style="artStyle"
        v-on:mousemove="artMove"
        v-on:mouseleave="artLeave"
    >
        <svg class="art-svg" viewBox="22 34 208 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <defs>
                <radialGradient v-bind:id="id + 'glow'" cx="50%" cy="54%" r="50%">
                    <stop offset="0" v-bind:stop-color="theme.glow" stop-opacity=".42" />
                    <stop offset=".55" v-bind:stop-color="theme.glow" stop-opacity=".1" />
                    <stop offset="1" v-bind:stop-color="theme.glow" stop-opacity="0" />
                </radialGradient>
                <linearGradient v-bind:id="id + 'top'" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" v-bind:stop-color="theme.light" />
                    <stop offset="1" v-bind:stop-color="theme.base" />
                </linearGradient>
                <linearGradient v-bind:id="id + 'front'" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" v-bind:stop-color="theme.base" />
                    <stop offset="1" v-bind:stop-color="theme.shade" />
                </linearGradient>
                <linearGradient v-bind:id="id + 'side'" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" v-bind:stop-color="theme.shade" />
                    <stop offset="1" stop-color="#0b1720" />
                </linearGradient>
                <linearGradient v-bind:id="id + 'trim'" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" v-bind:stop-color="theme.trim" />
                    <stop offset="1" v-bind:stop-color="theme.base" />
                </linearGradient>
                <radialGradient v-bind:id="id + 'sheen'" v-bind:cx="sheenX + '%'" v-bind:cy="sheenY + '%'" r="55%">
                    <stop offset="0" stop-color="#ffffff" v-bind:stop-opacity="artHover ? .32 : .14" />
                    <stop offset="1" stop-color="#ffffff" stop-opacity="0" />
                </radialGradient>
                <filter v-bind:id="id + 'blur'" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="7" />
                </filter>
                <clipPath v-bind:id="id + 'faces'">
                    <polygon points="52,104 172,104 204,80 84,80" />
                    <polygon points="52,104 172,104 172,190 52,190" />
                    <polygon points="172,104 204,80 204,164 172,190" />
                </clipPath>
            </defs>

            <circle cx="122" cy="132" r="112" v-bind:fill="'url(#' + id + 'glow)'" />
            <ellipse class="art-shadow" cx="126" cy="204" rx="84" ry="11" fill="#000" fill-opacity=".55" v-bind:filter="'url(#' + id + 'blur)'" />

            <g class="art-body" stroke-linejoin="round" stroke-width="8">
                <polygon points="172,104 204,80 204,164 172,190" v-bind:fill="'url(#' + id + 'side)'" v-bind:stroke="theme.shade" />
                <polygon points="52,104 172,104 204,80 84,80" v-bind:fill="'url(#' + id + 'top)'" v-bind:stroke="theme.base" />
                <polygon points="52,104 172,104 172,190 52,190" v-bind:fill="'url(#' + id + 'front)'" v-bind:stroke="theme.base" />

                <!-- lid seam -->
                <path d="M50 125 H174 L206 101" fill="none" stroke="#000" stroke-opacity=".35" stroke-width="2.5" />
                <path d="M50 127.5 H174 L206 103.5" fill="none" stroke="#fff" stroke-opacity=".12" stroke-width="1" />

                <!-- handle -->
                <path d="M112 93 q16 -13 32 0" fill="none" v-bind:stroke="theme.shade" stroke-width="7" stroke-linecap="round" />
                <path d="M113 91.5 q15 -11.5 30 0" fill="none" v-bind:stroke="theme.trim" stroke-opacity=".55" stroke-width="1.6" stroke-linecap="round" />

                <!-- latches -->
                <g v-bind:fill="'url(#' + id + 'trim)'" stroke="none">
                    <rect x="68" y="115" width="15" height="21" rx="3.5" />
                    <rect x="141" y="115" width="15" height="21" rx="3.5" />
                </g>
                <g fill="#000" fill-opacity=".35" stroke="none">
                    <rect x="73" y="127" width="5" height="5" rx="1.5" />
                    <rect x="146" y="127" width="5" height="5" rx="1.5" />
                </g>

                <!-- emblem -->
                <circle cx="112" cy="160" r="16" fill="#000" fill-opacity=".22" v-bind:stroke="theme.trim" stroke-opacity=".45" stroke-width="1.5" />
                <path d="M112 149 L120 160 L112 171 L104 160 Z" v-bind:fill="'url(#' + id + 'trim)'" stroke="none" />

                <!-- edge light -->
                <path d="M57 104 H170" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="1.5" stroke-linecap="round" />
                <path d="M88 80 H201" fill="none" stroke="#fff" stroke-opacity=".3" stroke-width="1" stroke-linecap="round" />
                <path d="M172 106 V188" fill="none" v-bind:stroke="theme.trim" stroke-opacity=".3" stroke-width="1.2" />
            </g>

            <rect class="art-sheen" x="40" y="70" width="176" height="130" v-bind:fill="'url(#' + id + 'sheen)'" v-bind:clip-path="'url(#' + id + 'faces)'" />
        </svg>
    </div>
</template>

<script>
    import { caseTheme } from '@/utils/caseTheme';

    export default {
        name: 'CaseArt',
        props: {
            slug: { type: String, default: '' },
            interactive: { type: Boolean, default: true },
            float: { type: Boolean, default: false }
        },
        data() {
            return {
                artHover: false,
                tiltX: 0,
                tiltY: 0,
                sheenX: 30,
                sheenY: 20
            }
        },
        methods: {
            artMove(event) {
                if(this.interactive === false) { return; }

                const rect = this.$el.getBoundingClientRect();
                const x = (event.clientX - rect.left) / rect.width;
                const y = (event.clientY - rect.top) / rect.height;

                this.artHover = true;
                this.tiltX = (0.5 - y) * 14;
                this.tiltY = (x - 0.5) * 18;
                this.sheenX = Math.round(x * 100);
                this.sheenY = Math.round(y * 100);
            },
            artLeave() {
                this.artHover = false;
                this.tiltX = 0;
                this.tiltY = 0;
                this.sheenX = 30;
                this.sheenY = 20;
            }
        },
        computed: {
            id() {
                return 'case' + this._uid + '-';
            },
            theme() {
                return caseTheme(this.slug);
            },
            artStyle() {
                return { '--tilt-x': this.tiltX + 'deg', '--tilt-y': this.tiltY + 'deg' };
            }
        }
    }
</script>

<style scoped>
    .case-art {
        width: 100%;
        aspect-ratio: 1 / 1;
        perspective: 700px;
    }

    .case-art .art-svg {
        width: 100%;
        height: 100%;
        display: block;
        overflow: visible;
        transform: rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg));
        transition: transform .6s cubic-bezier(.32, .72, 0, 1);
        will-change: transform;
    }

    .case-art.art-hover .art-svg {
        transition: transform .12s linear;
    }

    .case-art .art-body,
    .case-art .art-sheen {
        transform-origin: 128px 140px;
        transition: transform .6s cubic-bezier(.32, .72, 0, 1);
    }

    .case-art .art-shadow {
        transform-origin: 126px 204px;
        transition: transform .6s cubic-bezier(.32, .72, 0, 1), opacity .6s ease;
    }

    .case-art.art-hover .art-body,
    .case-art.art-hover .art-sheen {
        transform: translateY(-7px);
    }

    .case-art.art-hover .art-shadow {
        transform: scale(.88);
        opacity: .7;
    }

    .case-art.art-float .art-body,
    .case-art.art-float .art-sheen {
        animation: case-float 5.5s ease-in-out infinite;
    }

    .case-art.art-float .art-shadow {
        animation: case-shadow 5.5s ease-in-out infinite;
    }

    @keyframes case-float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-8px); }
    }

    @keyframes case-shadow {
        0%, 100% { transform: scale(1); opacity: 1; }
        50% { transform: scale(.86); opacity: .65; }
    }

    @media (prefers-reduced-motion: reduce) {
        .case-art .art-svg { transform: none !important; }
        .case-art.art-float .art-body,
        .case-art.art-float .art-sheen,
        .case-art.art-float .art-shadow { animation: none; }
    }
</style>
