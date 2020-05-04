import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import ExerciseManager from '@/components/ExerciseManager'
import Auth from '@okta/okta-vue'

Vue.use(Auth, {
  issuer: process.env.OKTA_ISSUER,
  client_id: process.env.OKTA_CLIENT_ID,
  redirect_uri: 'http://localhost:8080/implicit/callback',
  scope: 'openid profile email'
})

Vue.use(Router)

let router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: Hello
    },
    {
      path: '/implicit/callback',
      component: Auth.handleCallback()
    },
    {
      path: '/exercise-manager',
      name: 'ExerciseManager',
      component: ExerciseManager,
      meta: {
        requiresAuth: true
      }
    }
  ]
})

router.beforeEach(Vue.prototype.$auth.authRedirectGuard())

export default router
