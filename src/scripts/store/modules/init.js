// Vuex uses a single state tree - that is, this single object contains all application level state and serves as the "single source of truth".
const state = { 
  data: {}
}

// The only way to actually change state in a Vuex store is by committing a mutation.
// Mutations are synchronous transactions. You can commit mutations in components with this.$store.commit('xxx')
const mutations = { 
  data (state, data) {
    state.data = data;
  }
}

// Vuex allows us to define "getters" in the store. You can think of them as computed properties for stores.
// Like computed properties, a getter's result is cached based on its dependencies, and will only re-evaluate when some of its dependencies have changed.
const getters = {
  data (state) {
    return state.data;
  }
}

// Actions are similar to mutations, the differences being that:
//    - Instead of mutating the state, actions commit mutations
//    - Actions can contain arbitrary asynchronous operations
const actions = {}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
