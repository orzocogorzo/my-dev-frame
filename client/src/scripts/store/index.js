import Vue from 'vue'
import Vuex from 'vuex'

import users from './modules/users.js';

Vue.use(Vuex)

export default new Vuex.Store({
  debug: process.env.NODE_ENV !== 'production',
  modules: {
    users
  }
})