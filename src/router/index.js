import Vue from 'vue'
import Router from 'vue-router'
import routeConfig from './route.config'

Vue.use(Router)

const createRouter = () => new Router({
  scrollBehavior: () => ({ y: 0 }),
  routes: routeConfig
})

const router = createRouter()

export default router
