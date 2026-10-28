<template>
    <svg class="game-art" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <defs>
            <linearGradient v-bind:id="uid('gold')" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stop-color="#ffe082"/><stop offset=".5" stop-color="#f5b70a"/><stop offset="1" stop-color="#a86a00"/>
            </linearGradient>
            <linearGradient v-bind:id="uid('steel')" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stop-color="#e8eef5"/><stop offset=".55" stop-color="#9aa9ba"/><stop offset="1" stop-color="#5b6b7d"/>
            </linearGradient>
            <radialGradient v-bind:id="uid('shadow')" cx=".5" cy=".5" r=".5">
                <stop offset="0" stop-color="#000" stop-opacity=".45"/><stop offset="1" stop-color="#000" stop-opacity="0"/>
            </radialGradient>
        </defs>

        <!-- ================= CRASH ================= -->
        <g v-if="game === 'crash'">
            <defs>
                <linearGradient v-bind:id="uid('area')" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stop-color="#ffa600" stop-opacity=".55"/><stop offset="1" stop-color="#ffa600" stop-opacity="0"/>
                </linearGradient>
            </defs>
            <g stroke="#ffffff" stroke-opacity=".07" stroke-width="1">
                <path d="M20 40H180M20 80H180M20 120H180M20 160H180M50 30V170M90 30V170M130 30V170M170 30V170"/>
            </g>
            <path d="M22 168 C 80 166, 120 140, 168 52 L 168 170 L 22 170 Z" v-bind:fill="url('area')"/>
            <path d="M22 168 C 80 166, 120 140, 168 52" fill="none" stroke="#ffa600" stroke-width="5" stroke-linecap="round" style="filter: drop-shadow(0 0 6px rgba(255,166,0,.8))"/>
            <circle cx="168" cy="52" r="9" fill="#ffffff" style="filter: drop-shadow(0 0 10px rgba(255,166,0,1))"/>
            <circle cx="168" cy="52" r="16" fill="none" stroke="#ffa600" stroke-opacity=".35" stroke-width="2"/>
            <text x="30" y="62" font-family="Figtree, sans-serif" font-size="30" font-weight="800" fill="#ffffff">2.47×</text>
        </g>

        <!-- ================= ROULETTE ================= -->
        <g v-else-if="game === 'roll'">
            <ellipse cx="100" cy="176" rx="78" ry="8" v-bind:fill="url('shadow')"/>
            <rect x="14" y="58" width="172" height="92" rx="14" fill="#0f212e" stroke="#2f4553" stroke-width="2"/>
            <g v-for="card in rollCards" v-bind:key="card.x">
                <rect v-bind:x="card.x" v-bind:y="card.big ? 66 : 74" v-bind:width="card.big ? 52 : 40" v-bind:height="card.big ? 76 : 60" rx="8"
                    v-bind:fill="card.fill" v-bind:style="card.big ? 'filter: drop-shadow(0 0 10px rgba(0,231,1,.55))' : ''"/>
                <text v-bind:x="card.x + (card.big ? 26 : 20)" v-bind:y="card.big ? 112 : 110" text-anchor="middle"
                    font-family="Inter, sans-serif" font-weight="800" v-bind:font-size="card.big ? 19 : 14"
                    v-bind:fill="card.big ? '#05080a' : '#ffffff'">{{ card.label }}</text>
            </g>
            <path d="M100 46 L108 34 H92 Z" fill="#00e701"/>
            <path d="M100 162 L108 174 H92 Z" fill="#00e701"/>
        </g>

        <g v-else-if="game === 'roulette'">
            <ellipse cx="100" cy="186" rx="70" ry="8" v-bind:fill="url('shadow')"/>
            <circle cx="100" cy="100" r="78" fill="#3b2412"/>
            <circle cx="100" cy="100" r="74" fill="#5a3518"/>
            <g>
                <path v-for="n in 18" v-bind:key="'p' + n"
                    v-bind:d="wedge(100, 100, 66, 44, (n - 1) * 20, n * 20)"
                    v-bind:fill="n === 1 ? '#0f9d58' : (n % 2 ? '#c8102e' : '#14181f')"
                    stroke="#d4b26a" stroke-width=".8"/>
            </g>
            <circle cx="100" cy="100" r="44" fill="none" stroke="#d4b26a" stroke-width="2"/>
            <circle cx="100" cy="100" r="40" v-bind:fill="url('steel')"/>
            <circle cx="100" cy="100" r="40" fill="none" stroke="#2c3946" stroke-opacity=".5" stroke-width="2"/>
            <g v-bind:fill="url('gold')">
                <rect x="97" y="64" width="6" height="72" rx="3"/>
                <rect x="64" y="97" width="72" height="6" rx="3"/>
                <circle cx="100" cy="100" r="9"/>
            </g>
            <circle cx="153" cy="66" r="6.5" fill="#ffffff" style="filter: drop-shadow(0 2px 3px rgba(0,0,0,.5))"/>
            <circle cx="151" cy="64" r="2" fill="#ffffff" opacity=".9"/>
        </g>

        <!-- ================= BLACKJACK ================= -->
        <g v-else-if="game === 'blackjack'">
            <ellipse cx="100" cy="182" rx="74" ry="9" v-bind:fill="url('shadow')"/>
            <g transform="rotate(-12 80 108)">
                <rect x="38" y="40" width="80" height="112" rx="9" fill="#f7f8fa" stroke="#d5dae1"/>
                <text x="48" y="64" font-family="Georgia, serif" font-size="20" font-weight="700" fill="#14181f">K</text>
                <text x="48" y="82" font-family="Georgia, serif" font-size="16" fill="#14181f">♠</text>
                <text x="78" y="118" text-anchor="middle" font-family="Georgia, serif" font-size="46" fill="#14181f">♠</text>
            </g>
            <g transform="rotate(10 120 104)">
                <rect x="84" y="36" width="80" height="112" rx="9" fill="#ffffff" stroke="#d5dae1" style="filter: drop-shadow(-6px 6px 10px rgba(0,0,0,.35))"/>
                <text x="94" y="60" font-family="Georgia, serif" font-size="20" font-weight="700" fill="#c8102e">A</text>
                <text x="94" y="78" font-family="Georgia, serif" font-size="16" fill="#c8102e">♥</text>
                <text x="124" y="116" text-anchor="middle" font-family="Georgia, serif" font-size="50" fill="#c8102e">♥</text>
            </g>
            <g transform="translate(150 150)">
                <ellipse cx="0" cy="8" rx="22" ry="7" fill="#0b3d24"/>
                <ellipse cx="0" cy="2" rx="22" ry="7" fill="#118c4f"/>
                <ellipse cx="0" cy="-4" rx="22" ry="7" fill="#16a35c"/>
                <ellipse cx="0" cy="-4" rx="13" ry="4" fill="none" stroke="#ffffff" stroke-width="2" stroke-dasharray="4 3"/>
            </g>
        </g>

        <!-- ================= DICE DUELS ================= -->
        <g v-else-if="game === 'duels'">
            <ellipse cx="100" cy="176" rx="76" ry="9" v-bind:fill="url('shadow')"/>
            <g v-for="die in dice" v-bind:key="die.x" v-bind:transform="'translate(' + die.x + ' ' + die.y + ') rotate(' + die.r + ')'">
                <path d="M0 -30 L 30 -14 L 0 2 L -30 -14 Z" fill="#ffffff"/>
                <path d="M-30 -14 L 0 2 L 0 38 L -30 22 Z" fill="#d9dee6"/>
                <path d="M30 -14 L 0 2 L 0 38 L 30 22 Z" fill="#b8c1cd"/>
                <g fill="#c8102e">
                    <ellipse v-for="(pip, i) in die.top" v-bind:key="'t' + i" v-bind:cx="pip[0]" v-bind:cy="pip[1]" rx="4" ry="2.4"/>
                </g>
                <g fill="#14181f">
                    <ellipse v-for="(pip, i) in die.left" v-bind:key="'l' + i" v-bind:cx="pip[0]" v-bind:cy="pip[1]" rx="2.6" ry="3.4"/>
                    <ellipse v-for="(pip, i) in die.right" v-bind:key="'r' + i" v-bind:cx="pip[0]" v-bind:cy="pip[1]" rx="2.6" ry="3.4"/>
                </g>
            </g>
        </g>


        <!-- ================= PLINKO ================= -->
        <g v-else-if="game === 'plinko'">
            <g v-for="peg in plinkoPegs" v-bind:key="peg.x + '-' + peg.y">
                <circle v-bind:cx="peg.x" v-bind:cy="peg.y" r="4" fill="#ffffff" v-bind:opacity="peg.lit ? 1 : .85"/>
                <circle v-if="peg.lit" v-bind:cx="peg.x" v-bind:cy="peg.y" r="9" fill="#ffffff" opacity=".18"/>
            </g>
            <path d="M100 26 Q 108 48 112 62 Q 96 78 88 96 Q 104 112 112 128" fill="none" stroke="#ff2d55" stroke-opacity=".35" stroke-width="3" stroke-dasharray="2 6" stroke-linecap="round"/>
            <circle cx="112" cy="128" r="9" fill="#ff2d55" style="filter: drop-shadow(0 0 8px rgba(255,45,85,.9))"/>
            <circle cx="109" cy="125" r="3" fill="#ffffff" opacity=".6"/>
            <g v-for="(slot, i) in plinkoSlots" v-bind:key="'slot' + i">
                <rect v-bind:x="15 + i * 25" y="158" width="21" height="16" rx="3" v-bind:fill="slot"/>
            </g>
        </g>

        <!-- ================= DICE ================= -->
        <g v-else-if="game === 'dice'">
            <rect x="20" y="128" width="160" height="22" rx="11" fill="#2f4553"/>
            <rect x="30" y="135" width="84" height="8" rx="4" fill="#ff3b5c"/>
            <rect x="114" y="135" width="56" height="8" rx="4" fill="#00e701"/>
            <rect x="104" y="124" width="18" height="30" rx="4" fill="#4d8fd6" style="filter: drop-shadow(0 3px 4px rgba(0,0,0,.4))"/>
            <g transform="translate(100 74) rotate(-12)">
                <rect x="-34" y="-34" width="68" height="68" rx="14" fill="#ffffff" style="filter: drop-shadow(0 10px 14px rgba(0,0,0,.45))"/>
                <circle cx="-15" cy="-15" r="6.5" fill="#0f212e"/>
                <circle cx="0" cy="0" r="6.5" fill="#0f212e"/>
                <circle cx="15" cy="15" r="6.5" fill="#0f212e"/>
                <circle cx="15" cy="-15" r="6.5" fill="#0f212e"/>
                <circle cx="-15" cy="15" r="6.5" fill="#0f212e"/>
            </g>
        </g>

        <!-- ================= FLIP ================= -->
        <g v-else-if="game === 'flip'">
            <defs>
                <radialGradient v-bind:id="uid('coin')" cx=".32" cy=".28" r=".8">
                    <stop offset="0" stop-color="#fff4c4"/><stop offset=".35" stop-color="#ffd34d"/><stop offset=".75" stop-color="#e0a21a"/><stop offset="1" stop-color="#a86a00"/>
                </radialGradient>
            </defs>
            <ellipse cx="100" cy="176" rx="46" ry="7" v-bind:fill="url('shadow')"/>
            <ellipse cx="100" cy="98" rx="62" ry="64" fill="#a86a00"/>
            <ellipse cx="100" cy="92" rx="62" ry="64" v-bind:fill="url('coin')"/>
            <ellipse cx="100" cy="92" rx="44" ry="46" fill="none" stroke="#000" stroke-opacity=".16" stroke-width="3" stroke-dasharray="5 5"/>
            <path d="m100 62 9 18.5 20.2 2.9-14.6 14.3 3.5 20.1L100 108.3l-18.1 9.5 3.5-20.1-14.6-14.3 20.2-2.9z" fill="#a86a00" opacity=".75"/>
        </g>

        <!-- ================= MINES ================= -->
        <g v-else-if="game === 'mines'">
            <g v-for="cell in mineGrid" v-bind:key="cell.x + '-' + cell.y">
                <rect v-bind:x="cell.x" v-bind:y="cell.y" width="40" height="40" rx="7" fill="#2f4553"/>
                <rect v-bind:x="cell.x" v-bind:y="cell.y + 36" width="40" height="4" rx="2" fill="#1f3341"/>
            </g>
            <rect x="34" y="62" width="62" height="62" rx="10" fill="#0f212e"/>
            <g transform="translate(65 93)">
                <path d="M-18 -16 H18 L28 -2 L0 26 L-28 -2 Z" fill="#0fbf3a"/>
                <path d="M-18 -16 L-8 -2 H8 L18 -16 Z" fill="#6bff6c"/>
                <path d="M-28 -2 H28 L0 26 Z" fill="#00a32a"/>
                <path d="M-8 -2 L0 26 L8 -2 Z" fill="#33d655"/>
            </g>
            <rect x="104" y="70" width="62" height="62" rx="10" fill="#0f212e"/>
            <g transform="translate(135 104)">
                <circle r="20" fill="#d81e4a"/>
                <circle cx="-7" cy="-7" r="6" fill="#ffffff" opacity=".35"/>
                <rect x="10" y="-28" width="9" height="10" rx="2" transform="rotate(40 14 -23)" fill="#7a0f26"/>
                <path d="M18 -28 l6 -6 M20 -24 l8 -1" stroke="#ffb02e" stroke-width="3" stroke-linecap="round"/>
            </g>
        </g>

        <!-- ================= TOWERS ================= -->
        <g v-else-if="game === 'towers'">
            <ellipse cx="100" cy="184" rx="72" ry="8" v-bind:fill="url('shadow')"/>
            <g v-for="(row, r) in towerRows" v-bind:key="'row' + r">
                <g v-for="c in 3" v-bind:key="'c' + r + c">
                    <rect v-bind:x="30 + (c - 1) * 48" v-bind:y="row.y" width="42" height="30" rx="6"
                        v-bind:fill="row.win === c ? '#0f212e' : '#2f4553'"/>
                    <rect v-if="row.win !== c" v-bind:x="30 + (c - 1) * 48" v-bind:y="row.y + 27" width="42" height="3" rx="1.5" fill="#1f3341"/>
                    <g v-if="row.win === c" v-bind:transform="'translate(' + (51 + (c - 1) * 48) + ' ' + (row.y + 15) + ') scale(.42)'">
                        <path d="M-18 -16 H18 L28 -2 L0 26 L-28 -2 Z" fill="#0fbf3a"/>
                        <path d="M-18 -16 L-8 -2 H8 L18 -16 Z" fill="#6bff6c"/>
                        <path d="M-28 -2 H28 L0 26 Z" fill="#00a32a"/>
                    </g>
                </g>
            </g>
        </g>


    </svg>
</template>

<script>
    let counter = 0;

    export default {
        name: 'GameArt',
        props: ['game'],
        data() {
            counter += 1;
            return {
                artId: 'ga' + counter,
                artBackend: process.env.VUE_APP_BACKEND_URL,
                dice: [
                    { x: 72, y: 104, r: -6, top: [[0, -14]], left: [[-22, -2], [-8, 22]], right: [[8, 4], [15, 12], [22, 20]] },
                    { x: 132, y: 92, r: 8, top: [[-12, -14], [12, -14], [0, -14]], left: [[-15, 10]], right: [[8, 0], [22, 18], [8, 18], [22, 0]] }
                ],
                mineGrid: [
                    { x: 14, y: 18 }, { x: 58, y: 18 }, { x: 102, y: 18 }, { x: 146, y: 18 },
                    { x: 14, y: 142 }, { x: 58, y: 142 }, { x: 102, y: 142 }, { x: 146, y: 142 }
                ],
                plinkoPegs: [
                    { x: 100, y: 40 },
                    { x: 88, y: 62 }, { x: 112, y: 62, lit: true },
                    { x: 76, y: 84 }, { x: 100, y: 84, lit: true }, { x: 124, y: 84 },
                    { x: 64, y: 106 }, { x: 88, y: 106 }, { x: 112, y: 106, lit: true }, { x: 136, y: 106 },
                    { x: 52, y: 128 }, { x: 76, y: 128 }, { x: 100, y: 128 }, { x: 124, y: 128 }, { x: 148, y: 128 },
                    { x: 40, y: 150 }, { x: 64, y: 150 }, { x: 88, y: 150 }, { x: 112, y: 150 }, { x: 136, y: 150 }, { x: 160, y: 150 }
                ],
                plinkoSlots: ['#ff003f', '#ff5a1f', '#ff9a0a', '#ffc000', '#ffc000', '#ff9a0a', '#ff5a1f'],
                rollCards: [
                    { x: 22, label: '2×', fill: '#2f4553' },
                    { x: 74, label: '14×', fill: '#00e701', big: true },
                    { x: 138, label: '3×', fill: '#2f4553' }
                ],
                towerRows: [
                    { y: 30, win: 0 }, { y: 66, win: 2 }, { y: 102, win: 1 }, { y: 138, win: 3 }
                ]
            }
        },
        methods: {
            uid(name) { return this.artId + '-' + name; },
            url(name) { return 'url(#' + this.uid(name) + ')'; },
            wedge(cx, cy, outer, inner, startDeg, endDeg) {
                const rad = (deg) => (deg - 90) * Math.PI / 180;
                const p = (r, deg) => [cx + r * Math.cos(rad(deg)), cy + r * Math.sin(rad(deg))].map((v) => v.toFixed(2)).join(' ');
                return `M${p(outer, startDeg)} A${outer} ${outer} 0 0 1 ${p(outer, endDeg)} L${p(inner, endDeg)} A${inner} ${inner} 0 0 0 ${p(inner, startDeg)} Z`;
            }
        }
    }
</script>

<style scoped>
    .game-art {
        width: 100%;
        height: 100%;
        overflow: visible;
    }
</style>
