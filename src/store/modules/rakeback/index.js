
const state = {}

const getters = {}

const mutations = {}

const actions = {
    rakebackSendClaimSocket({ getters, commit, dispatch }, data) {
        if(getters.socketGeneral === null || getters.socketSendLoading !== null) { return; }
        commit('socket_set_send_loading', 'RakebackClaim');

        getters.socketGeneral.emit('sendRakebackClaim', data, (res) => {
            if(res.success === true) {
                commit('auth_update_user', res.user);
                
                dispatch('notificationShow', { type: 'success', message: 'You have successfully claimed your rakeback earnings.' });
            } else {
                dispatch('notificationShow', res.error);
            }

            commit('socket_set_send_loading', null);
        });
    }
}

const rakeback = {
    state,
    mutations,
    actions,
    getters
}

export default rakeback;
