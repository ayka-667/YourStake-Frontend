<template>
    <router-link v-bind:to="'/roulette/table/' + (table.table + 1)" class="roulette-table-card" v-bind:class="'card-' + table.type" v-bind:style="{ '--i': index }">
        <div class="card-top">
            <GameArt class="top-art" game="roulette" />
            <div class="top-info">
                <div class="info-name">{{ name }}</div>
                <div class="info-limits">
                    <img src="@/assets/img/icons/coin.svg" alt="" />
                    {{ limitsLabel }}
                </div>
                <div class="info-status" v-bind:class="'status-' + status.key">
                    <span class="status-dot"></span>
                    {{ status.label }}
                </div>
            </div>
        </div>

        <div class="card-history">
            <span v-for="(number, n) in table.history.slice(0, 8)" v-bind:key="n" class="history-number" v-bind:class="'number-' + color(number)">{{ number }}</span>
            <span v-if="table.history.length === 0" class="history-empty">No spins yet</span>
        </div>

        <div class="card-bottom">
            <div class="bottom-players">
                <AvatarImage v-for="player in table.players.slice(0, 4)" v-bind:key="player.user !== null ? player.user._id : Math.random()"
                    v-bind:image="player.user !== null ? player.user.avatar : null" />
                <span class="players-count">{{ table.players.length }} {{ table.players.length === 1 ? 'player' : 'players' }}</span>
            </div>
            <span class="bottom-cta">
                Join
                <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M6 3l5 5-5 5" /></svg>
            </span>
        </div>
    </router-link>
</template>

<script>
    import AvatarImage from '@/components/AvatarImage';
    import GameArt from '@/components/home/GameArt';
    import { rouletteColor, rouletteTableName } from '@/utils/roulette';

    export default {
        name: 'RouletteTableCard',
        components: {
            AvatarImage,
            GameArt
        },
        props: ['table', 'index', 'limits', 'now'],
        methods: {
            color(number) {
                return rouletteColor(number);
            },
            format(value) {
                return value >= 1000 ? (value / 1000) + 'K' : value.toFixed(2).replace(/\.00$/, '');
            }
        },
        computed: {
            name() {
                return rouletteTableName(this.table);
            },
            limitsLabel() {
                if(this.limits === null || this.limits === undefined) { return ''; }
                const limits = this.limits[this.table.type];
                return this.format(limits.min) + ' – ' + this.format(limits.max);
            },
            status() {
                const game = this.table.game;
                if(game === null) { return { key: 'idle', label: 'Starting' }; }
                if(game.state === 'created') {
                    const seconds = Math.max(0, Math.ceil((game.endsLocal - this.now) / 1000));
                    return { key: 'betting', label: 'Betting · ' + seconds + 's' };
                }
                if(game.state === 'spinning') { return { key: 'spinning', label: 'Spinning' }; }
                return { key: 'result', label: 'Result · ' + game.outcome };
            }
        }
    }
</script>

<style scoped>
    a.roulette-table-card {
        display: flex;
        flex-direction: column;
        gap: 14px;
        padding: 16px;
        border-radius: 12px;
        background: #213743;
        box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.04);
        transition: background .2s ease, transform .3s cubic-bezier(.32, .72, 0, 1);
        animation: card-in .5s cubic-bezier(.32, .72, 0, 1) both;
        animation-delay: calc(var(--i, 0) * 40ms);
    }

    a.roulette-table-card:hover {
        background: #263f4d;
        transform: translateY(-2px);
    }

    a.roulette-table-card.card-whale {
        background: linear-gradient(140deg, rgba(255, 190, 11, 0.1) 0%, rgba(255, 190, 11, 0) 55%), #213743;
    }

    .roulette-table-card .card-top {
        display: flex;
        align-items: center;
        gap: 14px;
    }

    .roulette-table-card .top-art {
        width: 74px;
        height: 74px;
        flex: none;
    }

    .roulette-table-card .top-info {
        display: flex;
        flex-direction: column;
        gap: 4px;
        min-width: 0;
    }

    .roulette-table-card .info-name {
        font-size: 16px;
        font-weight: 700;
        color: #ffffff;
    }

    .roulette-table-card .info-limits {
        display: flex;
        align-items: center;
        gap: 5px;
        font-size: 12px;
        font-weight: 600;
        color: #b1bad3;
    }

    .roulette-table-card .info-limits img {
        width: 13px;
        height: 13px;
    }

    .roulette-table-card .info-status {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        margin-top: 2px;
        font-size: 12px;
        font-weight: 700;
        color: #b1bad3;
        font-variant-numeric: tabular-nums;
    }

    .roulette-table-card .status-dot {
        width: 7px;
        height: 7px;
        border-radius: 50%;
        background: #557086;
    }

    .roulette-table-card .status-betting { color: #00e701; }
    .roulette-table-card .status-betting .status-dot { background: #00e701; box-shadow: 0 0 8px #00e701; }
    .roulette-table-card .status-spinning { color: #ffbe0b; }
    .roulette-table-card .status-spinning .status-dot { background: #ffbe0b; }

    .roulette-table-card .card-history {
        height: 24px;
        display: flex;
        gap: 4px;
        overflow: hidden;
    }

    .roulette-table-card .history-number {
        min-width: 24px;
        height: 24px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 5px;
        font-size: 11px;
        font-weight: 700;
        color: #ffffff;
    }

    .roulette-table-card .number-red { background: #d0233a; }
    .roulette-table-card .number-black { background: #2f4553; }
    .roulette-table-card .number-green { background: #0f9d58; }

    .roulette-table-card .history-empty {
        font-size: 12px;
        color: #557086;
        line-height: 24px;
    }

    .roulette-table-card .card-bottom {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .roulette-table-card .bottom-players {
        display: flex;
        align-items: center;
    }

    .roulette-table-card .bottom-players >>> .avatar-image {
        width: 24px;
        height: 24px;
        margin-right: -6px;
        border-radius: 50%;
        box-shadow: 0 0 0 2px #213743;
    }

    .roulette-table-card .players-count {
        margin-left: 14px;
        font-size: 12px;
        font-weight: 600;
        color: #b1bad3;
    }

    .roulette-table-card .bottom-cta {
        display: flex;
        align-items: center;
        gap: 2px;
        font-size: 13px;
        font-weight: 700;
        color: #00e701;
    }

    .roulette-table-card .bottom-cta svg {
        width: 14px;
        height: 14px;
        fill: none;
        stroke: currentColor;
        stroke-width: 2;
    }

    @keyframes card-in {
        from { opacity: 0; transform: translateY(8px); }
    }
</style>
