import Vue from 'vue'
import Router from 'vue-router'

import Home from '../views/Home/Home.vue';
// import Budget from '@/views/Budget'

Vue.use(Router);

export default new Router({
  mode: 'hash',
  routes: [
    {
      path: '*',
      redirect: {name: 'home'}
    },
    {
      path: '/home/:profile?/:structure?/:nodeId?',
      name: 'home',
      component: Home
    },
    // {
    //   path: '/budget/:profile/:structure/:nodeId/:type/:concept',
    //   name: 'budget',
    //   component: Budget
    // }
  ]
});
