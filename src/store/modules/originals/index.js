// Plinko, dice and flip. The server settles each bet instantly, but the balance
// shown to the player only gets the payout once the animation has landed, so the
// result is never spoiled by the balance ticking up early.

const state = {
    originalsConfig: null,
    originalsPending: 0,
    originalsServerBalance: null
}

const getters = {
    originalsConfig: state => state.originalsConfig
}

const mutations = {
    originals_set_config(state, config) {
        state.originalsConfig = config;
    },
    originals_add_pending(state, amount) {
        state.originalsPending = state.originalsPending + amount;
    },
    originals_set_server_balance(state, balance) {
        state.originalsServerBalance = balance;
    }
}

const actions = {
    originalsSocketInit({ commit }, data) {
        commit('originals_set_config', data.config);
    },
    // Resolves with the settled game, or null if the bet was refused.
    originalsSendBetSocket({ state, getters, commit, dispatch }, data) {
        return new Promise((resolve) => {
            if(getters.socketOriginals === null) { resolve(null); return; }

            getters.socketOriginals.emit('sendBet', data, (res) => {
                if(res.success === true) {
                    commit('originals_add_pending', res.game.payout);
                    commit('originals_set_server_balance', res.user.balance);
                    commit('auth_update_user', { ...res.user, balance: res.user.balance - state.originalsPending });
                    resolve(res.game);
                } else {
                    dispatch('notificationShow', res.error);
                    resolve(null);
                }
            });
        });
    },
    // Called by the game once its animation for `game` has finished.
    originalsSettle({ state, getters, commit }, game) {
        commit('originals_add_pending', -game.payout);
        if(getters.authUser.user !== null && state.originalsServerBalance !== null) {
            commit('auth_update_user', { ...getters.authUser.user, balance: state.originalsServerBalance - state.originalsPending });
        }
    },
    // Leaving the game mid-animation: show the real balance straight away.
    originalsFlush({ state, getters, commit }) {
        if(state.originalsPending !== 0 && getters.authUser.user !== null && state.originalsServerBalance !== null) {
            commit('auth_update_user', { ...getters.authUser.user, balance: state.originalsServerBalance });
        }
        commit('originals_add_pending', -state.originalsPending);
    }
}

const originals = {
    state,
    mutations,
    actions,
    getters
}

export default originals;
