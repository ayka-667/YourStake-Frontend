import sfx from '@/utils/sfx';

const state = {
    minesGame: null
}

const getters = {
    minesGame: state => state.minesGame
}

const mutations = {
    mines_set_game(state, game) {
        state.minesGame = game;
    }
}

const actions = {
    minesClearGame({ commit }) {
        commit('mines_set_game', null);
    },
    minesSocketInit({ commit }, data) {
        commit('mines_set_game', data.game);
    },
    minesSendBetSocket({ getters, commit, dispatch }, data) {
        if(getters.socketMines === null || getters.socketSendLoading !== null) { return; }
        commit('socket_set_send_loading', 'MinesBet');

        getters.socketMines.emit('sendBet', data, (res) => {
            if(res.success === true) {
                commit('auth_update_user', res.user);
                if(getters.soundMines === 1) { sfx.chips(); }
                commit('mines_set_game', res.game);
            } else {
                dispatch('notificationShow', res.error);
            }

            commit('socket_set_send_loading', null);
        });
    },
    minesSendRevealSocket({ getters, commit, dispatch }, data) {
        if(getters.socketMines === null || getters.socketSendLoading !== null) { return; }
        commit('socket_set_send_loading', 'MinesReveal');

        getters.socketMines.emit('sendReveal', data, (res) => {
            if(res.success === true) {
                commit('mines_set_game', res.game);

                if(getters.soundMines === 1 && (res.game.state !== 'completed' || res.game.payout > 0)) {
                    sfx.gem((res.game.revealed || []).length - 1);
                    if(res.game.state === 'completed') { setTimeout(() => sfx.cashout(), 250); }
                } else if(getters.soundMines === 1) {
                    sfx.boom();
                    setTimeout(() => sfx.lose(), 350);
                }
            } else {
                dispatch('notificationShow', res.error);
            }

            commit('socket_set_send_loading', null);
        });
    },
    minesSendCashoutSocket({ getters, commit, dispatch }, data) {
        if(getters.socketMines === null || getters.socketSendLoading !== null) { return; }
        commit('socket_set_send_loading', 'MinesCashout');

        getters.socketMines.emit('sendCashout', data, (res) => {
            if(res.success === true) {
                commit('auth_update_user', res.user);
                if(getters.soundMines === 1) { sfx.cashout(); }
                commit('mines_set_game', res.game);
            } else {
                dispatch('notificationShow', res.error);
            }

            commit('socket_set_send_loading', null);
        });
    }
}

const mines = {
    state,
    mutations,
    actions,
    getters
}

export default mines;