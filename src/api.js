import Vue from 'vue'
import axios from 'axios'

const client = axios.create({
  baseURL: 'http://localhost:8081',
  json: true
})

export default {
  async execute (method, resource, data) {
    let accessToken = await Vue.prototype.$auth.getAccessToken()
    return client({
      method,
      url: resource,
      data,
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }).then(req => {
      return req.data
    })
  },
  getExercises () {
    return this.execute('get', 'exercises')
  },
  getExercise (id) {
    return this.execute('get', `/exercises/${id}`)
  },
  updateExercise (id, data) {
    return this.execute('put', `/exercises/${id}`, data)
  },
  deleteExercise (id) {
    return this.execute('delete', `/exercises/${id}`)
  }
}
