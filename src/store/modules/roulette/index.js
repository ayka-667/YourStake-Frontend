// Turns the server's time-left into a local deadline for the countdown.
const stamp = (game) => (game === null || game === undefined ? null : { ...game, endsLocal: Date.now() + (game.remaining || 0) });
const stampTable = (table) => ({ ...table, game: stamp(table.game) });

const state = {
    rouletteTables: [],
    rouletteLimits: null,
    // Full state of the table being watched: { table, type, game, bets }
    rouletteTable: null
}

const getters = {
    rouletteTables: state => state.rouletteTables,
    rouletteLimits: state => state.rouletteLimits,
    rouletteTable: state => state.rouletteTable
}

const mutations = {
    roulette_set_tables(state, data) {
        state.rouletteTables = data.tables.map(stampTable);
        state.rouletteLimits = data.limits;
    },
    roulette_update_table(state, table) {
        const index = state.rouletteTables.findIndex((element) => element.table === table.table);
        if(index >= 0) { state.rouletteTables.splice(index, 1, stampTable(table)); }
    },
    roulette_set_table(state, table) {
        state.rouletteTable = table === null ? null : stampTable(table);
    },
    roulette_set_game(state, game) {
        if(state.rouletteTable === null) { return; }
        if(game.state === 'created' && (state.rouletteTable.game === null || state.rouletteTable.game._id !== game._id)) { state.rouletteTable.bets = []; }
        state.rouletteTable.game = stamp(game);
    },
    roulette_add_bet(state, bet) {
        if(state.rouletteTable === null || state.rouletteTable.bets.some((element) => element._id === bet._id)) { return; }
        state.rouletteTable.bets.push(bet);
    }
}

const actions = {
    rouletteSocketInit({ getters, commit, dispatch }, data) {
        commit('roulette_set_tables', data);

        // Rejoin the watched table after a reconnect
        if(getters.rouletteTable !== null) { dispatch('rouletteJoinTable', getters.rouletteTable.table); }
    },
    rouletteSocketTable({ commit }, data) {
        commit('roulette_update_table', data.table);
    },
    rouletteSocketGame({ getters, commit }, data) {
        if(getters.rouletteTable !== null && getters.rouletteTable.table === data.table) { commit('roulette_set_game', data.game); }
    },
    rouletteSocketBet({ getters, commit }, data) {
        if(getters.rouletteTable !== null && getters.rouletteTable.table === data.table) { commit('roulette_add_bet', data.bet); }
    },
    rouletteJoinTable({ getters, commit, dispatch }, table) {
        return new Promise((resolve) => {
            getters.socketRoulette.emit('joinTable', { table: table }, (res) => {
                if(res.success === true) {
                    commit('roulette_set_table', res.table);
                } else {
                    dispatch('notificationShow', res.error);
                }
                resolve(res.success === true);
            });
        });
    },
    rouletteLeaveTable({ getters, commit }) {
        commit('roulette_set_table', null);
        if(getters.socketRoulette.connected === true) { getters.socketRoulette.emit('leaveTable'); }
    },
    rouletteSendBetSocket({ getters, commit, dispatch }, data) {
        return new Promise((resolve) => {
            if(getters.socketSendLoading !== null) { resolve(null); return; }
            commit('socket_set_send_loading', 'RouletteBet');

            getters.socketRoulette.emit('sendBet', data, (res) => {
                if(res.success === true) {
                    commit('auth_update_user', res.user);
                    commit('roulette_add_bet', res.bet);
                } else {
                    dispatch('notificationShow', res.error);
                }

                commit('socket_set_send_loading', null);
                resolve(res.success === true ? res.bet : null);
            });
        });
    }
}

const roulette = {
    state,
    mutations,
    actions,
    getters
}

export default roulette;
