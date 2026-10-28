<template>
    <div class="roulette-board" v-bind:class="{ 'table-locked': locked }" v-on:mouseleave="tableHover = null">
        <div class="table-grid">
            <button class="table-cell cell-zero" v-bind:class="tableCellClass('number', 0)" style="grid-column: 1; grid-row: 1 / 4;"
                v-on:click="tablePlace('number', 0)" v-on:mouseenter="tableHover = { type: 'number', value: 0 }">
                <span>0</span>
                <TableChip v-if="tableAmount('number', 0) > 0" v-bind:amount="tableAmount('number', 0)" v-bind:pending="tablePending('number', 0)" />
            </button>

            <template v-for="cell in tableNumbers">
                <button v-bind:key="'n' + cell.number" class="table-cell cell-number"
                    v-bind:class="[tableNumberColor(cell.number), tableCellClass('number', cell.number)]"
                    v-bind:style="{ gridColumn: cell.column + 1, gridRow: cell.row }"
                    v-on:click="tablePlace('number', cell.number)" v-on:mouseenter="tableHover = { type: 'number', value: cell.number }">
                    <span>{{ cell.number }}</span>
                    <TableChip v-if="tableAmount('number', cell.number) > 0" v-bind:amount="tableAmount('number', cell.number)" v-bind:pending="tablePending('number', cell.number)" />
                </button>
            </template>

            <button v-for="row in 3" v-bind:key="'c' + row" class="table-cell cell-outside" v-bind:class="tableCellClass('column', 4 - row)"
                v-bind:style="{ gridColumn: 14, gridRow: row }"
                v-on:click="tablePlace('column', 4 - row)" v-on:mouseenter="tableHover = { type: 'column', value: 4 - row }">
                <span>2:1</span>
                <TableChip v-if="tableAmount('column', 4 - row) > 0" v-bind:amount="tableAmount('column', 4 - row)" v-bind:pending="tablePending('column', 4 - row)" />
            </button>

            <button v-for="dozen in 3" v-bind:key="'d' + dozen" class="table-cell cell-outside" v-bind:class="tableCellClass('dozen', dozen)"
                v-bind:style="{ gridColumn: (dozen - 1) * 4 + 2 + ' / span 4', gridRow: 4 }"
                v-on:click="tablePlace('dozen', dozen)" v-on:mouseenter="tableHover = { type: 'dozen', value: dozen }">
                <span>{{ (dozen - 1) * 12 + 1 }} to {{ dozen * 12 }}</span>
                <TableChip v-if="tableAmount('dozen', dozen) > 0" v-bind:amount="tableAmount('dozen', dozen)" v-bind:pending="tablePending('dozen', dozen)" />
            </button>

            <button v-for="(spot, index) in tableOutside" v-bind:key="spot.type + spot.value" class="table-cell cell-outside"
                v-bind:class="[tableCellClass(spot.type, spot.value), spot.class]"
                v-bind:style="{ gridColumn: index * 2 + 2 + ' / span 2', gridRow: 5 }"
                v-on:click="tablePlace(spot.type, spot.value)" v-on:mouseenter="tableHover = { type: spot.type, value: spot.value }">
                <span v-if="spot.class === undefined">{{ spot.label }}</span>
                <span v-else class="outside-diamond"></span>
                <TableChip v-if="tableAmount(spot.type, spot.value) > 0" v-bind:amount="tableAmount(spot.type, spot.value)" v-bind:pending="tablePending(spot.type, spot.value)" />
            </button>
        </div>
    </div>
</template>

<script>
    import { ROULETTE_RED as RED, rouletteCovers } from '@/utils/roulette';

    // Short chip label: 0.5, 25, 1.2K, 3M (amounts are in internal units, 1 coin = 1000).
    const chipLabel = (amount) => {
        const coins = amount / 1000;
        if(coins >= 1000000) { return +(coins / 1000000).toFixed(1) + 'M'; }
        if(coins >= 1000) { return +(coins / 1000).toFixed(1) + 'K'; }
        return +coins.toFixed(2) + '';
    };

    // Casino colours by value: 1 white, 5 red, 25 green, 100 black, 500 purple, 1,000+ gold.
    const chipTier = (amount) => {
        const coins = amount / 1000;
        if(coins >= 1000) { return 'gold'; }
        if(coins >= 500) { return 'purple'; }
        if(coins >= 100) { return 'black'; }
        if(coins >= 25) { return 'green'; }
        if(coins >= 5) { return 'red'; }
        return 'white';
    };

    const TableChip = {
        name: 'TableChip',
        props: ['amount', 'pending'],
        render(h) {
            return h('span', { class: ['table-chip', 'chip-' + chipTier(this.amount), { 'chip-pending': this.pending === true }] }, [
                h('span', { class: 'chip-face' }, chipLabel(this.amount))
            ]);
        }
    };

    export default {
        name: 'RouletteBoard',
        components: {
            TableChip
        },
        props: {
            // { 'type:value': amount }
            chips: { type: Object, required: true },
            // Spots whose chips are not sent yet ({ 'type:value': true })
            pending: { type: Object, default: () => ({}) },
            result: { type: Number, default: null },
            locked: { type: Boolean, default: false }
        },
        data() {
            let numbers = [];
            for(let column = 1; column <= 12; column++) {
                for(let row = 1; row <= 3; row++) { numbers.push({ number: column * 3 - (row - 1), column: column, row: row }); }
            }

            return {
                tableNumbers: numbers,
                tableOutside: [
                    { type: 'half', value: 'low', label: '1 to 18' },
                    { type: 'parity', value: 'even', label: 'Even' },
                    { type: 'color', value: 'red', class: 'outside-red' },
                    { type: 'color', value: 'black', class: 'outside-black' },
                    { type: 'parity', value: 'odd', label: 'Odd' },
                    { type: 'half', value: 'high', label: '19 to 36' }
                ],
                tableHover: null
            }
        },
        methods: {
            tableNumberColor(number) {
                return RED.includes(number) === true ? 'number-red' : 'number-black';
            },
            tablePending(type, value) {
                return this.pending[type + ':' + value] === true;
            },
            tableAmount(type, value) {
                return this.chips[type + ':' + value] || 0;
            },
            tableCellClass(type, value) {
                const spot = { type: type, value: value };
                const hovered = this.tableHover !== null && this.locked === false && (
                    (this.tableHover.type === type && this.tableHover.value === value) ||
                    (type === 'number' && rouletteCovers(this.tableHover, value) === true)
                );

                return {
                    'cell-hover': hovered,
                    'cell-win': this.result !== null && rouletteCovers(spot, this.result) === true
                };
            },
            tablePlace(type, value) {
                if(this.locked === true) { return; }
                this.$emit('place', { type: type, value: value });
            }
        }
    }
</script>

<style scoped>
    .roulette-board {
        width: 100%;
        overflow-x: auto;
        padding-bottom: 4px;
    }

    .roulette-board .table-grid {
        min-width: 600px;
        display: grid;
        grid-template-columns: 1.1fr repeat(12, 1fr) 1.1fr;
        grid-template-rows: repeat(3, 46px) 40px 40px;
        gap: 4px;
    }

    .roulette-board button.table-cell {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 6px;
        font-size: 13px;
        font-weight: 700;
        color: #ffffff;
        font-variant-numeric: tabular-nums;
        transition: filter .15s ease, box-shadow .15s ease, transform .15s ease;
    }

    .roulette-board button.cell-zero { background: #0f9d58; }
    .roulette-board button.number-red { background: #d0233a; }
    .roulette-board button.number-black { background: #2f4553; }

    .roulette-board button.cell-outside {
        background: transparent;
        box-shadow: inset 0 0 0 2px #2f4553;
        color: #b1bad3;
    }

    .roulette-board button.cell-hover {
        filter: brightness(1.25);
        box-shadow: inset 0 0 0 2px rgba(255, 255, 255, 0.55);
    }

    .roulette-board button.cell-outside.cell-hover {
        color: #ffffff;
        background: rgba(47, 69, 83, 0.5);
    }

    .roulette-board button.cell-win {
        box-shadow: inset 0 0 0 2px #00e701, 0 0 14px rgba(0, 231, 1, 0.45);
        filter: brightness(1.15);
    }

    .roulette-board button.cell-outside.cell-win {
        color: #ffffff;
        background: rgba(0, 231, 1, 0.12);
    }

    .roulette-board.table-locked button.table-cell {
        cursor: default;
    }

    .roulette-board .outside-diamond {
        width: 26px;
        height: 18px;
        clip-path: polygon(50% 0, 100% 50%, 50% 100%, 0 50%);
    }

    .roulette-board .outside-red .outside-diamond { background: #d0233a; }
    .roulette-board .outside-black .outside-diamond { background: #6b8396; }

    /* Casino chip: striped edge from a conic gradient, dashed inlay on the face */
    .roulette-board >>> .table-chip {
        --chip: #e9eef3;
        --chip-light: #ffffff;
        --chip-dark: #9aa6b2;
        --edge: #2f6fe0;
        --ink: #14212b;
        position: absolute;
        top: 50%;
        left: 50%;
        width: 32px;
        height: 32px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 50%;
        transform: translate(-50%, -50%);
        background: repeating-conic-gradient(from 8deg, var(--edge) 0 14deg, var(--chip) 14deg 45deg);
        box-shadow: 0 2px 0 var(--chip-dark), 0 4px 8px rgba(0, 0, 0, 0.5), inset 0 0 0 1px rgba(0, 0, 0, 0.18);
        pointer-events: none;
        animation: chip-drop .25s cubic-bezier(.34, 1.56, .64, 1);
    }

    .roulette-board >>> .table-chip .chip-face {
        width: 22px;
        height: 22px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 50%;
        background: radial-gradient(circle at 40% 35%, var(--chip-light), var(--chip));
        box-shadow: 0 0 0 1.5px var(--chip-dark), inset 0 0 0 1.5px rgba(255, 255, 255, 0.55);
        font-size: 9px;
        font-weight: 800;
        letter-spacing: -0.02em;
        color: var(--ink);
        white-space: nowrap;
    }

    .roulette-board >>> .chip-red { --chip: #d0233a; --chip-light: #ef4a5f; --chip-dark: #861425; --edge: #ffffff; --ink: #ffffff; }
    .roulette-board >>> .chip-green { --chip: #0c9e43; --chip-light: #2be06c; --chip-dark: #06612c; --edge: #ffffff; --ink: #ffffff; }
    .roulette-board >>> .chip-black { --chip: #1b242c; --chip-light: #3b4954; --chip-dark: #05080a; --edge: #ffffff; --ink: #ffffff; }
    .roulette-board >>> .chip-purple { --chip: #7b3fd1; --chip-light: #9f6bf0; --chip-dark: #4a1f8a; --edge: #ffd34d; --ink: #ffffff; }
    .roulette-board >>> .chip-gold { --chip: #e6a812; --chip-light: #ffd64d; --chip-dark: #8f6200; --edge: #1b242c; --ink: #2a1a00; }

    /* Not sent yet: dotted ring around the chip */
    .roulette-board >>> .table-chip.chip-pending {
        outline: 2px dotted rgba(255, 255, 255, 0.9);
        outline-offset: 2px;
    }

    @keyframes chip-drop {
        from { transform: translate(-50%, -80%) scale(.6); opacity: 0; }
    }
</style>
