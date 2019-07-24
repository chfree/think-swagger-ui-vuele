import request from '@/components/util/http/request'
import store from '@/store'
import { resolveMenu } from '@/router/menu.load'

function reqSwagger(url) {
  return new Promise(function(resolve, reject) {
    request.get(url, {}, response => {
      const result = response.data
      resolve(result)
    })
  })
}

function reqAndResolveSwagger(url) {
  return new Promise(function(resolve, reject) {
    reqSwagger(url).then(result => {
      if (result.swagger !== undefined) {
        window.sessionStorage.swaggerPath = url
        store.commit('swaggerPath', url)
        store.commit('swaggerInfo', result)

        const menus = resolveMenu()
        result['menus'] = menus
      }
      resolve(result)
    })
  })
}

function resolveSwagger(swaggerJson) {
  const result = JSON.parse(swaggerJson)
  return new Promise(function(resolve, reject) {
    if (result.swagger !== undefined) {
      store.commit('swaggerInfo', result)

      const menus = resolveMenu()
      result['menus'] = menus
    }
    resolve(result)
  })
}

const swaggerService = {
  reqSwagger,
  resolveSwagger,
  reqAndResolveSwagger
}

export default swaggerService
