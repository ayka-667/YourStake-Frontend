<template>
    <div class="unbox-overview">
        <div class="overview-top">
            <h1 class="overview-title">Cases</h1>
            <div class="overview-filter">
                <UnboxFilterSearch />
                <UnboxFilterSort />
            </div>
        </div>
        <div class="overview-tabs" role="tablist">
            <button
                v-for="tab in tabs"
                v-bind:key="tab.value"
                v-on:click="unboxSetFilterSelect(tab.value)"
                class="button-tab"
                v-bind:class="{ 'tab-active': unboxFilterSelect === tab.value }"
                role="tab"
                v-bind:aria-selected="unboxFilterSelect === tab.value"
            >{{ tab.label }}</button>
        </div>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';
    import UnboxFilterSearch from '@/components/unbox/UnboxFilterSearch';
    import UnboxFilterSort from '@/components/unbox/UnboxFilterSort';

    export default {
        name: 'UnboxHeaderOverview',
        components: {
            UnboxFilterSearch,
            UnboxFilterSort
        },
        data() {
            return {
                tabs: [
                    { value: 'featured', label: 'Featured' },
                    { value: 'low risk', label: 'Low risk' },
                    { value: '50/50', label: '50/50' },
                    { value: 'high risk', label: 'High risk' },
                    { value: 'partners', label: 'Partners' }
                ]
            }
        },
        methods: {
            ...mapActions([
                'unboxSetFilterSelect'
            ])
        },
        computed: {
            ...mapGetters([
                'unboxFilterSelect'
            ])
        }
    }
</script>

<style scoped>
    .unbox-overview {
        width: 100%;
        margin-bottom: 20px;
    }

    .unbox-overview .overview-top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
    }

    .unbox-overview .overview-title {
        font-size: 24px;
        font-weight: 800;
        letter-spacing: -0.01em;
        color: #ffffff;
    }

    .unbox-overview .overview-filter {
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .unbox-overview .overview-tabs {
        display: flex;
        gap: 4px;
        margin-top: 16px;
        border-bottom: 1px solid #2f4553;
        overflow-x: auto;
        scrollbar-width: none;
    }

    .unbox-overview .overview-tabs::-webkit-scrollbar { display: none; }

    .unbox-overview button.button-tab {
        position: relative;
        flex: none;
        padding: 10px 14px 12px 14px;
        background: transparent;
        font-size: 14px;
        font-weight: 600;
        white-space: nowrap;
        color: #b1bad3;
        transition: color .15s ease;
    }

    .unbox-overview button.button-tab::after {
        content: '';
        position: absolute;
        left: 14px;
        right: 14px;
        bottom: -1px;
        height: 2px;
        border-radius: 2px;
        background: #ffffff;
        transform: scaleX(0);
        transition: transform .2s cubic-bezier(.22, 1, .36, 1);
    }

    .unbox-overview button.button-tab:hover { color: #ffffff; }
    .unbox-overview button.button-tab.tab-active { color: #ffffff; }
    .unbox-overview button.button-tab.tab-active::after { transform: scaleX(1); }

    @media only screen and (max-width: 800px) {
        .unbox-overview .overview-top { flex-direction: column; align-items: stretch; }
        .unbox-overview .overview-filter { flex-wrap: wrap; }
    }
</style>