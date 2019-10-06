<template>
  <div>
    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane v-for="name in tabs" :label="tabName(name)" :name="name" :key="name">
        <!-- <div class="swagger-title">{{reqMethod.summary}}</div> -->
        <el-divider>请求</el-divider>
        <tc-form label-width="150px" size="small">
           <el-row>
            <el-col :span="12">
              <tc-form-item label="请求地址">
                <tc-input v-model="methodForm.requestPath" readonly />
              </tc-form-item>
            </el-col>
            <el-col :span="12">
              <tc-form-item label="请求方式">
                <tc-input :value="activeName" readonly />
              </tc-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <tc-form-item label="响应Content-Type">
                <tc-select v-model="methodForm.contentType" :providers="producesProviders" />
              </tc-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <div style="margin-bottom:10px;margin-top:10px;">
                <tc-button type="think" @click="addParam" size="small">新增</tc-button>
              </div>
              <tc-edit-tree-table row-key="name" editmode="multi" :data="parameters" :columns="paramColumn">
                <template slot="editable" slot-scope="{ value, columnName, rowData, column, scope }"> 
                  <div v-if="columnName === 'value'">
                    <tc-input v-model="scope.row[columnName]" type="text" clearable size="mini"></tc-input>
                  </div>
                </template>
              </tc-edit-tree-table>
            </el-col>
          </el-row>
          <el-row style="margin-top:20px;text-align:center;">
            <el-col>
              <tc-button type="think" size="small" @click="sendRequest">试一试</tc-button>
              <tc-button type="think" size="small" @click="fillData">填充数据</tc-button>
              <tc-button type="think" size="small" @click="resetData">重置</tc-button>
            </el-col>
          </el-row>
        </tc-form>
        <el-divider>响应</el-divider>
        <tc-block>
          <json-viewer v-if="responseResult"
            :value="responseResult"
            :expand-depth=5
            copyable
            boxed
            sort></json-viewer>
        </tc-block>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { isEmpty } from 'tennetcn-ui/lib/utils'
import swaggerService from '@/api/swagger'
import jsonViewer from 'vue-json-viewer'
import mock from 'mockjs'

export default {
  components: { jsonViewer },
  data() {
    return {
      activeName: '',
      methodForm: {
        requestProtocol: 'http://',
        contentType: null,
        requestPath: this.$route.query.path,
        requestMethod: this.activeName
      },
      responseResult: null,
      paramColumn: [
        { text: '是否启用', name: 'open', width: '100', align: 'left', editable: true, type: 'checkbox' },
        { text: '参数', name: 'name', width: '180', editable: true },
        { text: '值', name: 'value', editable: true, type: 'input' },
        { text: '描述', name: 'description', width: '180' },
        { text: '是否必填', name: 'required', width: '80' },
        { text: '参数类型', name: 'in', width: '120' },
        { text: '数据类型', name: 'type', width: '120' }
      ],
      customParamItem: {
        disabled: null,
        in: 'query',
        name: '',
        editable: true,
        open: true,
        required: false,
        type: 'string'
      },
      customParam: []
    }
  },
  mounted() {
  },
  watch: {
    '$route.query.path': function(newVal) {
      this.methodForm.requestPath = newVal
      this.responseResult = null
    },
    'activeName': function(newVal) {
      this.methodForm.requestMethod = newVal
    }
  },
  computed: {
    ...mapGetters([
      'menus',
      'swaggerInfo'
    ]),
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
      params.forEach(item => {
        this.$set(item, 'open', true)
        this.$set(item, 'editable', false)

        this.calcComplexParam(item)
      })
      console.log(params, 'params')
      return params.concat(this.customParam)
    }
  },
  methods: {
    calcComplexParam(item) {
      // 是复杂属性
      if (!isEmpty(item.schema) && !isEmpty(item.schema.$ref)) {
        const ref = this.getDefinName(item.schema.$ref)
        const children = []
        const refDefin = this.swaggerInfo.definitions[ref]
        console.log(refDefin, 'refDefin')
        for (var key in refDefin.properties) {
          const childItem = {open: true, name: key}
          const refProperty = refDefin.properties[key]
          // 递归计算
          this.loopCalcComplexParam(refProperty, childItem)

          children.push(childItem)
        }
        this.$set(item, 'children', children)
      }
    },
    loopCalcComplexParam(parentRefProperty, parentItem) {
      if (!isEmpty(parentRefProperty.$ref)) {
        const ref = this.getDefinName(parentRefProperty.$ref)
        const children = []
        const refDefin = this.swaggerInfo.definitions[ref]

        for (var key in refDefin.properties) {
          const childItem = {open: true, name: key, type: refDefin.properties[key].type}
          const refProperty = refDefin.properties[key]
          // 继续计算子级
          this.loopCalcComplexParam(refProperty, childItem)

          children.push(childItem)
        }
        parentItem.children = children
      }
    },
    getDefinName(refFull) {
      return refFull.replace('#/definitions/', '')
    },
    addParam() {
      this.customParam.push(Object.assign({}, this.customParamItem))
    },
    tabName(name) {
      const reqMethod = this.menuInfo.reqMethod[name] || {}
      return reqMethod.summary + '-' + name
    },
    sendRequest() {
      const requestUrl = this.methodForm.requestProtocol + this.swaggerInfo.host + this.methodForm.requestPath
      const method = this.methodForm.requestMethod
      var requestData = {}
      this.parameters.forEach(item => {
        if (item.open && !isEmpty(item.name)) {
          requestData[item.name] = item.value === undefined ? null : item.value
        }
      })
      swaggerService.sendRequest(method, requestUrl, requestData).then(result => {
        this.responseResult = result.data
      })
    },
    fillData() {
      const random = mock.Random
      this.parameters.forEach(item => {
        if (isEmpty(item.name)) {
          return true
        }
        if (item.type === 'string') {
          this.$set(item, 'value', random.word(1, 10))
        } else if (item.type === 'integer' || item.type === 'int') {
          this.$set(item, 'value', random.integer(1, 99))
        }
      })
    },
    resetData() {
      this.customParam = []
      this.parameters.forEach(item => {
        this.$set(item, 'value', '')
      })
    }
  }

}
</script>

<style lang="scss">
.jv-node {
  span.jv-toggle.open{
    transform: rotate(90deg) !important;
  }
}
</style>