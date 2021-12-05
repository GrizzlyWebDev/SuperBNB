import Vue from 'vue'
import VueRouter from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import Tracker from  '../views/Tracker.vue'
import Top from '../views/Top.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'SuperBNB Dashboard',
    component: Dashboard
  },
  {
    path: '/tracker',
    name: 'SuperBNB Tracker',
    component: Tracker
  },
  {
    path: '/topholders',
    name: 'SuperBNB Top Holders',
    component: Top
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to,from,next) => {
  document.title = to.name
  window.title = next.name
  next()
  })

export default router
