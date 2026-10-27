<template>
    <router-link
        v-bind:to="'/blackjack/table/' + (table.table + 1)"
        class="blackjack-tables-element"
        v-bind:class="['element-' + table.game.type, 'status-' + tableStatus.key]"
        v-bind:style="{ '--i': index || 0 }"
    >
        <div class="element-stage">
            <svg class="stage-table" viewBox="0 0 320 176" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <defs>
                    <radialGradient v-bind:id="id + 'felt'" cx="50%" cy="20%" r="85%">
                        <stop offset="0" v-bind:stop-color="palette.feltLight" />
                        <stop offset=".6" v-bind:stop-color="palette.felt" />
                        <stop offset="1" v-bind:stop-color="palette.feltDark" />
                    </radialGradient>
                    <linearGradient v-bind:id="id + 'rail'" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0" stop-color="#22323e" />
                        <stop offset="1" stop-color="#0c161d" />
                    </linearGradient>
                </defs>

                <path d="M16 12 H304 Q312 12 312 20 V54 C312 128 238 170 160 170 C82 170 8 128 8 54 V20 Q8 12 16 12 Z" v-bind:fill="'url(#' + id + 'rail)'" />
                <path d="M26 21 H294 Q302 21 302 29 V56 C302 120 232 160 160 160 C88 160 18 120 18 56 V29 Q18 21 26 21 Z" v-bind:fill="'url(#' + id + 'felt)'" />
                <path d="M26 21 H294 Q302 21 302 29 V56 C302 120 232 160 160 160 C88 160 18 120 18 56 V29 Q18 21 26 21 Z" fill="none" v-bind:stroke="palette.line" stroke-opacity=".55" stroke-width="1" />

                <path d="M 46 70 C 88 140 232 140 274 70" fill="none" v-bind:stroke="palette.line" stroke-opacity=".3" stroke-width="1" />

                <!-- chip tray -->
                <rect x="128" y="21" width="64" height="11" rx="3" fill="#0b141b" fill-opacity=".8" v-bind:stroke="palette.line" stroke-opacity=".35" stroke-width=".8" />

                <!-- dealer hand -->
                <g v-if="dealerCount > 0" class="table-dealer">
                    <rect v-for="n in dealerCount" v-bind:key="n"
                        v-bind:x="146 + (n - 1) * 10 - (dealerCount - 1) * 5" y="40" width="18" height="25" rx="2.5"
                        v-bind:fill="n === 2 && tableStatus.key === 'playing' ? '#16324a' : '#f4f1ea'"
                        stroke="#000" stroke-opacity=".25" stroke-width=".8" />
                </g>
            </svg>

            <div class="stage-seats">
                <div
                    v-for="(seat, n) in seats"
                    v-bind:key="n"
                    class="seat"
                    v-bind:class="{ 'seat-taken': seat !== null }"
                    v-bind:style="{ left: seatPositions[n][0] + '%', top: seatPositions[n][1] + '%', '--d': n }"
                    v-bind:title="seat !== null ? seat.user.username : 'Free seat'"
                >
                    <AvatarImage v-if="seat !== null" v-bind:image="seat.user.avatar" />
                </div>
            </div>

            <div class="stage-status">
                <span class="status-dot"></span>
                {{ tableStatus.label }}
            </div>
        </div>

        <div class="element-info">
            <div class="info-main">
                <span class="info-name">Table {{ table.table + 1 }}</span>
                <span class="info-limits">
                    <img src="@/assets/img/icons/coin.svg" alt="" />
                    {{ table.game.type === 'standard' ? '0.10 – 1,000' : '50 – 1,000' }}
                </span>
            </div>
            <div class="info-seats">
                <span class="seats-count">{{ table.players.length }}/5</span>
                <span class="seats-cta">
                    {{ table.players.length >= 5 ? 'Watch' : 'Join' }}
                    <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M6 3l5 5-5 5" /></svg>
                </span>
            </div>
        </div>
    </router-link>
</template>

<script>
    import AvatarImage from '@/components/AvatarImage';

    // Seat centres on the table, in % of the stage (seat 0 on the player's left)
    const SEAT_POSITIONS = [[17, 50], [32, 64], [50, 70], [68, 64], [83, 50]];

    const PALETTES = {
        standard: { felt: '#145c3c', feltLight: '#1d7a50', feltDark: '#0b3a26', line: '#e6c77a' },
        whale: { felt: '#1a2f57', feltLight: '#26457d', feltDark: '#0e1b36', line: '#e6c77a' }
    };

    export default {
        name: 'BlackjackTablesElement',
        components: {
            AvatarImage
        },
        props: ['table', 'index'],
        data() {
            return {
                seatPositions: SEAT_POSITIONS
            }
        },
        computed: {
            id() {
                return 'bjt' + this._uid + '-';
            },
            palette() {
                return PALETTES[this.table.game.type] || PALETTES.standard;
            },
            seats() {
                const seats = [null, null, null, null, null];
                for(const player of this.table.players) {
                    if(player.seat >= 0 && player.seat < 5) { seats[player.seat] = player; }
                }
                return seats;
            },
            dealerCount() {
                const cards = this.table.game.dealerCards;
                if(cards === undefined || cards === null || cards.length === 0) { return 0; }
                return Math.min(cards.length, 4);
            },
            tableStatus() {
                if(this.table.players.length >= 5) { return { key: 'full', label: 'Full' }; }
                if(this.table.players.length === 0) { return { key: 'open', label: 'Open' }; }
                if(this.table.game.state === 'running') { return { key: 'playing', label: 'In play' }; }
                return { key: 'betting', label: 'Betting' };
            }
        }
    }
</script>

<style scoped>
    a.blackjack-tables-element {
        width: calc(20% - 12px);
        position: relative;
        display: flex;
        flex-direction: column;
        margin: 0 15px 15px 0;
        padding: 8px;
        border-radius: 18px;
        background: #1a2c38;
        box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.05);
        animation: table-in .7s cubic-bezier(.32, .72, 0, 1) both;
        animation-delay: calc(var(--i) * 40ms);
        transition: transform .5s cubic-bezier(.32, .72, 0, 1), box-shadow .5s ease, background .3s ease;
    }

    a.blackjack-tables-element:nth-child(5n) { margin-right: 0; }

    a.blackjack-tables-element:hover {
        transform: translateY(-4px);
        background: #1e3240;
        box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.08), 0 20px 40px -20px rgba(0, 0, 0, 0.8);
    }

    a.blackjack-tables-element:active { transform: translateY(-2px) scale(.985); }

    .blackjack-tables-element .element-stage {
        position: relative;
        padding: 36px 8px 6px 8px;
        border-radius: 12px;
        background: radial-gradient(80% 90% at 50% 10%, rgba(255, 255, 255, 0.04) 0%, transparent 70%), #0f212e;
        overflow: hidden;
    }

    .blackjack-tables-element .stage-table {
        width: 100%;
        display: block;
        filter: drop-shadow(0 10px 14px rgba(0, 0, 0, 0.45));
        transition: transform .6s cubic-bezier(.32, .72, 0, 1), filter .6s ease;
    }

    a.blackjack-tables-element:hover .stage-table {
        transform: scale(1.03);
        filter: drop-shadow(0 14px 18px rgba(0, 0, 0, 0.5)) brightness(1.08);
    }

    .blackjack-tables-element .stage-seats {
        position: absolute;
        inset: 36px 8px 6px 8px;
        pointer-events: none;
    }

    .blackjack-tables-element .seat {
        width: 17%;
        max-width: 26px;
        aspect-ratio: 1 / 1;
        position: absolute;
        transform: translate(-50%, -50%);
        border-radius: 50%;
        border: 1.5px dashed rgba(255, 255, 255, 0.28);
        background: rgba(0, 0, 0, 0.15);
        transition: border-color .3s ease, transform .5s cubic-bezier(.32, .72, 0, 1);
    }

    .blackjack-tables-element .seat.seat-taken {
        border: 2px solid #ffffff;
        background: #0f212e;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.45);
        overflow: hidden;
        animation: seat-in .6s cubic-bezier(.32, .72, 0, 1) both;
    }

    .blackjack-tables-element .seat >>> img,
    .blackjack-tables-element .seat >>> svg,
    .blackjack-tables-element .seat >>> .avatar-image {
        width: 100%;
        height: 100%;
        display: block;
        border-radius: 50%;
        object-fit: cover;
    }

    a.blackjack-tables-element:hover .seat:not(.seat-taken) {
        border-color: rgba(255, 255, 255, 0.55);
    }

    .blackjack-tables-element .stage-status {
        position: absolute;
        top: 10px;
        left: 10px;
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 4px 9px 4px 8px;
        border-radius: 999px;
        background: rgba(15, 33, 46, 0.72);
        -webkit-backdrop-filter: blur(10px);
        backdrop-filter: blur(10px);
        font-size: 11px;
        font-weight: 600;
        color: #ffffff;
    }

    .blackjack-tables-element .status-dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: #7f92a5;
    }

    .blackjack-tables-element.status-playing .status-dot { background: #22d36b; animation: dot-pulse 1.6s ease-in-out infinite; }
    .blackjack-tables-element.status-betting .status-dot { background: #f5b70a; }
    .blackjack-tables-element.status-full .status-dot { background: #ff4d6d; }

    .blackjack-tables-element .element-info {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 6px 4px 6px;
    }

    .blackjack-tables-element .info-main {
        display: flex;
        flex-direction: column;
        gap: 3px;
        min-width: 0;
    }

    .blackjack-tables-element .info-name {
        font-size: 15px;
        font-weight: 600;
        letter-spacing: -0.01em;
        color: #ffffff;
    }

    .blackjack-tables-element .info-limits {
        display: flex;
        align-items: center;
        gap: 5px;
        font-size: 12px;
        font-weight: 500;
        font-variant-numeric: tabular-nums;
        color: #7f92a5;
    }

    .blackjack-tables-element .info-limits img { width: 12px; height: 12px; }

    .blackjack-tables-element .info-seats {
        position: relative;
        height: 28px;
        display: flex;
        align-items: center;
    }

    .blackjack-tables-element .seats-count,
    .blackjack-tables-element .seats-cta {
        display: flex;
        align-items: center;
        height: 28px;
        padding: 0 10px;
        border-radius: 999px;
        font-size: 12px;
        font-weight: 700;
        transition: opacity .3s ease, transform .5s cubic-bezier(.32, .72, 0, 1);
    }

    .blackjack-tables-element .seats-count {
        background: #0f212e;
        font-variant-numeric: tabular-nums;
        color: #b1bad3;
    }

    .blackjack-tables-element .seats-cta {
        position: absolute;
        right: 0;
        gap: 2px;
        padding-right: 7px;
        background: #ffffff;
        color: #0f212e;
        opacity: 0;
        transform: translateX(6px);
    }

    .blackjack-tables-element .seats-cta svg {
        width: 12px;
        height: 12px;
        fill: none;
        stroke: currentColor;
        stroke-width: 2.2;
        stroke-linecap: round;
        stroke-linejoin: round;
    }

    a.blackjack-tables-element:hover .seats-count { opacity: 0; transform: translateX(-6px); }
    a.blackjack-tables-element:hover .seats-cta { opacity: 1; transform: none; }

    @keyframes table-in {
        from { opacity: 0; transform: translateY(12px) scale(.98); }
        to { opacity: 1; transform: none; }
    }

    @keyframes seat-in {
        from { transform: translate(-50%, -50%) scale(.4); opacity: 0; }
        to { transform: translate(-50%, -50%) scale(1); opacity: 1; }
    }

    @keyframes dot-pulse {
        0%, 100% { box-shadow: 0 0 0 0 rgba(34, 211, 107, 0.6); }
        50% { box-shadow: 0 0 0 4px rgba(34, 211, 107, 0); }
    }

    @media only screen and (max-width: 1300px) {
        a.blackjack-tables-element { width: calc(25% - 12px); }
        a.blackjack-tables-element:nth-child(5n) { margin-right: 15px; }
        a.blackjack-tables-element:nth-child(4n) { margin-right: 0; }
    }

    @media only screen and (max-width: 800px) {
        a.blackjack-tables-element { width: calc(50% - 8px); }
        a.blackjack-tables-element:nth-child(n) { margin-right: 15px; }
        a.blackjack-tables-element:nth-child(2n) { margin-right: 0; }
    }

    @media (prefers-reduced-motion: reduce) {
        a.blackjack-tables-element, .blackjack-tables-element .seat.seat-taken { animation: none; }
    }
</style>
