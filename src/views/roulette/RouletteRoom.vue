<template>
    <OriginalsShell class="roulette-room">
        <template v-slot:panel>
            <OriginalsPanel amount-label="Chip Value" v-bind:show-profit="false" v-bind:label="roomButtonLabel"
                v-bind:busy="socketSendLoading === 'RouletteBet'" v-bind:disabled="roomCanBet === false || roomPendingTotal === 0"
                v-on:amount="roomChip = $event" v-on:bet="roomSend">
                <div class="panel-option">
                    <div class="option-row">
                        <span>On the table</span>
                        <span class="row-value">{{ roomFormat(roomPlacedTotal) }}</span>
                    </div>
                    <div class="option-row">
                        <span>To place</span>
                        <span class="row-value">{{ roomFormat(roomPendingTotal) }}</span>
                    </div>
                    <div class="option-actions">
                        <button v-on:click="roomUndo()" v-bind:disabled="roomStack.length === 0">
                            <UiIcon name="undo" />
                            Undo
                        </button>
                        <button v-on:click="roomClear()" v-bind:disabled="roomStack.length === 0">
                            <UiIcon name="trash" />
                            Clear
                        </button>
                    </div>
                    <button v-on:click="roomRebet()" class="option-rebet" v-bind:disabled="roomCanBet === false || Object.keys(roomPrevious).length === 0">
                        Rebet last spin
                    </button>
                </div>
            </OriginalsPanel>
        </template>

        <div class="room-stage" v-bind:class="{ 'stage-won': roomMyResult !== null && roomMyResult.payout > 0 }">
            <div class="stage-header">
                <router-link to="/roulette" class="header-back">
                    <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M10 3 5 8l5 5" /></svg>
                    Tables
                </router-link>
                <div class="header-name">{{ roomName }}</div>
                <div class="header-history">
                    <span v-for="(number, n) in roomHistory" v-bind:key="n" class="history-number" v-bind:class="'number-' + roomColor(number)">{{ number }}</span>
                </div>
            </div>

            <div class="stage-timer" v-bind:class="'timer-' + roomPhase.key">
                <div class="timer-bar" v-bind:style="{ transform: 'scaleX(' + roomPhase.progress + ')' }"></div>
                <span class="timer-label">{{ roomPhase.label }}</span>
            </div>

            <div class="stage-middle">
                <div class="middle-wheel">
                    <RouletteWheel ref="wheel" />
                </div>

                <div class="middle-result">
                    <transition name="result" mode="out-in">
                        <div v-if="roomShownResult !== null" v-bind:key="'r' + roomShownGame" class="result-card">
                            <div class="card-number" v-bind:class="'number-' + roomColor(roomShownResult)">{{ roomShownResult }}</div>
                            <div v-if="roomMyResult !== null && roomMyResult.payout > 0" class="card-text text-won">Won {{ roomFormat(roomMyResult.payout) }}</div>
                            <div v-else-if="roomMyResult !== null" class="card-text">No win</div>
                        </div>
                        <div v-else key="idle" class="result-idle">{{ roomPhase.key === 'betting' ? 'Place your chips' : 'Good luck' }}</div>
                    </transition>
                </div>

                <div class="middle-players">
                    <div class="players-title">
                        <span>Players</span>
                        <span>{{ roomPlayers.length }}</span>
                    </div>
                    <div class="players-list">
                        <transition-group name="player" tag="div">
                            <div v-for="player in roomPlayers" v-bind:key="player.id" class="player-row" v-bind:class="{ 'row-me': player.me, 'row-won': player.payout !== null && player.payout > player.amount }">
                                <AvatarImage v-bind:image="player.user !== null ? player.user.avatar : null" />
                                <span class="row-name">{{ player.user !== null ? player.user.username : 'Hidden' }}</span>
                                <span class="row-amount">{{ player.payout === null ? roomFormat(player.amount) : (player.payout >= player.amount ? '+' : '-') + roomFormat(Math.abs(player.payout - player.amount)) }}</span>
                            </div>
                        </transition-group>
                        <div v-if="roomPlayers.length === 0" class="players-empty">No bets yet this round</div>
                    </div>
                </div>
            </div>

            <RouletteBoard v-bind:chips="roomChips" v-bind:pending="roomPendingKeys" v-bind:result="roomShownResult"
                v-bind:locked="roomCanBet === false" v-on:place="roomPlace" />
        </div>
    </OriginalsShell>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';
    import OriginalsShell from '@/components/originals/OriginalsShell';
    import OriginalsPanel from '@/components/originals/OriginalsPanel';
    import RouletteWheel from '@/components/roulette/RouletteWheel';
    import RouletteBoard from '@/components/roulette/RouletteBoard';
    import AvatarImage from '@/components/AvatarImage';
    import UiIcon from '@/components/UiIcon';
    import sfx from '@/utils/sfx';
    import { rouletteColor, roulettePayout, rouletteTableName, rouletteSpotKey, rouletteSpotFromKey } from '@/utils/roulette';

    // Phase lengths, matching the server (ms).
    const PHASES = { created: 18000, spinning: 6000, completed: 4000 };

    export default {
        name: 'RouletteRoom',
        components: {
            OriginalsShell,
            OriginalsPanel,
            RouletteWheel,
            RouletteBoard,
            AvatarImage,
            UiIcon
        },
        data() {
            return {
                roomChip: 0,
                roomPending: {},
                roomStack: [],
                roomPrevious: {},
                roomMine: {},
                roomShownGame: null,
                roomShownResult: null,
                roomSettled: null,
                roomNow: Date.now(),
                roomTimer: null
            }
        },
        methods: {
            ...mapActions([
                'notificationShow',
                'rouletteJoinTable',
                'rouletteLeaveTable',
                'rouletteSendBetSocket'
            ]),
            roomFormat(value) {
                return parseFloat(Math.floor(value / 10) / 100).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            },
            roomColor(number) {
                return rouletteColor(number);
            },
            async roomJoin() {
                const index = Number(this.$route.params.tableId) - 1;
                const joined = Number.isInteger(index) === true ? await this.rouletteJoinTable(index) : false;
                if(joined !== true) { this.$router.push('/roulette'); return; }
                this.roomSync(true);
            },
            // Catches the wheel up with the round when joining or after a reconnect.
            roomSync(joining) {
                const game = this.roomGame;
                if(game === null || this.$refs.wheel === undefined) { return; }

                if(game.state === 'spinning' && this.roomShownGame !== game._id) {
                    this.roomShownGame = game._id;
                    this.roomShownResult = null;
                    this.roomPrevious = { ...this.roomMyPlaced };
                    this.roomPending = {};
                    this.roomStack = [];

                    const duration = Math.min(game.remaining - 400, 5200);
                    if(duration > 1500) {
                        this.$refs.wheel.spin(game.outcome, duration).then(() => { this.roomReveal(game); });
                    } else {
                        this.$refs.wheel.place(game.outcome);
                        this.roomReveal(game);
                    }
                } else if(game.state === 'completed' && this.roomShownGame !== game._id) {
                    this.roomShownGame = game._id;
                    this.$refs.wheel.place(game.outcome);
                    this.roomReveal(game, joining);
                } else if(game.state === 'created' && this.roomShownGame !== null && this.roomShownGame !== game._id) {
                    this.roomShownResult = null;
                }
            },
            roomReveal(game, silent) {
                if(this.roomGame === null || this.roomGame._id !== game._id) { return; }
                this.roomShownResult = game.outcome;

                if(this.roomSettled === game._id || silent === true) { return; }
                this.roomSettled = game._id;

                const mine = this.roomMyBets;
                if(mine.length === 0) { return; }
                const payout = roulettePayout(mine, game.outcome);
                const amount = mine.reduce((total, bet) => total + bet.amount, 0);
                if(payout > 0) { payout >= amount * 10 ? sfx.bigWin() : sfx.win(); }
                else { sfx.lose(); }
            },
            roomPlace(spot) {
                if(this.roomCanBet === false) {
                    this.notificationShow({ type: 'error', message: 'No more bets, wait for the next spin.' });
                    return;
                }
                if(this.roomChip <= 0) {
                    this.notificationShow({ type: 'error', message: 'Set a chip value first.' });
                    return;
                }

                const key = rouletteSpotKey(spot);
                this.$set(this.roomPending, key, (this.roomPending[key] || 0) + this.roomChip);
                this.roomStack.push({ key: key, amount: this.roomChip });
                sfx.chip();
            },
            roomUndo() {
                const last = this.roomStack.pop();
                if(last === undefined) { return; }

                const left = this.roomPending[last.key] - last.amount;
                if(left > 0) { this.$set(this.roomPending, last.key, left); }
                else { this.$delete(this.roomPending, last.key); }
            },
            roomClear() {
                this.roomPending = {};
                this.roomStack = [];
            },
            roomRebet() {
                for(const key of Object.keys(this.roomPrevious)) {
                    this.$set(this.roomPending, key, (this.roomPending[key] || 0) + this.roomPrevious[key]);
                    this.roomStack.push({ key: key, amount: this.roomPrevious[key] });
                }
                sfx.chips(3);
            },
            async roomSend() {
                if(this.roomCanBet === false || this.roomPendingTotal === 0) { return; }

                const bets = Object.keys(this.roomPending).map((key) => ({ ...rouletteSpotFromKey(key), amount: this.roomPending[key] }));
                const bet = await this.rouletteSendBetSocket({ table: this.roomTable.table, bets: bets });
                if(bet === null) { return; }

                this.$set(this.roomMine, bet._id, true);
                this.roomPending = {};
                this.roomStack = [];
                sfx.chips(Math.min(bets.length + 1, 5));
            }
        },
        computed: {
            ...mapGetters([
                'authUser',
                'socketSendLoading',
                'rouletteTable',
                'rouletteTables'
            ]),
            roomTable() {
                return this.rouletteTable;
            },
            roomGame() {
                return this.roomTable !== null ? this.roomTable.game : null;
            },
            roomName() {
                return this.roomTable !== null ? rouletteTableName(this.roomTable) : 'Roulette';
            },
            roomHistory() {
                const summary = this.roomTable !== null ? this.rouletteTables.find((table) => table.table === this.roomTable.table) : undefined;
                const history = summary !== undefined ? summary.history : (this.roomTable !== null ? this.roomTable.history : []);
                // Keep the number being spun out of the strip until the ball lands
                const hide = this.roomGame !== null && this.roomGame.state === 'completed' && this.roomShownResult === null;
                return (hide === true ? history.slice(1) : history).slice(0, 10);
            },
            roomCanBet() {
                return this.roomGame !== null && this.roomGame.state === 'created' && this.roomGame.endsLocal - this.roomNow > 300;
            },
            roomPhase() {
                const game = this.roomGame;
                if(game === null) { return { key: 'idle', label: 'Connecting…', progress: 0 }; }

                const left = Math.max(0, game.endsLocal - this.roomNow);
                const progress = Math.min(1, left / PHASES[game.state]);
                if(game.state === 'created') { return { key: 'betting', label: 'Place your bets · ' + Math.ceil(left / 1000) + 's', progress: progress }; }
                if(game.state === 'spinning') { return { key: 'spinning', label: 'No more bets', progress: progress }; }
                return { key: 'result', label: 'Next spin in ' + Math.ceil(left / 1000) + 's', progress: progress };
            },
            roomMyBets() {
                if(this.roomTable === null) { return []; }
                const id = this.authUser.user !== null ? this.authUser.user._id : null;
                return this.roomTable.bets
                    .filter((bet) => this.roomMine[bet._id] === true || (id !== null && bet.user !== null && bet.user._id === id))
                    .reduce((all, bet) => all.concat(bet.bets), []);
            },
            roomMyPlaced() {
                let placed = {};
                for(const bet of this.roomMyBets) {
                    const key = rouletteSpotKey(bet);
                    placed[key] = (placed[key] || 0) + bet.amount;
                }
                return placed;
            },
            roomPlacedTotal() {
                return Object.values(this.roomMyPlaced).reduce((total, amount) => total + amount, 0);
            },
            roomPendingTotal() {
                return Object.values(this.roomPending).reduce((total, amount) => total + amount, 0);
            },
            roomPendingKeys() {
                let keys = {};
                for(const key of Object.keys(this.roomPending)) { keys[key] = true; }
                return keys;
            },
            roomChips() {
                let chips = { ...this.roomMyPlaced };
                for(const key of Object.keys(this.roomPending)) { chips[key] = (chips[key] || 0) + this.roomPending[key]; }
                return chips;
            },
            roomButtonLabel() {
                if(this.roomGame !== null && this.roomGame.state !== 'created') { return 'Bets closed'; }
                return this.roomPendingTotal > 0 ? 'Place Bet · ' + this.roomFormat(this.roomPendingTotal) : 'Place Bet';
            },
            roomMyResult() {
                if(this.roomShownResult === null || this.roomMyBets.length === 0) { return null; }
                return { payout: roulettePayout(this.roomMyBets, this.roomShownResult) };
            },
            roomPlayers() {
                if(this.roomTable === null) { return []; }

                const id = this.authUser.user !== null ? this.authUser.user._id : null;
                let players = {};
                for(const bet of this.roomTable.bets) {
                    const key = bet.user !== null ? bet.user._id : 'hidden-' + bet._id;
                    if(players[key] === undefined) {
                        players[key] = { id: key, user: bet.user, amount: 0, bets: [], me: this.roomMine[bet._id] === true || (bet.user !== null && bet.user._id === id) };
                    }
                    players[key].amount += bet.amount;
                    players[key].bets = players[key].bets.concat(bet.bets);
                }

                return Object.values(players)
                    .map((player) => ({ ...player, payout: this.roomShownResult !== null ? roulettePayout(player.bets, this.roomShownResult) : null }))
                    .sort((a, b) => (b.me - a.me) || (b.amount - a.amount));
            }
        },
        watch: {
            roomGame(game) {
                if(game !== null) { this.$nextTick(() => this.roomSync(false)); }
            },
            '$route.params.tableId'() {
                this.roomShownGame = null;
                this.roomShownResult = null;
                this.roomPending = {};
                this.roomStack = [];
                this.roomPrevious = {};
                this.roomJoin();
            }
        },
        created() {
            this.roomTimer = setInterval(() => { this.roomNow = Date.now(); }, 200);
        },
        mounted() {
            this.roomJoin();
        },
        beforeDestroy() {
            clearInterval(this.roomTimer);
            this.rouletteLeaveTable();
        }
    }
</script>

<style scoped>
    .roulette-room .option-row {
        display: flex;
        justify-content: space-between;
        padding: 4px 0;
        font-size: 13px;
        font-weight: 600;
        color: #b1bad3;
    }

    .roulette-room .row-value {
        color: #ffffff;
        font-variant-numeric: tabular-nums;
    }

    .roulette-room .option-actions {
        display: flex;
        gap: 8px;
        margin-top: 8px;
    }

    .roulette-room .option-actions button,
    .roulette-room button.option-rebet {
        flex: 1;
        height: 36px;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 6px;
        border-radius: 6px;
        background: #2f4553;
        font-size: 13px;
        font-weight: 600;
        color: #ffffff;
        transition: background .2s ease, opacity .2s ease;
    }

    .roulette-room button.option-rebet {
        width: 100%;
        margin-top: 8px;
    }

    .roulette-room .option-actions button:hover:not(:disabled),
    .roulette-room button.option-rebet:hover:not(:disabled) {
        background: #3d5564;
    }

    .roulette-room .option-actions button:disabled,
    .roulette-room button.option-rebet:disabled {
        opacity: .45;
        cursor: not-allowed;
    }

    .roulette-room .option-actions .ui-icon {
        width: 14px;
        height: 14px;
    }

    .room-stage {
        position: relative;
        min-height: 600px;
        display: flex;
        flex-direction: column;
        gap: 18px;
        padding: 18px 24px 24px 24px;
        background: radial-gradient(70% 55% at 35% 40%, rgba(255, 255, 255, 0.04), transparent 70%);
        transition: background .6s ease;
    }

    .room-stage.stage-won {
        background: radial-gradient(70% 55% at 35% 40%, rgba(0, 231, 1, 0.1), transparent 70%);
    }

    .room-stage .stage-header {
        display: flex;
        align-items: center;
        gap: 14px;
    }

    .room-stage .header-back {
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 6px 10px 6px 6px;
        border-radius: 6px;
        background: #213743;
        font-size: 13px;
        font-weight: 600;
        color: #b1bad3;
        transition: color .2s ease, background .2s ease;
    }

    .room-stage .header-back:hover {
        color: #ffffff;
        background: #2f4553;
    }

    .room-stage .header-back svg {
        width: 14px;
        height: 14px;
        fill: none;
        stroke: currentColor;
        stroke-width: 2;
    }

    .room-stage .header-name {
        font-size: 16px;
        font-weight: 700;
        color: #ffffff;
        white-space: nowrap;
    }

    .room-stage .header-history {
        flex: 1;
        min-width: 0;
        display: flex;
        justify-content: flex-end;
        gap: 5px;
        overflow: hidden;
    }

    .room-stage .history-number {
        min-width: 28px;
        height: 28px;
        flex: none;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 6px;
        font-size: 12px;
        font-weight: 700;
        color: #ffffff;
    }

    .room-stage .number-red { background: #d0233a; }
    .room-stage .number-black { background: #2f4553; }
    .room-stage .number-green { background: #0f9d58; }

    .room-stage .stage-timer {
        position: relative;
        height: 32px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 8px;
        background: #213743;
        overflow: hidden;
    }

    .room-stage .timer-bar {
        position: absolute;
        inset: 0;
        transform-origin: left center;
        background: rgba(0, 231, 1, 0.22);
        transition: transform .2s linear;
    }

    .room-stage .timer-spinning .timer-bar { background: rgba(255, 190, 11, 0.2); }
    .room-stage .timer-result .timer-bar { background: rgba(255, 255, 255, 0.06); }

    .room-stage .timer-label {
        position: relative;
        font-size: 13px;
        font-weight: 700;
        color: #ffffff;
        font-variant-numeric: tabular-nums;
    }

    .room-stage .stage-middle {
        display: grid;
        grid-template-columns: 250px 130px minmax(0, 1fr);
        align-items: center;
        gap: 24px;
    }

    .room-stage .middle-result {
        display: flex;
        justify-content: center;
    }

    .room-stage .result-card {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
    }

    .room-stage .card-number {
        width: 80px;
        height: 80px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 14px;
        font-size: 34px;
        font-weight: 800;
        color: #ffffff;
        box-shadow: 0 10px 24px -8px rgba(0, 0, 0, 0.6), inset 0 0 0 2px rgba(255, 255, 255, 0.15);
    }

    .room-stage .card-text {
        font-size: 15px;
        font-weight: 700;
        color: #b1bad3;
        font-variant-numeric: tabular-nums;
    }

    .room-stage .card-text.text-won { color: #00e701; }

    .room-stage .result-idle {
        font-size: 14px;
        font-weight: 600;
        color: #557086;
        text-align: center;
    }

    .room-stage .result-enter-active,
    .room-stage .result-leave-active {
        transition: opacity .25s ease, transform .45s cubic-bezier(.34, 1.56, .64, 1);
    }

    .room-stage .result-enter { opacity: 0; transform: scale(.7); }
    .room-stage .result-leave-to { opacity: 0; }

    .room-stage .middle-players {
        height: 250px;
        display: flex;
        flex-direction: column;
        border-radius: 10px;
        background: #213743;
        overflow: hidden;
    }

    .room-stage .players-title {
        display: flex;
        justify-content: space-between;
        padding: 10px 14px;
        font-size: 13px;
        font-weight: 700;
        color: #b1bad3;
        box-shadow: inset 0 -1px 0 rgba(255, 255, 255, 0.05);
    }

    .room-stage .players-list {
        flex: 1;
        overflow-y: auto;
        padding: 6px;
    }

    .room-stage .player-row {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 6px 8px;
        border-radius: 6px;
        font-size: 13px;
        font-weight: 600;
    }

    .room-stage .player-row.row-me {
        background: rgba(255, 255, 255, 0.05);
    }

    .room-stage .player-row >>> .avatar-image {
        width: 22px;
        height: 22px;
        flex: none;
        border-radius: 50%;
        overflow: hidden;
    }

    .room-stage .row-name {
        flex: 1;
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: #ffffff;
    }

    .room-stage .row-amount {
        font-variant-numeric: tabular-nums;
        color: #b1bad3;
    }

    .room-stage .row-won .row-amount { color: #00e701; }

    .room-stage .players-empty {
        padding: 18px 8px;
        text-align: center;
        font-size: 13px;
        color: #557086;
    }

    .room-stage .player-enter-active { transition: opacity .3s ease, transform .4s cubic-bezier(.32, .72, 0, 1); }
    .room-stage .player-enter { opacity: 0; transform: translateX(-8px); }
    .room-stage .player-move { transition: transform .4s cubic-bezier(.32, .72, 0, 1); }

    @media only screen and (max-width: 1100px) {
        .room-stage .stage-middle {
            grid-template-columns: 220px minmax(0, 1fr);
        }

        .room-stage .middle-players {
            grid-column: 1 / -1;
            height: 180px;
        }
    }

    @media only screen and (max-width: 850px) {
        .room-stage {
            min-height: 0;
            padding: 14px;
        }

        .room-stage .stage-middle {
            grid-template-columns: 180px minmax(0, 1fr);
            gap: 14px;
        }

        .room-stage .middle-players {
            height: 128px;
        }

        .room-stage .header-history .history-number:nth-child(n + 6) {
            display: none;
        }
    }
</style>
