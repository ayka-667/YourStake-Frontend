<template>
    <div class="roulette-lobby">
        <div class="lobby-header">
            <div class="header-title">
                <UiIcon name="roulette" />
                <h1>Live Roulette</h1>
                <span class="title-live"><span class="live-dot"></span>{{ lobbyPlayers }} playing</span>
            </div>
            <p class="header-text">European wheel, single zero. Every table spins on its own, so pick one and place your chips before the timer runs out.</p>
        </div>

        <div v-for="section in lobbySections" v-bind:key="section.type" class="lobby-section">
            <div class="section-title">
                <span>{{ section.title }}</span>
                <span v-if="rouletteLimits !== null" class="title-limits">
                    <img src="@/assets/img/icons/coin.svg" alt="" />
                    {{ lobbyFormat(rouletteLimits[section.type].min) }} – {{ lobbyFormat(rouletteLimits[section.type].max) }} per spin
                </span>
            </div>
            <div v-if="section.tables.length === 0" class="section-list">
                <div v-for="n in (section.type === 'whale' ? 3 : 6)" v-bind:key="n" class="list-placeholder"></div>
            </div>
            <div v-else class="section-list">
                <RouletteTableCard v-for="(table, index) in section.tables" v-bind:key="table.table"
                    v-bind:table="table" v-bind:index="index" v-bind:limits="rouletteLimits" v-bind:now="lobbyNow" />
            </div>
        </div>

        <Bets />
    </div>
</template>

<script>
    import { mapGetters } from 'vuex';
    import Bets from '@/components/bets/Bets';
    import UiIcon from '@/components/UiIcon';
    import RouletteTableCard from '@/components/roulette/RouletteTableCard';

    export default {
        name: 'RouletteLobby',
        components: {
            Bets,
            UiIcon,
            RouletteTableCard
        },
        data() {
            return {
                lobbyNow: Date.now(),
                lobbyTimer: null
            }
        },
        methods: {
            lobbyFormat(value) {
                return value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            }
        },
        computed: {
            ...mapGetters([
                'rouletteTables',
                'rouletteLimits'
            ]),
            lobbySections() {
                return [
                    { type: 'standard', title: 'Standard Tables', tables: this.rouletteTables.filter((table) => table.type === 'standard') },
                    { type: 'whale', title: 'High Roller Tables', tables: this.rouletteTables.filter((table) => table.type === 'whale') }
                ];
            },
            lobbyPlayers() {
                return this.rouletteTables.reduce((total, table) => total + table.players.length, 0);
            }
        },
        created() {
            this.lobbyTimer = setInterval(() => { this.lobbyNow = Date.now(); }, 500);
        },
        beforeDestroy() {
            clearInterval(this.lobbyTimer);
        }
    }
</script>

<style scoped>
    .roulette-lobby {
        width: 100%;
        max-width: 1200px;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        gap: 32px;
        padding: 40px 10px;
    }

    .roulette-lobby .header-title {
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .roulette-lobby .header-title .ui-icon {
        width: 26px;
        height: 26px;
        color: #00e701;
    }

    .roulette-lobby h1 {
        margin: 0;
        font-size: 26px;
        font-weight: 800;
        color: #ffffff;
    }

    .roulette-lobby .title-live {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        margin-left: 6px;
        padding: 4px 10px;
        border-radius: 999px;
        background: rgba(0, 231, 1, 0.1);
        font-size: 12px;
        font-weight: 700;
        color: #00e701;
    }

    .roulette-lobby .live-dot {
        width: 7px;
        height: 7px;
        border-radius: 50%;
        background: #00e701;
        box-shadow: 0 0 8px #00e701;
    }

    .roulette-lobby .header-text {
        max-width: 620px;
        margin: 8px 0 0 0;
        font-size: 14px;
        line-height: 1.5;
        color: #b1bad3;
    }

    .roulette-lobby .section-title {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 12px;
        margin-bottom: 14px;
        font-size: 18px;
        font-weight: 700;
        color: #ffffff;
    }

    .roulette-lobby .title-limits {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        font-size: 13px;
        font-weight: 600;
        color: #b1bad3;
    }

    .roulette-lobby .title-limits img {
        width: 14px;
        height: 14px;
    }

    .roulette-lobby .section-list {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 14px;
    }

    .roulette-lobby .list-placeholder {
        height: 196px;
        border-radius: 12px;
        background: #213743;
        animation: placeholder-pulse 1.4s ease-in-out infinite;
    }

    .roulette-lobby >>> .bets {
        margin-top: 0;
    }

    @keyframes placeholder-pulse {
        50% { opacity: .55; }
    }

    @media only screen and (max-width: 950px) {
        .roulette-lobby .section-list {
            grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .roulette-lobby >>> .bets {
            position: static;
        }
    }

    @media only screen and (max-width: 600px) {
        .roulette-lobby {
            padding: 24px 10px;
        }

        .roulette-lobby .section-list {
            grid-template-columns: minmax(0, 1fr);
        }
    }
</style>
