import store from '@/store'

/*
*{name:name,desc:desc,children:[{path:'/login',reqMethod:[]}]}
*/

const resolveMenu = function() {
  var menus = []
  const swaggerInfo = store.getters.swaggerInfo
  console.log(swaggerInfo, 'swaggerInfo')

  const paths = swaggerInfo.paths
  var tagMap = {}
  Array.from(Object.keys(paths)).forEach(path => {
    const reqMethod = paths[path]
    var children = []
    children.push({path: path, reqMethod: reqMethod})

    const firstTag = reqMethod[Object.keys(reqMethod)[0]].tags[0]
    tagMap[firstTag] = (tagMap[firstTag] || []).concat(children)

  })

  Array.from(swaggerInfo.tags).forEach(tag => {
    const menu = Object.assign({}, tag, {children: tagMap[tag.name]})
    menus.push(menu)
  })
  store.commit('menus', menus)
}

export { resolveMenu }
