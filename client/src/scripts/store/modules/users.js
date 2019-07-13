import { users as API } from '../../http/axios/modules/users.js/index.js';

const state = { 
  login: false,
  credentials: null
}

const mutations = {
  login (state, status) {
    state.login = status;
  },
  credentials (state, credentials) {
    state.credentials = credentials;
    if (credentials) {
      state.login = true;
    }
  }
}

const getters = {
  login (state) {
    return state.login || false;
  },
  credentials (state) {
    return state.login && state.credentials || null;
  }
}

const actions = {
  login (context, credentials) {
    return API().login(credentials)
      .then(res => {
        if (res.data.success) {
          context.commit('credentials', res.data.body);
        }
      }).catch(err => {
        console.log('error while trying to indentify user');
        console.error(err);
      });
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
