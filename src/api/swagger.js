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

        resolveMenu()
      }
      resolve(result)
    })
  })
}

const swaggerService = {
  reqSwagger,
  reqAndResolveSwagger
}

export default swaggerService
