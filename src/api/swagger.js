import request from '@/components/util/http/request'

function reqSwagger(url) {
  return new Promise(function(resolve, reject) {
    request.get(url, {}, response => {
      console.log(response)
      resolve(response.data.arguments)
    })
  })
}

const swaggerService = {
  reqSwagger
}

export default swaggerService
