import Vue from 'vue'
import Vuex from 'vuex'
import swagger from './swagger'
import getters from './getters'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    swagger
  },
  getters
})

export default store
