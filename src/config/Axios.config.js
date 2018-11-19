import axios from 'axios';

//拦截请求
axios.interceptors.request.use(function(config){
  const path = config.url.startsWith('/') ? config.url : `/${config.url}`
  const host = ''
  const url = `${host}${path}`
  config.url = url;
  return config
})

//拦截响应
axios.interceptors.response.use(function(config){
  return config
})