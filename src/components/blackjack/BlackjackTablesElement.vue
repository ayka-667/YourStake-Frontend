<template>
    <router-link v-bind:to="'/blackjack/table/' + (table.table + 1)" class="blackjack-tables-element">
        <div class="element-felt">
            <div class="felt-seats">
                <span v-for="seat in 5" v-bind:key="seat" class="seat" v-bind:class="{ 'seat-taken': seat <= table.players.length }"></span>
            </div>
            <div class="felt-label">BLACKJACK PAYS 3 TO 2</div>
        </div>
        <div class="element-info">
            <span class="info-name">Table {{table.table + 1}}</span>
            <span class="info-players" v-bind:class="{ 'players-full': table.players.length >= 5 }">{{table.players.length}}/5</span>
        </div>
    </router-link>
</template>

<script>
    export default {
        name: 'BlackjackTablesElement',
        props: ['table']
    }
</script>

<style scoped>
    a.blackjack-tables-element {
        width: calc(20% - 12px);
        display: flex;
        flex-direction: column;
        margin: 0 15px 15px 0;
        border-radius: 8px;
        background: #213743;
        overflow: hidden;
        transition: transform .2s ease, background .2s ease;
    }

    a.blackjack-tables-element:nth-child(5n) {
        margin-right: 0;
    }

    a.blackjack-tables-element:hover {
        transform: translateY(-4px);
        background: #2f4553;
    }

    .blackjack-tables-element .element-felt {
        height: 110px;
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        align-items: center;
        margin: 10px 10px 0 10px;
        padding-bottom: 14px;
        border-radius: 6px 6px 120px 120px / 6px 6px 70px 70px;
        background: radial-gradient(110% 120% at 50% 0%, #1a6f47 0%, #11553a 60%, #0b3d29 100%);
        box-shadow: inset 0 0 0 1px rgba(230, 199, 122, 0.45), inset 0 -18px 30px rgba(0, 0, 0, 0.18);
    }

    .blackjack-tables-element .felt-label {
        font-size: 9px;
        font-weight: 700;
        letter-spacing: .08em;
        color: rgba(230, 199, 122, 0.55);
    }

    .blackjack-tables-element .felt-seats {
        position: absolute;
        top: 22px;
        display: flex;
        gap: 10px;
    }

    .blackjack-tables-element .seat {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        border: 1.5px solid rgba(255, 255, 255, 0.3);
    }

    .blackjack-tables-element .seat:nth-child(1),
    .blackjack-tables-element .seat:nth-child(5) { transform: translateY(-6px); }
    .blackjack-tables-element .seat:nth-child(2),
    .blackjack-tables-element .seat:nth-child(4) { transform: translateY(2px); }
    .blackjack-tables-element .seat:nth-child(3) { transform: translateY(5px); }

    .blackjack-tables-element .seat.seat-taken {
        border-color: #ffffff;
        background: #ffffff;
    }

    .blackjack-tables-element .element-info {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 14px;
    }

    .blackjack-tables-element .info-name {
        font-size: 14px;
        font-weight: 700;
        color: #ffffff;
    }

    .blackjack-tables-element .info-players {
        padding: 2px 8px;
        border-radius: 999px;
        background: #0f212e;
        font-size: 12px;
        font-weight: 700;
        color: #b1bad3;
    }

    .blackjack-tables-element .info-players.players-full {
        color: #ed4163;
    }

    @media only screen and (max-width: 1300px) {

        a.blackjack-tables-element {
            width: calc(25% - 12px);
        }

        a.blackjack-tables-element:nth-child(5n) {
            margin-right: 15px;
        }

        a.blackjack-tables-element:nth-child(4n) {
            margin-right: 0;
        }

    }

    @media only screen and (max-width: 800px) {

        a.blackjack-tables-element {
            width: calc(50% - 8px);
        }

        a.blackjack-tables-element:nth-child(n) {
            margin-right: 15px;
        }

        a.blackjack-tables-element:nth-child(2n) {
            margin-right: 0;
        }

    }
</style>
