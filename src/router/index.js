import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/views/Hello'

// import the vue views to render as views
import Login from '@/views/Login'
import Stands from '@/views/Stands'
import Clients from '@/views/Clients'
import Finances from '@/views/Finances'
import Client from '@/views/Client'
import AllStands from '@/views/AllStands'
import AvailableStands from '@/views/AvailableStands'
import ReservedStands from '@/views/ReservedStands'
import SoldStands from '@/views/SoldStands'

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
      component: Stands,
      children: [
        // UserHome will be rendered inside User's <router-view>
        // when /user/:id is matched
        {
          path: '',
          component: AllStands
        },
        {
          path: 'available',
          component: AvailableStands
        },
        {
          path: 'reserved',
          component: ReservedStands
        },
        {
          path: 'sold',
          component: SoldStands
        }
        // ...other sub routes
      ]

    },
    {
      path: '/finances',
      component: Finances
    }
  ]
})
