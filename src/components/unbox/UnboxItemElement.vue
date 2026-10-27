<template>
    <div class="unbox-item-element" v-bind:class="['element-' + item.color]" v-bind:style="{ '--i': index || 0 }">
        <div class="element-chance">{{ item.tickets / 1000 }}%</div>
        <div class="element-image">
            <img v-bind:src="item.item.image" alt="" />
        </div>
        <div class="element-name">{{ item.item.name }}</div>
        <div class="element-price">
            <img src="@/assets/img/icons/coin.svg" alt="" />
            {{ unboxFormatValue(item.item.amountFixed) }}
        </div>
    </div>
</template>

<script>
    export default {
        name: 'UnboxItemElement',
        props: ['item', 'index'],
        methods: {
            unboxFormatValue(value) {
                return parseFloat(Math.floor(value / 10) / 100).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            }
        }
    }
</script>

<style scoped>
    .unbox-item-element {
        --rarity: #8aa0b8;
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 14px 12px 16px 12px;
        border-radius: 16px;
        background: #1a2c38;
        box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.05);
        overflow: hidden;
        isolation: isolate;
        animation: item-in .7s cubic-bezier(.32, .72, 0, 1) both;
        animation-delay: calc(var(--i) * 40ms);
        transition: transform .5s cubic-bezier(.32, .72, 0, 1), box-shadow .5s ease;
    }

    .unbox-item-element.element-blue { --rarity: #3b9bff; }
    .unbox-item-element.element-purple { --rarity: #a86bff; }
    .unbox-item-element.element-green { --rarity: #22d36b; }
    .unbox-item-element.element-red { --rarity: #ff4d6d; }
    .unbox-item-element.element-yellow { --rarity: #f5b70a; }

    .unbox-item-element::before {
        content: '';
        position: absolute;
        inset: 0;
        background: radial-gradient(60% 45% at 50% 38%, var(--rarity) 0%, transparent 100%);
        opacity: .16;
        transition: opacity .5s ease;
        z-index: -1;
    }

    .unbox-item-element::after {
        content: '';
        position: absolute;
        left: 24%;
        right: 24%;
        bottom: 0;
        height: 3px;
        border-radius: 3px 3px 0 0;
        background: var(--rarity);
        box-shadow: 0 0 14px var(--rarity);
    }

    .unbox-item-element:hover {
        transform: translateY(-4px);
        box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.08), 0 18px 40px -20px rgba(0, 0, 0, 0.8);
    }

    .unbox-item-element:hover::before { opacity: .3; }

    .unbox-item-element .element-chance {
        align-self: flex-end;
        padding: 3px 8px;
        border-radius: 999px;
        background: rgba(15, 33, 46, 0.7);
        font-size: 12px;
        font-weight: 600;
        font-variant-numeric: tabular-nums;
        color: #b1bad3;
    }

    .unbox-item-element .element-image {
        width: 96px;
        height: 96px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 4px 0 10px 0;
    }

    .unbox-item-element .element-image img {
        max-width: 100%;
        max-height: 100%;
        filter: drop-shadow(0 10px 16px rgba(0, 0, 0, 0.45));
        transition: transform .6s cubic-bezier(.32, .72, 0, 1);
    }

    .unbox-item-element:hover .element-image img { transform: translateY(-3px) scale(1.06); }

    .unbox-item-element .element-name {
        max-width: 100%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        font-size: 14px;
        font-weight: 600;
        color: #ffffff;
    }

    .unbox-item-element .element-price {
        display: flex;
        align-items: center;
        gap: 6px;
        margin-top: 6px;
        font-size: 13px;
        font-weight: 700;
        font-variant-numeric: tabular-nums;
        color: #b1bad3;
    }

    .unbox-item-element .element-price img { width: 14px; height: 14px; }

    @keyframes item-in {
        from { opacity: 0; transform: translateY(12px); }
        to { opacity: 1; transform: none; }
    }

    @media (prefers-reduced-motion: reduce) {
        .unbox-item-element { animation: none; }
    }
</style>