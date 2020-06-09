import { isEmpty, isEmptyObject } from 'tennetcn-ui/lib/utils'
export default {
  data() {
    return {
      methodForm: {
        requestProtocol: 'http://',
        contentType: null,
        requestPath: this.$route.query.path,
        requestMethod: this.activeName
      },
      responseResult: null,
      paramColumn: [
        { text: '启用', name: 'open', width: '60', editable: true, type: 'checkbox' },
        { text: '参数', name: 'name', width: '180', editable: true },
        { text: '值', name: 'value', editable: true, type: 'input' },
        { text: '描述', name: 'description', width: '180' },
        { text: '是否必填', name: 'required', width: '80' },
        { text: '参数类型', name: 'in', width: '120' },
        { text: '数据类型', name: 'type', width: '120' }
      ],
      simpleParamColumn: [
        { text: '启用', name: 'open', width: '50', editable: true, type: 'checkbox' },
        { text: '参数', name: 'name', width: '120', editable: true },
        { text: '值', name: 'value', editable: true, type: 'input' },
        { text: '描述', name: 'description', width: '120' },
        { text: '必填', name: 'required', width: '50' },
        { text: '参数类型', name: 'in', width: '80' },
        { text: '数据类型', name: 'type', width: '80' }
      ],
      customParamItem: {
        category: 'custom',
        disabled: null,
        in: 'query',
        name: '',
        editable: true,
        open: true,
        required: false,
        type: 'string'
      },
      customParam: [],
      responseTimeInfo: {
        requestTime: null,
        responseTime: null,
        diffTime: null
      }
    }
  },
  computed: {
    columns: function() {
      if (this.theme === 'admin') {
        return this.paramColumn
      } else if (this.theme === 'simple') {
        return this.simpleParamColumn
      }
    },
    menuInfo() {
      if (this.menus === null) {
        return null
      }
      const parentMenu = this.menus[this.$route.query.pindex]
      if (parentMenu === null) {
        return null
      }
      return parentMenu.children[this.$route.query.index]
    },
    tabs() {
      if (this.menuInfo === null) {
        return []
      }
      const reqMethod = this.menuInfo.reqMethod
      const tabs = Object.keys(reqMethod)

      this.activeName = tabs[0]
      return tabs
    },
    reqMethod() {
      if (this.menuInfo === null) {
        return {}
      }
      return this.menuInfo.reqMethod[this.activeName] || {}
    },
    producesProviders() {
      const produces = this.reqMethod.produces
      if (isEmpty(produces)) {
        return []
      }

      return produces.map((item, index) => {
        if (index === 0) {
          this.methodForm.contentType = item
        }
        return { text: item, value: item, id: index }
      })
    },
    parameters() {
      let params = (this.reqMethod.parameters || [])
      this.isPostJson = false
      params.forEach(item => {
        this.$set(item, 'open', true)
        this.$set(item, 'editable', false)
        if (!isEmpty(item.schema) && !isEmpty(item.schema.$ref)) {
          item.type = 'json'
          this.isPostJson = true
          this.$set(item, 'value', JSON.stringify(this.calcComplexParam(item), null, '  '))
        }
      })
      return params.concat(this.customParam)
    }
  },
  methods: {
    calcComplexParam(item) {
      var result = {}
      // 是复杂属性
      if (!isEmpty(item.schema) && !isEmpty(item.schema.$ref)) {
        console.log(item.schema, 'item.schema')
        const ref = this.getDefinName(item.schema.$ref)
        const refDefin = this.swaggerInfo.definitions[ref]
        for (var key in refDefin.properties) {
          const refProperty = refDefin.properties[key]
          if (refProperty.type === 'array') {
            var childArr = []
            this.loopCalcComplexParamArr(refProperty, childArr)
            result[key] = childArr
          } else {
            var childObj = {}
            // 递归计算
            this.loopCalcComplexParam(refProperty, childObj)

            result[key] = isEmptyObject(childObj) ? '' : childObj
          }
        }
      }
      return result
    },
    loopCalcComplexParam(parentRefProperty, parentObj) {
      if (!isEmpty(parentRefProperty.$ref)) {
        const ref = this.getDefinName(parentRefProperty.$ref)
        const refDefin = this.swaggerInfo.definitions[ref]

        for (var key in refDefin.properties) {
          const refProperty = refDefin.properties[key]
          if (refProperty.type === 'array') {
            var childArr = []
            this.loopCalcComplexParamArr(refProperty, childArr)
            parentObj[key] = childArr
          } else {
            var childObj = {}
            // 继续计算子级
            this.loopCalcComplexParam(refProperty, childObj)

            parentObj[key] = isEmptyObject(childObj) ? '' : childObj
          }
        }
      }
    },
    loopCalcComplexParamArr(parentRefProperty, parentArr) {
      if (isEmpty(parentRefProperty.items.$ref)) {
        if (parentRefProperty.items.type === 'string') {
          parentArr.push('')
        } else {
          parentArr.push([])
        }
      } else {
        const ref = this.getDefinName(parentRefProperty.items.$ref)
        const refDefin = this.swaggerInfo.definitions[ref]
        var obj = {}
        for (let key in refDefin.properties) {
          obj[key] = ''
        }
        parentArr.push(obj)
      }
    },
    getDefinName(refFull) {
      return refFull.replace('#/definitions/', '')
    },
    tabName(name) {
      const reqMethod = this.menuInfo.reqMethod[name] || {}
      return reqMethod.summary + '-' + name
    }
  }
}
