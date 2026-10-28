// European roulette rules shared by the lobby, the board and the table page.
// Mirrors growcsn-backend/utils/roulette.js.

export const ROULETTE_RED = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
export const ROULETTE_MULTIPLIERS = { number: 36, dozen: 3, column: 3, color: 2, parity: 2, half: 2 };

export const rouletteColor = (number) => {
    if(number === 0) { return 'green'; }
    return ROULETTE_RED.includes(number) === true ? 'red' : 'black';
};

// Whether a spot ({ type, value }) wins on `number`.
export const rouletteCovers = (spot, number) => {
    if(spot.type === 'number') { return spot.value === number; }
    if(number === 0) { return false; }
    if(spot.type === 'dozen') { return Math.ceil(number / 12) === spot.value; }
    if(spot.type === 'column') { return ((number - 1) % 3) + 1 === spot.value; }
    if(spot.type === 'color') { return ROULETTE_RED.includes(number) === (spot.value === 'red'); }
    if(spot.type === 'parity') { return (number % 2 === 0) === (spot.value === 'even'); }
    return (number <= 18) === (spot.value === 'low');
};

export const roulettePayout = (bets, number) => bets.reduce((total, bet) => total + (rouletteCovers(bet, number) === true ? bet.amount * ROULETTE_MULTIPLIERS[bet.type] : 0), 0);

export const rouletteTableName = (table) => {
    if(table.type === 'whale') { return 'High Roller ' + (table.table - 5); }
    return 'Table ' + (table.table + 1);
};

// 'type:value' keys used for chips on the board.
export const rouletteSpotKey = (spot) => spot.type + ':' + spot.value;
export const rouletteSpotFromKey = (key) => {
    const [type, raw] = key.split(':');
    return { type: type, value: ['number', 'dozen', 'column'].includes(type) === true ? Number(raw) : raw };
};
