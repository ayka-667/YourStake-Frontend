<template>
    <div class="roll-bets-element" v-bind:class="{ 'element-featured': featured, 'element-won': result === 'won', 'element-lost': result === 'lost' }">
        <div class="element-avatar">
            <AvatarImage v-bind:image="bet.user.avatar" />
        </div>
        <div class="element-user">
            <span class="user-name">{{ bet.user.username }}</span>
            <span v-if="featured" class="user-target">Target {{ rollFormatMultiplier(bet.multiplier) }}×</span>
        </div>
        <span v-if="featured === false" class="element-multiplier">{{ rollFormatMultiplier(bet.multiplier) }}×</span>
        <div class="element-amount">
            <img src="@/assets/img/icons/coin.svg" alt="" />
            <span>{{ result === 'won' ? '+' + rollFormatValue(rollGetPayout) : rollFormatValue(bet.amount) }}</span>
        </div>
    </div>
</template>

<script>
    import AvatarImage from '@/components/AvatarImage';

    export default {
        name: 'RollBetsElement',
        components: {
            AvatarImage
        },
        props: {
            bet: { type: Object, required: true },
            featured: { type: Boolean, default: false },
            // 'won' / 'lost' once the round is settled, null while it runs
            result: { type: String, default: null }
        },
        methods: {
            rollFormatValue(value) {
                return parseFloat(Math.floor(value / 10) / 100).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            },
            rollFormatMultiplier(multiplier) {
                return parseFloat(multiplier / 100).toFixed(2);
            }
        },
        computed: {
            rollGetPayout() {
                return Math.floor(this.bet.amount * (this.bet.multiplier / 100));
            }
        }
    }
</script>

<style scoped>
    .roll-bets-element {
        height: 44px;
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 0 12px;
        border-radius: 8px;
        background: #1a2c38;
        transition: background .2s ease, opacity .3s ease;
    }

    .roll-bets-element:hover {
        background: #2f4553;
    }

    .roll-bets-element .element-avatar {
        width: 24px;
        height: 24px;
        flex: none;
    }

    .roll-bets-element .element-user {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
    }

    .roll-bets-element .user-name {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 13px;
        font-weight: 600;
        color: #ffffff;
    }

    .roll-bets-element .user-target {
        margin-top: 2px;
        font-size: 12px;
        font-weight: 600;
        color: #b1bad3;
    }

    .roll-bets-element .element-multiplier {
        flex: none;
        padding: 3px 7px;
        border-radius: 4px;
        background: #2f4553;
        font-size: 12px;
        font-weight: 700;
        color: #b1bad3;
        font-variant-numeric: tabular-nums;
    }

    .roll-bets-element .element-amount {
        flex: none;
        min-width: 72px;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        gap: 5px;
        font-size: 13px;
        font-weight: 700;
        color: #ffffff;
        font-variant-numeric: tabular-nums;
    }

    .roll-bets-element .element-amount img {
        width: 14px;
        height: 14px;
    }

    .roll-bets-element.element-won .element-amount {
        color: #00e701;
    }

    .roll-bets-element.element-won .element-multiplier {
        background: rgba(0, 231, 1, 0.15);
        color: #00e701;
    }

    .roll-bets-element.element-lost {
        opacity: .45;
    }

    /* Highest bet: bigger card with a gold accent */
    .roll-bets-element.element-featured {
        height: 60px;
        gap: 12px;
        padding: 0 14px;
        background: linear-gradient(135deg, rgba(255, 190, 11, 0.16) 0%, rgba(255, 190, 11, 0.02) 70%), #1a2c38;
        box-shadow: inset 0 0 0 1px rgba(255, 190, 11, 0.3);
    }

    .roll-bets-element.element-featured .element-avatar {
        width: 34px;
        height: 34px;
    }

    .roll-bets-element.element-featured .user-name {
        font-size: 14px;
        font-weight: 700;
    }

    .roll-bets-element.element-featured .element-amount {
        font-size: 15px;
    }

    .roll-bets-element.element-featured .element-amount img {
        width: 16px;
        height: 16px;
    }
</style>
