const swagger = {
  state: {
    info: null,
    path: null
  },
  mutations: {
    swaggerPath: function(state, result) {
      state.path = result
    },
    swaggerInfo: function(state, result) {
      state.info = result
    }
  },
  actions: {
    path({ commit }, param) {
      commit('swaggerPath', param)
    },
    info({ commit }, param) {
      commit('swaggerInfo', param)
    }
  }
}

export default swagger
