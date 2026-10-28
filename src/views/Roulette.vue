<template>
    <OriginalsShell class="roulette">
        <template v-slot:panel>
            <OriginalsPanel amount-label="Chip Value" v-bind:show-profit="false" v-bind:busy="rouletteSending"
                v-bind:disabled="rouletteSending || rouletteSpinning" v-on:amount="rouletteChip = $event" v-on:bet="rouletteBet">
                <div class="panel-option">
                    <div class="option-label">
                        <span>Total Bet</span>
                    </div>
                    <div class="option-total">
                        <span>{{ rouletteFormat(rouletteTotal) }}</span>
                        <img src="@/assets/img/icons/coin.svg" alt="" />
                    </div>
                    <div class="option-actions">
                        <button v-on:click="rouletteUndo()" v-bind:disabled="rouletteSpinning || rouletteStack.length === 0">
                            <UiIcon name="undo" />
                            Undo
                        </button>
                        <button v-on:click="rouletteClear()" v-bind:disabled="rouletteSpinning || rouletteStack.length === 0">
                            <UiIcon name="trash" />
                            Clear
                        </button>
                    </div>
                </div>
            </OriginalsPanel>
        </template>

        <div class="roulette-stage" v-bind:class="{ 'stage-won': rouletteOutcome === 'won' }">
            <transition-group name="history" tag="div" class="roulette-history">
                <span v-for="item in rouletteHistory" v-bind:key="item.id" class="history-item" v-bind:class="'item-' + rouletteColor(item.number)">
                    {{ item.number }}
                </span>
            </transition-group>

            <div class="stage-top">
                <div class="top-wheel">
                    <RouletteWheel ref="wheel" />
                </div>
                <div class="top-result">
                    <transition name="result" mode="out-in">
                        <div v-if="rouletteResult !== null && rouletteSpinning === false" v-bind:key="'r' + rouletteSpins" class="result-card">
                            <div class="card-number" v-bind:class="'number-' + rouletteColor(rouletteResult)">{{ rouletteResult }}</div>
                            <div v-if="rouletteOutcome === 'won'" class="card-text text-won">+{{ rouletteFormat(rouletteLastPayout) }}</div>
                            <div v-else class="card-text">No win</div>
                        </div>
                        <div v-else key="idle" class="result-idle">
                            {{ rouletteSpinning ? 'No more bets' : 'Place your chips' }}
                        </div>
                    </transition>
                </div>
            </div>

            <RouletteTable v-bind:chips="rouletteChips" v-bind:result="rouletteSpinning ? null : rouletteResult"
                v-bind:locked="rouletteSpinning || rouletteSending" v-on:place="roulettePlace" />
        </div>
    </OriginalsShell>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';
    import OriginalsShell from '@/components/originals/OriginalsShell';
    import OriginalsPanel from '@/components/originals/OriginalsPanel';
    import RouletteWheel from '@/components/originals/RouletteWheel';
    import RouletteTable from '@/components/originals/RouletteTable';
    import UiIcon from '@/components/UiIcon';
    import sfx from '@/utils/sfx';

    const RED = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];

    export default {
        name: 'Roulette',
        metaInfo: {
            title: 'Roulette - YourStake.fr'
        },
        components: {
            OriginalsShell,
            OriginalsPanel,
            RouletteWheel,
            RouletteTable,
            UiIcon
        },
        data() {
            return {
                rouletteChip: 0,
                rouletteChips: {},
                rouletteStack: [],
                rouletteSending: false,
                rouletteSpinning: false,
                rouletteResult: null,
                rouletteOutcome: null,
                rouletteLastPayout: 0,
                rouletteSpins: 0,
                rouletteHistory: []
            }
        },
        methods: {
            ...mapActions([
                'notificationShow',
                'socketConnectOriginals',
                'socketDisconnectOriginals',
                'originalsSendBetSocket',
                'originalsSettle',
                'originalsFlush'
            ]),
            rouletteFormat(value) {
                return parseFloat(Math.floor(value / 10) / 100).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            },
            rouletteColor(number) {
                if(number === 0) { return 'green'; }
                return RED.includes(number) === true ? 'red' : 'black';
            },
            roulettePlace(spot) {
                if(this.rouletteChip <= 0) {
                    this.notificationShow({ type: 'error', message: 'Set a chip value first.' });
                    return;
                }

                const key = spot.type + ':' + spot.value;
                this.$set(this.rouletteChips, key, (this.rouletteChips[key] || 0) + this.rouletteChip);
                this.rouletteStack.push({ key: key, amount: this.rouletteChip });
                this.rouletteOutcome = null;
                sfx.chip();
            },
            rouletteUndo() {
                const last = this.rouletteStack.pop();
                if(last === undefined) { return; }

                const left = this.rouletteChips[last.key] - last.amount;
                if(left > 0) { this.$set(this.rouletteChips, last.key, left); }
                else { this.$delete(this.rouletteChips, last.key); }
            },
            rouletteClear() {
                this.rouletteChips = {};
                this.rouletteStack = [];
            },
            async rouletteBet() {
                if(this.rouletteSending === true || this.rouletteSpinning === true) { return; }

                if(this.rouletteTotal <= 0) {
                    this.notificationShow({ type: 'error', message: 'Place at least one chip on the table.' });
                    return;
                }

                const bets = Object.keys(this.rouletteChips).map((key) => {
                    const [type, raw] = key.split(':');
                    const value = ['number', 'dozen', 'column'].includes(type) === true ? Number(raw) : raw;
                    return { type: type, value: value, amount: this.rouletteChips[key] };
                });

                this.rouletteSending = true;
                const game = await this.originalsSendBetSocket({ game: 'roulette', amount: this.rouletteTotal, bets: bets });
                this.rouletteSending = false;
                if(game === null) { return; }

                const number = game.outcome.number;
                this.rouletteSpinning = true;
                this.rouletteOutcome = null;
                sfx.chips(Math.min(bets.length + 1, 5));

                await this.$refs.wheel.spin(number);

                this.rouletteSpinning = false;
                this.rouletteSpins += 1;
                this.rouletteResult = number;
                this.rouletteLastPayout = game.payout;
                this.rouletteOutcome = game.payout > 0 ? 'won' : 'lost';
                this.originalsSettle(game);

                if(game.payout > 0) { game.payout >= game.amount * 10 ? sfx.bigWin() : sfx.win(); }
                else { sfx.lose(); }

                this.rouletteHistory.unshift({ id: game._id, number: number });
                this.rouletteHistory = this.rouletteHistory.slice(0, 8);
            }
        },
        computed: {
            ...mapGetters([
                'originalsConfig'
            ]),
            rouletteTotal() {
                return Object.values(this.rouletteChips).reduce((total, amount) => total + amount, 0);
            }
        },
        created() {
            this.socketConnectOriginals();
        },
        beforeRouteLeave(to, from, next) {
            this.originalsFlush();
            this.socketDisconnectOriginals();
            next();
        }
    }
</script>

<style scoped>
    .roulette .option-label {
        margin-bottom: 6px;
        font-size: 13px;
        font-weight: 600;
        color: #b1bad3;
    }

    .roulette .option-total {
        position: relative;
        height: 42px;
        display: flex;
        align-items: center;
        padding: 0 32px 0 12px;
        border-radius: 6px;
        background: #2f4553;
        font-size: 14px;
        font-weight: 600;
        font-variant-numeric: tabular-nums;
        color: #ffffff;
    }

    .roulette .option-total img {
        position: absolute;
        top: 50%;
        right: 10px;
        width: 16px;
        height: 16px;
        transform: translateY(-50%);
    }

    .roulette .option-actions {
        display: flex;
        gap: 8px;
        margin-top: 8px;
    }

    .roulette .option-actions button {
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

    .roulette .option-actions button:hover:not(:disabled) {
        background: #3d5564;
    }

    .roulette .option-actions button:disabled {
        opacity: .45;
        cursor: not-allowed;
    }

    .roulette .option-actions .ui-icon {
        width: 14px;
        height: 14px;
    }

    .roulette-stage {
        position: relative;
        min-height: 600px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 28px;
        padding: 64px 28px 28px 28px;
        background: radial-gradient(70% 55% at 40% 30%, rgba(255, 255, 255, 0.04), transparent 70%);
        transition: background .6s ease;
    }

    .roulette-stage.stage-won {
        background: radial-gradient(70% 55% at 40% 30%, rgba(0, 231, 1, 0.1), transparent 70%);
    }

    .roulette-history {
        position: absolute;
        top: 18px;
        right: 18px;
        display: flex;
        gap: 6px;
    }

    .roulette-history .history-item {
        min-width: 30px;
        height: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 6px;
        font-size: 12px;
        font-weight: 700;
        font-variant-numeric: tabular-nums;
        color: #ffffff;
    }

    .roulette-history .item-red { background: #d0233a; }
    .roulette-history .item-black { background: #2f4553; }
    .roulette-history .item-green { background: #0f9d58; }

    .roulette-history .history-enter-active { transition: transform .45s cubic-bezier(.32, .72, 0, 1), opacity .3s ease; }
    .roulette-history .history-enter { transform: scale(.5); opacity: 0; }
    .roulette-history .history-leave-active { display: none; }
    .roulette-history .history-move { transition: transform .45s cubic-bezier(.32, .72, 0, 1); }

    .roulette-stage .stage-top {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 48px;
    }

    .roulette-stage .top-wheel {
        width: 280px;
        flex: none;
    }

    .roulette-stage .top-result {
        width: 170px;
        display: flex;
        justify-content: center;
    }

    .roulette-stage .result-card {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
    }

    .roulette-stage .card-number {
        width: 84px;
        height: 84px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 14px;
        font-size: 36px;
        font-weight: 800;
        color: #ffffff;
        box-shadow: 0 10px 24px -8px rgba(0, 0, 0, 0.6), inset 0 0 0 2px rgba(255, 255, 255, 0.15);
    }

    .roulette-stage .card-number.number-red { background: #d0233a; }
    .roulette-stage .card-number.number-black { background: #2f4553; }
    .roulette-stage .card-number.number-green { background: #0f9d58; }

    .roulette-stage .card-text {
        font-size: 16px;
        font-weight: 700;
        color: #b1bad3;
        font-variant-numeric: tabular-nums;
    }

    .roulette-stage .card-text.text-won {
        color: #00e701;
    }

    .roulette-stage .result-idle {
        font-size: 15px;
        font-weight: 600;
        color: #557086;
        text-align: center;
    }

    .roulette-stage .result-enter-active,
    .roulette-stage .result-leave-active {
        transition: opacity .25s ease, transform .45s cubic-bezier(.34, 1.56, .64, 1);
    }

    .roulette-stage .result-enter { opacity: 0; transform: scale(.7); }
    .roulette-stage .result-leave-to { opacity: 0; }

    @media only screen and (max-width: 850px) {
        .roulette-stage {
            min-height: 0;
            padding: 60px 14px 18px 14px;
            gap: 20px;
        }

        .roulette-stage .stage-top {
            gap: 20px;
        }

        .roulette-stage .top-wheel {
            width: 200px;
        }

        .roulette-stage .top-result {
            width: 110px;
        }

        .roulette-history {
            left: 14px;
            right: auto;
            overflow: hidden;
        }
    }
</style>
