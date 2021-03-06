import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/views/Hello'

// import the vue views to render as views
import Login from '@/views/Login'
import Stands from '@/views/stands/Index'
import Clients from '@/views/Clients'
import Finances from '@/views/finances/Index'
import History from '@/views/finances/History'
import Summary from '@/views/finances/Summary'
import Client from '@/views/Client'
import AllStands from '@/views/stands/All'
import AvailableStands from '@/views/stands/Available'
import ReservedStands from '@/views/stands/Reserved'
import SoldStands from '@/views/stands/Sold'
import Map from '@/views/Map'

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
      component: Finances,
      children: [
        {
          path: '',
          component: History
        },
        {
          path: 'summary',
          component: Summary
        }
      ]
    },
    {
      path: '/map',
      component: Map
    }
  ]
})
