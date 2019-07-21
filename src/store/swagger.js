const swagger = {
  state: {
    info: null,
    path: null,
    menus: null
  },
  mutations: {
    swaggerPath: function(state, result) {
      state.path = result
    },
    swaggerInfo: function(state, result) {
      state.info = result
    },
    menus: function(state, result) {
      state.menus = result
    }
  },
  actions: {
    path({ commit }, param) {
      commit('swaggerPath', param)
    },
    info({ commit }, param) {
      commit('swaggerInfo', param)
    },
    menus({ commit }, param) {
      commit('menus', param)
    }
  }
}

export default swagger
