import Vue from 'vue'
import Vuex from 'vuex'

import init from './modules/init.js'
// import nodes from './modules/nodes'
// import budgets from './modules/budgets'
// import data from './modules/data'

Vue.use(Vuex)

export default new Vuex.Store({
  debug: false, //process.env.NODE_ENV !== 'production',
  modules: {
    init
    // nodes,
    // budgets,
    // data
  }
})