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
              <tc-edit-table editmode="multi" :data="parameters" :columns="paramColumn" />
            </el-col>
          </el-row>
          <el-row style="margin-top:20px;text-align:center;">
            <el-col>
              <tc-button type="think" size="small" @click="sendRequest">试一试</tc-button>
            </el-col>
          </el-row>
        </tc-form>
        <el-divider>响应</el-divider>
        <tc-block>
          {{responseResult}}
        </tc-block>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { isNull } from 'tennetcn-ui/lib/utils'
import swaggerService from '@/api/swagger'
export default {
  data() {
    return {
      activeName: '',
      methodForm: {
        requestProtocol: 'http://',
        contentType: null,
        requestPath: this.$route.query.path,
        requestPathMethod: this.activeName
      },
      responseResult: null,
      paramColumn: [
        { text: '参数', name: 'name', width: '180' },
        { text: '值', name: 'value', editable: true, type: 'input' },
        { text: '描述', name: 'description' },
        { text: '是否必填', name: 'required', width: '80' },
        { text: '参数类型', name: 'type', width: '120' },
        { text: '数据类型', name: 'dataType', width: '120' }
      ]
    }
  },
  mounted() {
  },
  watch: {
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
      if (isNull(produces)) {
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
      return this.reqMethod.parameters || []
    }
  },
  methods: {
    tabName(name) {
      const reqMethod = this.menuInfo.reqMethod[name] || {}
      return reqMethod.summary + '-' + name
    },
    sendRequest() {
      const requestUrl = this.methodForm.requestProtocol + this.swaggerInfo.host + this.methodForm.requestPath
      var requestData = {}
      this.parameters.forEach(item => {
        requestData[item.name] = item.value === undefined ? null : item.value
      })
      swaggerService.sendRequest(requestUrl, requestData).then(result => {
        this.responseResult = result
      })
    }
  }

}
</script>

<style lang="scss" scoped>

</style>