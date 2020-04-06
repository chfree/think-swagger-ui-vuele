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
                <tc-button v-if="!isPostJson" type="think" @click="addParam" size="small">新增</tc-button>
              </div>
              <tc-edit-table editmode="multi" :data="parameters" :columns="columns">
                <template slot="editable" slot-scope="{ value, columnName, rowData, column, scope }"> 
                  <div v-if="columnName === 'value'">
                    <div v-if="rowData.type === 'json'">
                      <tc-button type="think" size="mini" @click="formatJson(value)">格式化编辑</tc-button>
                      <tc-input :rows="8" v-model="scope.row[columnName]" type="textarea" style="margin-top:5px;" clearable size="mini"></tc-input>
                    </div>
                    <tc-input v-else v-model="scope.row[columnName]" type="text" clearable size="mini"></tc-input>
                  </div>
                  <div v-else-if="columnName === 'name'">
                    <tc-input v-if="rowData['category'] === 'custom'" v-model="scope.row[columnName]" type="text" clearable size="mini"></tc-input>
                    <span v-else>{{value}}</span>
                  </div>
                </template>
              </tc-edit-table>
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
          <el-row>
            <el-col :span="3">
              请求时间
            </el-col>
            <el-col :span="5">
              <span>{{responseTimeInfo.requestTime}}</span>
            </el-col>
            <el-col :span="3">
              响应时间
            </el-col>
            <el-col :span="5">
              <span>{{responseTimeInfo.responseTime}}</span>
            </el-col>
            <el-col :span="3">
              相差毫秒
            </el-col>
            <el-col :span="5">
              <span>{{responseTimeInfo.diffTime}}</span>
            </el-col>
          </el-row>
        </tc-block>
        <tc-block style="margin-top:5px;">
          <json-viewer v-if="responseResult"
            :value="responseResult"
            :expand-depth=5
            copyable
            boxed
            sort></json-viewer>
        </tc-block>
      </el-tab-pane>
    </el-tabs>
    <tc-dialog loading title="编辑json" :visible.sync="jsonEditForm.show" width="800px" height="600px">
      <jsonedit :json="jsonEditForm.json" @save-json="saveJson"/>
    </tc-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { isEmpty } from 'tennetcn-ui/lib/utils'
import swaggerService from '@/api/swagger'
import jsonViewer from 'vue-json-viewer'
import mock from 'mockjs'
import jsonedit from './jsonedit'

export default {
  components: { jsonViewer, jsonedit },
  data() {
    return {
      jsonEditForm: {
        show: false,
        json: null
      },
      isPostJson: false,
      activeName: '',
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
  mounted() {
  },
  watch: {
    '$route.query.path': function(newVal) {
      this.methodForm.requestPath = newVal
      this.responseResult = null
      this.customParam = []
      this.resetResponseTime()
    },
    'activeName': function(newVal) {
      this.methodForm.requestMethod = newVal
      this.resetResponseTime()
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
    ...mapGetters([
      'menus',
      'swaggerInfo',
      'theme'
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
      this.isPostJson = false
      params.forEach(item => {
        this.$set(item, 'open', true)
        this.$set(item, 'editable', false)
        if (!isEmpty(item.schema) && !isEmpty(item.schema.$ref)) {
          item.type = 'json'
          this.isPostJson = true

          this.$set(item, 'value', JSON.stringify(this.calcComplexParam(item)))
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

            result[key] = this.isEmptyObject(childObj) ? '' : childObj
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

            parentObj[key] = this.isEmptyObject(childObj) ? '' : childObj
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
    resetResponseTime() {
      this.responseTimeInfo.requestTime = null
      this.responseTimeInfo.responseTime = null
      this.responseTimeInfo.diffTime = null
    },
    formatJson(json) {
      this.jsonEditForm.json = json
      this.jsonEditForm.show = true
    },
    saveJson(json) {
      console.log('json', json)
      this.$set(this.parameters[0], 'value', JSON.stringify(json))
      this.jsonEditForm.show = false
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
      const basePath = this.swaggerInfo.basePath === '/' ? '' : this.swaggerInfo.basePath
      const requestUrl = this.methodForm.requestProtocol + this.swaggerInfo.host + basePath + this.methodForm.requestPath
      var method = this.methodForm.requestMethod
      var requestData = {}
      if (this.isPostJson) {
        method = 'postJson'
        requestData = JSON.parse(this.parameters[0].value)
      } else {
        this.parameters.forEach(item => {
          if (item.open && !isEmpty(item.name)) {
            requestData[item.name] = item.value === undefined ? null : item.value
          }
        })
      }
      const reqData = new Date()
      this.responseTimeInfo.requestTime = this.$moment.formatDateTime(reqData)
      swaggerService.sendRequest(method, requestUrl, requestData).then(result => {
        const respData = new Date()
        this.responseTimeInfo.responseTime = this.$moment.formatDateTime(respData)
        this.responseTimeInfo.diffTime = respData.getTime() - reqData.getTime()
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
      this.responseResult = null
      this.resetResponseTime()
    },
    isEmptyObject(e) {
      var t
      for (t in e) {
        return !1
      }
      return !0
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
.jv-container .jv-code {
  overflow: auto;
}
</style>