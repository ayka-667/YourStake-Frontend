<template>
    <svg class="flip-coin-face" viewBox="0 0 200 200" aria-hidden="true">
        <defs>
            <linearGradient v-bind:id="faceId('rim')" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stop-color="#fff2bd" />
                <stop offset=".22" stop-color="#f3c94f" />
                <stop offset=".5" stop-color="#b9860c" />
                <stop offset=".72" stop-color="#f6d97e" />
                <stop offset="1" stop-color="#835400" />
            </linearGradient>
            <radialGradient v-bind:id="faceId('field')" cx=".36" cy=".3" r=".85">
                <stop offset="0" stop-color="#ffe7a1" />
                <stop offset=".45" stop-color="#e6b437" />
                <stop offset=".82" stop-color="#bd860f" />
                <stop offset="1" stop-color="#946303" />
            </radialGradient>
            <linearGradient v-bind:id="faceId('relief')" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stop-color="#fff5cf" />
                <stop offset=".5" stop-color="#f0c544" />
                <stop offset="1" stop-color="#a5740a" />
            </linearGradient>
            <path v-bind:id="faceId('top')" d="M 36 100 A 64 64 0 0 1 164 100" />
            <path v-bind:id="faceId('bottom')" d="M 26 100 A 74 74 0 0 0 174 100" />
            <g v-bind:id="faceId('art')">
                <template v-if="mini === false">
                    <text class="face-text"><textPath v-bind:href="'#' + faceId('top')" startOffset="50%" text-anchor="middle">YOURSTAKE</textPath></text>
                    <text class="face-text"><textPath v-bind:href="'#' + faceId('bottom')" startOffset="50%" text-anchor="middle" dominant-baseline="hanging">{{ side === 'heads' ? 'HEADS' : 'TAILS' }}</textPath></text>
                </template>
                <g v-if="side === 'heads'" v-bind:transform="mini === true ? 'translate(100 104) scale(1.45) translate(-100 -104)' : ''">
                    <path d="M71 120 L66 86 L83 100 L100 76 L117 100 L134 86 L129 120 Z" />
                    <rect x="70" y="124" width="60" height="9" rx="2" />
                    <circle cx="66" cy="82" r="4.5" />
                    <circle cx="100" cy="71" r="5" />
                    <circle cx="134" cy="82" r="4.5" />
                </g>
                <path v-else v-bind:d="faceStar" />
            </g>
        </defs>

        <circle cx="100" cy="100" r="99" v-bind:fill="'url(#' + faceId('rim') + ')'" />
        <circle cx="100" cy="100" r="97" fill="none" stroke="#5c3b00" stroke-opacity=".35" stroke-width="3" stroke-dasharray="1.6 1.6" />
        <circle cx="100" cy="100" r="88" v-bind:fill="'url(#' + faceId('field') + ')'" />
        <circle cx="100.8" cy="100.8" r="88" fill="none" stroke="#5a3a00" stroke-opacity=".55" stroke-width="1.6" />
        <circle cx="99.4" cy="99.4" r="88.4" fill="none" stroke="#fff6d2" stroke-opacity=".7" stroke-width="1.2" />
        <circle v-if="mini === false" cx="100" cy="100" r="81" fill="none" v-bind:stroke="'url(#' + faceId('relief') + ')'" stroke-width="3.2" stroke-linecap="round" stroke-dasharray="0 7.27" />

        <use v-bind:href="'#' + faceId('art')" fill="#4f3300" opacity=".55" transform="translate(1 1.5)" />
        <use v-bind:href="'#' + faceId('art')" fill="#fff6d0" opacity=".85" transform="translate(-.7 -.7)" />
        <use v-bind:href="'#' + faceId('art')" v-bind:fill="'url(#' + faceId('relief') + ')'" />
    </svg>
</template>

<script>
    let faceCount = 0;

    export default {
        name: 'FlipCoinFace',
        props: {
            side: { type: String, default: 'heads' },
            mini: { type: Boolean, default: false }
        },
        data() {
            faceCount = faceCount + 1;

            return {
                faceUid: 'coin' + faceCount
            }
        },
        methods: {
            faceId(name) {
                return this.faceUid + '-' + name;
            }
        },
        computed: {
            faceStar() {
                const outer = this.mini === true ? 46 : 32;
                const inner = outer * 0.42;
                const points = [];

                for(let i = 0; i < 10; i++) {
                    const angle = (-90 + i * 36) * Math.PI / 180;
                    const radius = i % 2 === 0 ? outer : inner;
                    points.push((100 + Math.cos(angle) * radius).toFixed(2) + ' ' + (102 + Math.sin(angle) * radius).toFixed(2));
                }

                return 'M' + points.join(' L') + ' Z';
            }
        }
    }
</script>

<style scoped>
    .flip-coin-face {
        display: block;
        width: 100%;
        height: 100%;
    }

    .flip-coin-face .face-text {
        font-family: Georgia, 'Times New Roman', serif;
        font-size: 15px;
        font-weight: 700;
        letter-spacing: 4px;
    }
</style>
