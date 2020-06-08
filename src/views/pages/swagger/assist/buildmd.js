export default {
  data() {
    return {
    }
  },
  methods: {
    buildMd: function() {
      let arrMds = []

      const reqMethod = this.menuInfo.reqMethod[this.activeName] || {}
      arrMds.push('# ' + reqMethod.summary)
      arrMds.push('## 请求头')
      arrMds.push('### 请求地址')
      arrMds.push('### 请求方式')
      arrMds.push('### 响应Content-Type')
      arrMds.push('## 请求参数')

      arrMds.push('## 响应参数')

      return arrMds.join('<br/>')
    }
  }
}
