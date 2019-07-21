import store from '@/store'

const resolveMenu = function() {
  const swaggerInfo = store.getters.swaggerInfo
  console.log(swaggerInfo, 'swaggerInfo')
  Array.from(swaggerInfo.tags).each(tag => {
    console.log(tag)
  })
}

export { resolveMenu }
