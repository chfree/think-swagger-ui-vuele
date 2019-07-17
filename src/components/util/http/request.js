import axios from 'axios'
import router from '@/router'

function getApiHost() {
  return '//localhost:8002'
}

const http = axios.create({
  timeout: 120000, // 请求超时时间
  baseURL: getApiHost(),
  withCredentials: true,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
  },
  transformRequest: [function(data) {
    let newData = ''
    for (const k in data) {
      if (data.hasOwnProperty(k) === true) {
        newData += encodeURIComponent(k) + '=' + encodeURIComponent(data[k]) + '&'
      }
    }
    return newData
  }]
})
http.interceptors.request.use(setConfig)

const httpJson = axios.create({
  timeout: 120000, // 请求超时时间
  baseURL: getApiHost(),
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  }
})
httpJson.interceptors.request.use(setConfig)

const httpFile = axios.create({
  timeout: 120000, // 请求超时时间
  baseURL: getApiHost(),
  withCredentials: true
})
httpFile.interceptors.request.use(setConfig)

function setConfig(config) {
  config.headers['ccb-token'] = window.sessionStorage.getItem('token')
  config.headers['Authorization'] = window.sessionStorage.getItem('token')
  config.baseURL = getApiHost()
  return config
}

function apiAxios(method, url, params, response) {
  if (!window.sessionStorage.token) {
    router.push({ name: 'login', path: '/' })
  }
  http({
    method: method,
    url: url,
    data: method === 'POST' || method === 'PUT' ? params : null,
    params: method === 'GET' || method === 'DELETE' ? params : null
  }).then(function(res) {
    if (commonResolve(res)) {
      response(res)
    } else {
      response(res)
    }
  }).catch(function(err) {
    response(err)
  })
}

function commonResolve(res) {
  if (res.status !== 200) {
    return false
  }
  res.data.ok = res.data.status === '000000000000'
  if (res.data.status !== '000000000000') {
    if (res.data.status === '999999999998') {
      router.push({ name: 'login', path: '/' })
    } else {
      var traceId = res.data.traceId
      if (traceId === null || traceId === undefined || traceId === '') {
        traceId = res.headers['c-business-id']
      }
    }
    return false
  }
  return true
}

function apiJsonAxios(method, url, params, response) {
  if (!window.sessionStorage.token) {
    router.push({ name: 'login', path: '/' })
  }
  httpJson({
    method: method,
    url: url,
    data: method === 'POST' || method === 'PUT' ? params : null,
    params: method === 'GET' || method === 'DELETE' ? params : null
  }).then(function(res) {
    if (commonResolve(res)) {
      response(res)
    } else {
      response(res)
    }
  }).catch(function(err) {
    response(err)
  })
}

function apiFileAxios(method, url, params, response, reject, onUploadCallback) {
  if (!window.sessionStorage.token) {
    router.push({ name: 'login', path: '/' })
  }
  httpFile({
    method: method,
    url: url,
    data: method === 'POST' || method === 'PUT' ? params : null,
    params: method === 'GET' || method === 'DELETE' ? params : null
    // 上传附件进度条报错:request.upload.addEventListener is not a function解决方案:
  // just add the code below to the file node_modules/mockjs/dist/mock.js at line 8308
  // MockXMLHttpRequest.prototype.upload = xhr.upload;
    // onUploadProgress: function(processEvent) {
    //   if (processEvent.lengthComputable) {
    //     if (onUploadCallback) {
    //       onUploadCallback(processEvent)
    //     }
    //   }
    // }
  }).then(function(res) {
    if (commonResolve(res)) {
      response(res)
    } else {
      reject(res)
    }
  }).catch(function(err) {
    reject(err)
  })
}

export default {
  get: function(url, params, response) {
    return apiAxios('GET', url, params, response)
  },
  post: function(url, params, response) {
    return apiAxios('POST', url, params, response)
  },
  put: function(url, params, response) {
    return apiAxios('PUT', url, params, response)
  },
  delete: function(url, params, response) {
    return apiAxios('DELETE', url, params, response)
  },
  postJson: function(url, params, response) {
    return apiJsonAxios('POST', url, params, response)
  },
  postFile: function(url, params, response, reject, onUploadCallback) {
    return apiFileAxios('POST', url, params, response, reject, onUploadCallback)
  },
  getApiHost: function() {
    return getApiHost()
  }
}
