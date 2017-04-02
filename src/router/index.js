import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/views/Hello'

// import the vue views to render as views
import Login from '@/views/Login'
import Stands from '@/views/Stands'
import Clients from '@/views/Clients'
import Finances from '@/views/Finances'
import Client from '@/views/Client'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: Hello
    },
    {
      path: '/Clients',
      component: Clients,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/Clients/:id',
      component: Client,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/stands',
      component: Stands
    },
    {
      path: '/finances',
      component: Finances
    }
  ]
})
