import axios from 'axios'

axios.defaults.baseURL = ''
axios.defaults.headers.common['Authorization'] = window.sessionStorage.getItem('token')
axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*'
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8'
axios.defaults.withCredentials = true

const http = axios.create({
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

const httpJson = axios.create({
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  }
})

function apiAxios(method, url, params, success, error) {
  execRequest(http({
    method: method,
    url: url,
    data: method === 'POST' || method === 'PUT' ? params : null,
    params: method === 'GET' || method === 'DELETE' ? params : null
  }), success, error)
}

function apiJsonAxios(method, url, params, success, error) {
  execRequest(httpJson({
    method: method,
    url: url,
    data: params
  }), success, error)
}

function execRequest(httpRequest, success, error) {
  httpRequest.then(function(res) {
    success(res)
  }).catch(function(err) {
    if (error) {
      success(err)
    } else {
      error(err)
    }
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
  }
}
