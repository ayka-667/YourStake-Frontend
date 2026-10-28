<template>
    <OriginalsShell class="plinko">
        <template v-slot:panel>
            <OriginalsPanel v-bind:busy="plinkoSending" v-bind:disabled="plinkoSending || originalsConfig === null" v-on:bet="plinkoBet">
                <div class="panel-option">
                    <div class="option-label">Risk</div>
                    <div class="option-segment">
                        <button v-for="risk in ['low', 'medium', 'high']" v-bind:key="risk"
                            v-on:click="plinkoRisk = risk"
                            v-bind:class="{ 'segment-active': plinkoRisk === risk }"
                            v-bind:disabled="plinkoInFlight > 0">
                            {{ risk.charAt(0).toUpperCase() + risk.slice(1) }}
                        </button>
                    </div>
                </div>
                <div class="panel-option">
                    <div class="option-label">
                        <span>Rows</span>
                        <span>{{ plinkoRows }}</span>
                    </div>
                    <input v-model.number="plinkoRows" class="option-range" type="range" min="8" max="16" step="1" v-bind:disabled="plinkoInFlight > 0"
                        v-bind:style="{ '--fill': ((plinkoRows - 8) / 8 * 100) + '%' }" />
                </div>
            </OriginalsPanel>
        </template>

        <div class="plinko-stage">
            <PlinkoBoard v-if="plinkoTable !== null" ref="board" v-bind:rows="plinkoRows" v-bind:table="plinkoTable" />
            <div v-else class="stage-loading"></div>

            <transition-group name="history" tag="div" class="plinko-history">
                <div v-for="item in plinkoHistory" v-bind:key="item.id" class="history-item" v-bind:style="{ background: item.color }">
                    {{ item.multiplier }}×
                </div>
            </transition-group>
        </div>
    </OriginalsShell>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';
    import OriginalsShell from '@/components/originals/OriginalsShell';
    import OriginalsPanel from '@/components/originals/OriginalsPanel';
    import PlinkoBoard from '@/components/originals/PlinkoBoard';
    import sfx from '@/utils/sfx';

    export default {
        name: 'Plinko',
        metaInfo: {
            title: 'Plinko - YourStake.fr'
        },
        components: {
            OriginalsShell,
            OriginalsPanel,
            PlinkoBoard
        },
        data() {
            return {
                plinkoRisk: 'medium',
                plinkoRows: 16,
                plinkoSending: false,
                plinkoInFlight: 0,
                plinkoHistory: []
            }
        },
        methods: {
            ...mapActions([
                'socketConnectOriginals',
                'socketDisconnectOriginals',
                'originalsSendBetSocket',
                'originalsSettle',
                'originalsFlush'
            ]),
            async plinkoBet(amount) {
                if(this.plinkoSending === true) { return; }
                this.plinkoSending = true;

                const game = await this.originalsSendBetSocket({ game: 'plinko', amount: amount, risk: this.plinkoRisk, rows: this.plinkoRows });
                this.plinkoSending = false;
                if(game === null) { return; }

                sfx.chip();
                this.plinkoInFlight = this.plinkoInFlight + 1;

                const slot = this.$refs.board !== undefined ? await this.$refs.board.boardDrop(game.outcome.path) : game.outcome.slot;
                const multiplier = game.multiplier / 100;

                this.plinkoInFlight = this.plinkoInFlight - 1;
                this.originalsSettle(game);
                sfx.slot(multiplier);

                const color = this.$refs.board !== undefined ? this.$refs.board.boardSlotColor(slot, 1) : '#ffc000';
                this.plinkoHistory.unshift({ id: game._id, multiplier: multiplier, color: color });
                this.plinkoHistory = this.plinkoHistory.slice(0, 5);
            }
        },
        computed: {
            ...mapGetters([
                'originalsConfig'
            ]),
            plinkoTable() {
                if(this.originalsConfig === null) { return null; }
                return this.originalsConfig.plinko[this.plinkoRisk][this.plinkoRows];
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
    .plinko-stage {
        position: absolute;
        inset: 0;
        padding: 10px 70px 10px 10px;
    }

    .plinko-stage .stage-loading {
        width: 100%;
        height: 100%;
    }

    .plinko-history {
        position: absolute;
        top: 50%;
        right: 14px;
        width: 50px;
        display: flex;
        flex-direction: column;
        gap: 4px;
        transform: translateY(-50%);
        border-radius: 8px;
        overflow: hidden;
    }

    .plinko-history .history-item {
        height: 44px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 12px;
        font-weight: 800;
        color: #1a0a00;
    }

    .plinko-history .history-enter-active {
        transition: transform .45s cubic-bezier(.32, .72, 0, 1), opacity .3s ease;
    }

    .plinko-history .history-enter {
        transform: translateY(-100%);
        opacity: 0;
    }

    .plinko-history .history-leave-active {
        display: none;
    }

    .plinko-history .history-move {
        transition: transform .45s cubic-bezier(.32, .72, 0, 1);
    }

    @media only screen and (max-width: 850px) {
        .plinko-stage { padding: 10px 10px 56px 10px; }
        .plinko-history { top: auto; bottom: 10px; right: 50%; width: auto; flex-direction: row; transform: translateX(50%); }
        .plinko-history .history-item { width: 50px; height: 36px; }
    }
</style>
