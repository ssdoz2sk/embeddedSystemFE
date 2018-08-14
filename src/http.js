import axios from 'axios'

const http = {}

http.install = function (Vue, options) {
  Vue.prototype.$http = {
    setToken: function (token) {
      axios.defaults.headers.common['Authorization'] = `JWT ${token}`
    },
    login: function (username, password) {
      return axios.post('/api/login', {
        username: username,
        password: password
      })
    },
    getme: function () {
      return axios.get('/api/get-me')
    },
    getProjects: function () {
      return axios.get('/api/projects')
    },
    createProject: function (projectName, description = '') {
      return axios.post('/api/projects', {name: projectName, description: description})
    },
    getProjectDetail: function (projectId) {
      return axios.get(`/api/project/${projectId}`)
    },
    getDevices: function (projectId) {
      return axios.get('/api/devices', {params: {project: projectId}})
    },
    createDevice: function (deviceName, projectId, description = '') {
      return axios.post('/api/devices', {name: deviceName, project: projectId, description: description})
    },
    getDeviceDetail: function (deviceId) {
      return axios.get(`/api/device/${deviceId}`)
    },
    getSensorsByProject: function (projectId) {
      return axios.get('/api/sensors', {params: {project: projectId}})
    },
    getSensorsByDevice: function (deviceId) {
      return axios.get('/api/sensors', {params: {device: deviceId}})
    },
    createSensor: function (sensorsName, sensorsShowName, deviceId) {
      return axios.post('/api/sensors', {name: sensorsName, showname: sensorsShowName, device: deviceId})
    },
    getSensorDetail: function (sensorId) {
      return axios.get(`/api/sensor/${sensorId}`)
    },
    getDataBySensorId: function (sensorId) {
      return axios.get('/api/data', {params: {sensor: sensorId}})
    }
  }
}

export default http
