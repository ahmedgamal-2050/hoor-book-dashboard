// import router from '../../router'
const state = {
    displayNoti: false,
    message: "",
};

const getters = {
    Display: state => state.displayNoti,
    Message: state => state.message,
};

const actions = {
    showNotification({ commit }, message) {
        commit('showNotification', message)
        setTimeout(() => {
            commit('hideNotification')
        }, 5000);
    },

    hideNotification({ commit }) {
        commit('hideNotification')
    },

};

const mutations = {
    showNotification: (state, message) => {
        state.displayNoti = true
        state.message = message
    },

    hideNotification: (state) => {
        state.displayNoti = false
        state.message = ""
    },
};

export default {
    state,
    getters,
    actions,
    mutations,
}