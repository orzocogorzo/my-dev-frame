import Vue from 'vue';

import initService from './http/init.js';
import App from './App.vue';
import EventBus from './bus/EventBus.js';

import store from './store/index.js';
import router from './router/index.js';
import './lng/index.js';

export function startApp () {
  
  window.globalEventBus = new EventBus();

  initService.get()
  .then(res => {
    new Vue({
      el: '#app',
      bus: new EventBus(),
      store,
      router,
      components: { App },
      template: '<App/>',
      created () {
        this.$store.commit('init/data', res);
      }
    });
  }).catch(err => {
    console.log("error catched on the init request");
    console.error(err);
  });
}