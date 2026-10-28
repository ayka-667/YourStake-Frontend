<template>
    <div class="roulette-table" v-bind:class="{ 'table-locked': locked }" v-on:mouseleave="tableHover = null">
        <div class="table-grid">
            <button class="table-cell cell-zero" v-bind:class="tableCellClass('number', 0)" style="grid-column: 1; grid-row: 1 / 4;"
                v-on:click="tablePlace('number', 0)" v-on:mouseenter="tableHover = { type: 'number', value: 0 }">
                <span>0</span>
                <TableChip v-if="tableAmount('number', 0) > 0" v-bind:amount="tableAmount('number', 0)" />
            </button>

            <template v-for="cell in tableNumbers">
                <button v-bind:key="'n' + cell.number" class="table-cell cell-number"
                    v-bind:class="[tableNumberColor(cell.number), tableCellClass('number', cell.number)]"
                    v-bind:style="{ gridColumn: cell.column + 1, gridRow: cell.row }"
                    v-on:click="tablePlace('number', cell.number)" v-on:mouseenter="tableHover = { type: 'number', value: cell.number }">
                    <span>{{ cell.number }}</span>
                    <TableChip v-if="tableAmount('number', cell.number) > 0" v-bind:amount="tableAmount('number', cell.number)" />
                </button>
            </template>

            <button v-for="row in 3" v-bind:key="'c' + row" class="table-cell cell-outside" v-bind:class="tableCellClass('column', 4 - row)"
                v-bind:style="{ gridColumn: 14, gridRow: row }"
                v-on:click="tablePlace('column', 4 - row)" v-on:mouseenter="tableHover = { type: 'column', value: 4 - row }">
                <span>2:1</span>
                <TableChip v-if="tableAmount('column', 4 - row) > 0" v-bind:amount="tableAmount('column', 4 - row)" />
            </button>

            <button v-for="dozen in 3" v-bind:key="'d' + dozen" class="table-cell cell-outside" v-bind:class="tableCellClass('dozen', dozen)"
                v-bind:style="{ gridColumn: (dozen - 1) * 4 + 2 + ' / span 4', gridRow: 4 }"
                v-on:click="tablePlace('dozen', dozen)" v-on:mouseenter="tableHover = { type: 'dozen', value: dozen }">
                <span>{{ (dozen - 1) * 12 + 1 }} to {{ dozen * 12 }}</span>
                <TableChip v-if="tableAmount('dozen', dozen) > 0" v-bind:amount="tableAmount('dozen', dozen)" />
            </button>

            <button v-for="(spot, index) in tableOutside" v-bind:key="spot.type + spot.value" class="table-cell cell-outside"
                v-bind:class="[tableCellClass(spot.type, spot.value), spot.class]"
                v-bind:style="{ gridColumn: index * 2 + 2 + ' / span 2', gridRow: 5 }"
                v-on:click="tablePlace(spot.type, spot.value)" v-on:mouseenter="tableHover = { type: spot.type, value: spot.value }">
                <span v-if="spot.class === undefined">{{ spot.label }}</span>
                <span v-else class="outside-diamond"></span>
                <TableChip v-if="tableAmount(spot.type, spot.value) > 0" v-bind:amount="tableAmount(spot.type, spot.value)" />
            </button>
        </div>
    </div>
</template>

<script>
    const RED = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];

    // Short chip label: 0.5, 25, 1.2K, 3M (amounts are in internal units, 1 coin = 1000).
    const chipLabel = (amount) => {
        const coins = amount / 1000;
        if(coins >= 1000000) { return +(coins / 1000000).toFixed(1) + 'M'; }
        if(coins >= 1000) { return +(coins / 1000).toFixed(1) + 'K'; }
        return +coins.toFixed(2) + '';
    };

    const TableChip = {
        name: 'TableChip',
        props: ['amount'],
        render(h) {
            return h('span', { class: 'table-chip' }, chipLabel(this.amount));
        }
    };

    export const rouletteCovers = (spot, number) => {
        if(spot.type === 'number') { return spot.value === number; }
        if(number === 0) { return false; }
        if(spot.type === 'dozen') { return Math.ceil(number / 12) === spot.value; }
        if(spot.type === 'column') { return ((number - 1) % 3) + 1 === spot.value; }
        if(spot.type === 'color') { return RED.includes(number) === (spot.value === 'red'); }
        if(spot.type === 'parity') { return (number % 2 === 0) === (spot.value === 'even'); }
        return (number <= 18) === (spot.value === 'low');
    };

    export default {
        name: 'RouletteTable',
        components: {
            TableChip
        },
        props: {
            // { 'type:value': amount }
            chips: { type: Object, required: true },
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
    .roulette-table {
        width: 100%;
        overflow-x: auto;
        padding-bottom: 4px;
    }

    .roulette-table .table-grid {
        min-width: 600px;
        display: grid;
        grid-template-columns: 1.1fr repeat(12, 1fr) 1.1fr;
        grid-template-rows: repeat(3, 46px) 40px 40px;
        gap: 4px;
    }

    .roulette-table button.table-cell {
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

    .roulette-table button.cell-zero { background: #0f9d58; }
    .roulette-table button.number-red { background: #d0233a; }
    .roulette-table button.number-black { background: #2f4553; }

    .roulette-table button.cell-outside {
        background: transparent;
        box-shadow: inset 0 0 0 2px #2f4553;
        color: #b1bad3;
    }

    .roulette-table button.cell-hover {
        filter: brightness(1.25);
        box-shadow: inset 0 0 0 2px rgba(255, 255, 255, 0.55);
    }

    .roulette-table button.cell-outside.cell-hover {
        color: #ffffff;
        background: rgba(47, 69, 83, 0.5);
    }

    .roulette-table button.cell-win {
        box-shadow: inset 0 0 0 2px #00e701, 0 0 14px rgba(0, 231, 1, 0.45);
        filter: brightness(1.15);
    }

    .roulette-table button.cell-outside.cell-win {
        color: #ffffff;
        background: rgba(0, 231, 1, 0.12);
    }

    .roulette-table.table-locked button.table-cell {
        cursor: default;
    }

    .roulette-table .outside-diamond {
        width: 26px;
        height: 18px;
        clip-path: polygon(50% 0, 100% 50%, 50% 100%, 0 50%);
    }

    .roulette-table .outside-red .outside-diamond { background: #d0233a; }
    .roulette-table .outside-black .outside-diamond { background: #6b8396; }

    .roulette-table >>> .table-chip {
        position: absolute;
        top: 50%;
        left: 50%;
        min-width: 28px;
        height: 28px;
        padding: 0 4px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 999px;
        transform: translate(-50%, -50%);
        background: radial-gradient(circle, #00e701 0 52%, #05080a 53% 58%, #00e701 59%);
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.55), inset 0 0 0 2px rgba(255, 255, 255, 0.35);
        font-size: 10px;
        font-weight: 800;
        color: #05080a;
        pointer-events: none;
        animation: chip-drop .25s cubic-bezier(.34, 1.56, .64, 1);
    }

    @keyframes chip-drop {
        from { transform: translate(-50%, -80%) scale(.6); opacity: 0; }
    }
</style>
