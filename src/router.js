import Vue from 'vue';
import Router from 'vue-router';

import Home from './views/Home.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('./views/Login.vue'),
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('./views/Register.vue'),
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('./views/About.vue'),
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('./views/Profile.vue'),
    },
    {
      path: '/users',
      name: 'users',
      component: () => import('./views/Users.vue'),
    },
    {
      path: '/add-plugin',
      name: 'add-plugin',
      component: () => import('./views/Add-plugin.vue'),
    },
    {
      path: '/add-user',
      name: 'add-user',
      component: () => import('./views/Add-user.vue'),
    },
    {
      path: '/update-user',
      name: 'update-user',
      component: () => import('./views/Update-user.vue'),
    },
    {
      path: '/delete-user',
      name: 'delete-user',
      component: () => import('./views/Delete-user.vue'),
    },
    {
      path: '/blog',
      name: 'blog',
      component: () => import('./plugins/blog/views/Blog.vue'),
    },
    {
      path: '/add-blog',
      name: 'add-blog',
      component: () => import('./plugins/blog/views/Add-blog.vue'),
    },
    {
      path: '/update-blog',
      name: 'update-blog',
      component: () => import('./plugins/blog/views/Update-blog.vue'),
    },
    {
      path: '/delete-blog',
      name: 'delete-blog',
      component: () => import('./plugins/blog/views/Delete-blog.vue'),
    },
    {
      path: '/commerce',
      name: 'commerce',
      component: () => import('./plugins/commerce/views/Commerce.vue'),
    },
    {
      path: '/add-commerce',
      name: 'add-commerce',
      component: () => import('./plugins/commerce/views/Add-commerce.vue'),
    },
    {
      path: '/update-commerce',
      name: 'update-commerce',
      component: () => import('./plugins/commerce/views/Update-commerce.vue'),
    },
    {
      path: '/delete-commerce',
      name: 'delete-commerce',
      component: () => import('./plugins/commerce/views/Delete-commerce.vue'),
    },
    {
      path: '/buy-commerce',
      name: 'buy-commerce',
      component: () => import('./plugins/commerce/views/Buy-commerce.vue'),
    },
    {
      path: '/consult',
      name: 'consult',
      component: () => import('./plugins/consult/views/Consult.vue'),
    },
    {
      path: '/map-consult',
      name: 'map-consult',
      component: () => import('./plugins/consult/views/Map-consult.vue'),
    },
    {
      path: '/patient-consult',
      name: 'patient-consult',
      component: () => import('./plugins/consult/views/Patient-consult.vue'),
    },
    {
      path: '/doctor-consult',
      name: 'doctor-consult',
      component: () => import('./plugins/consult/views/Doctor-consult.vue'),
    },
    {
      path: '/supply',
      name: 'supply',
      component: () => import('./plugins/supply/views/Supply.vue'),
    },
    {
      path: '/add-supply',
      name: 'add-supply',
      component: () => import('./plugins/supply/views/Add-supply.vue'),
    },
    {
      path: '/report',
      name: 'report',
      component: () => import('./plugins/report/views/Report.vue'),
    },
    {
      path: '/account',
      name: 'account',
      component: () => import('./plugins/account/views/Account.vue'),
    },
    {
      path: '/add-account',
      name: 'add-account',
      component: () => import('./plugins/account/views/Add-account.vue'),
    },
    {
      path: '/update-account',
      name: 'update-account',
      component: () => import('./plugins/account/views/Update-account.vue'),
    },
    {
      path: '/delete-account',
      name: 'delete-account',
      component: () => import('./plugins/account/views/Delete-account.vue'),
    },
    {
      path: '/ledger',
      name: 'ledger',
      component: () => import('./plugins/account/views/Ledger.vue'),
    },
    {
      path: '/add-ledger',
      name: 'add-ledger',
      component: () => import('./plugins/account/views/Add-ledger.vue'),
    },
  ],
});
