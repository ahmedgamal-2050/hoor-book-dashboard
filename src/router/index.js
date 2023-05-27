import Vue from 'vue'
import VueRouter from 'vue-router'
// import Home from '../views/Home.vue'

function loadView(view) {
  return () => import(`@/views/${view}.vue`)
}

const axios = require('axios');
import { BASE_URL } from '../config/config'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: loadView('Home'),
    meta: { layout: 'default' },
    secure: true
  },
  {
    path: '/products',
    name: 'Products',
    component: loadView('Products'),
    meta: { layout: 'default' },
    secure: true
  },
  {
    path: '/colors',
    name: 'Colors',
    component: loadView('Colors'),
    meta: { layout: 'default' },
    secure: true
  },
  {
    path: '/categories',
    name: 'Categories',
    component: loadView('Categories'),
    meta: { layout: 'default' },
    secure: true
  },
  {
    path: '/coupons',
    name: 'Coupons',
    component: loadView('Coupons'),
    meta: { layout: 'default' },
    secure: true
  },
  {
    path: '/governorates',
    name: 'Governorates',
    component: loadView('Governorates'),
    meta: { layout: 'default' },
    secure: true
  },
  {
    path: '/cities',
    name: 'Cities',
    component: loadView('Cities'),
    meta: { layout: 'default' },
    secure: true
  },
  {
    path: '/areas',
    name: 'Areas',
    component: loadView('Areas'),
    meta: { layout: 'default' },
    secure: true
  },
  {
    path: '/orders',
    name: 'Orders',
    component: loadView('Orders'),
    meta: { layout: 'default' },
    secure: true
  },
  {
    path: '/shipping-companies',
    name: 'ShippingCompanies',
    component: loadView('ShippingCompanies'),
    meta: { layout: 'default' },
    secure: true
  },
  {
    path: '/users',
    name: 'Users',
    component: loadView('Users'),
    meta: { layout: 'default' },
    secure: true
  },
  {
    path: '/lookups',
    name: 'Lookups',
    component: loadView('Lookups'),
    meta: { layout: 'default' },
    secure: true
  },
  {
    path: '/roles',
    name: 'Roles',
    component: loadView('Roles'),
    meta: { layout: 'default' },
    secure: true
  },
  {
    path: '/chat',
    name: 'Chat',
    component: loadView('Chat'),
    meta: { layout: 'default' },
    secure: true
  },
  {
    path: '/blockedWords',
    name: 'BlockedWords',
    component: loadView('blockedWords'),
    meta: { layout: 'default' },
    secure: true
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
    secure: true
  },
  {
    path: '/auth/login',
    name: 'Login',
    component: loadView('auth/Login'),
    meta: { layout: "auth" },
    guest: true
  },
  {
    path: '/auth/forget-password',
    name: 'ForgetPassword',
    component: loadView('auth/ForgetPassword'),
    meta: { layout: "auth" },
    guest: true
  },
  {
    path: '*',
    name: '404',
    component: loadView('404'),
    meta: { layout: "auth" }
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  router.options.routes.forEach((route) => {
    // console.log("Token from router file", Vue.ls.get("token"));
    if (to.matched[0].path === route.path && route.secure || to.matched[0].path === "" && route.secure) {
      axios.defaults.headers.common["Authorization"] =
        "Bearer " + Vue.ls.get("token", null);
      axios.post(`${BASE_URL}admin/auth/me`)
        .then(res => {
          if (res) {
            console.log(res);
          }
        })
        .catch((e) => {
          if (e.response.status === 401 || e.response.status === 500) {
            Vue.ls.clear();
            return next('/auth/login');
          }
        })
    } else if (to.matched[0].path === route.path && route.guest || to.matched[0].path === "" && route.guest) {
      axios.defaults.headers.common["Authorization"] =
        "Bearer " + Vue.ls.get("token", null);
      axios.post(`${BASE_URL}admin/auth/me`)
        .then(res => {
          if (res) {
            console.log(res);
            return next('/');
          }
        })
        .catch((e) => {
          console.log(e.response.status);
          return next();
          // if (e.response.data.error == 'Unauthenticated.') {
          //   Vue.ls.remove("token");
          //   return next('/auth/login');
          // }
        })
    }
  });
  next()
})

export default router
