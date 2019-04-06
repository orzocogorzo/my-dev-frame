import Vue from 'vue';

import App from './App.vue';
import Login from './views/login/Login.vue';
import EventBus from './bus/EventBus.js';

import store from './store/index.js';
import router from './router/index.js';
// import PWA from './pwa/index.js';

import Lng from './lng/index.js';new Lng().bind(Vue);
import resizeListener from './helpers/resizeListener.js';new resizeListener().bind(Vue);
import HttpClient from './http/client/index.js';new HttpClient().bind(Vue);

window.globalEventBus = new EventBus({
  onVideo: false,
  onMobile: false,
  isPortrait: false,
  isPhoneFormat: false
});

export function startApp () {
  // const pwa = new PWA();
  new Vue({
    el: '#modal',
    store,
    components: {
      Modal
    },
    template: '<modal/>'
  });
  new Vue({
    el: '#app',
    store,
    // pwa: pwa,
    data () {
      return {
        loading: true,
        loader: document.getElementById('loader')
      };
    },
    components: {
      Login,
      Modal
    },
    template: '<div id="app"><login v-on:logged="startApp"/></div>',
    watch: {
      loading (val) {
        if (val) {
          this.loader.style.display = "flex";
          this.loader.style.opacity = '1';
        } else {
          setTimeout(() => {
            this.loader.style.opacity = '0';
            setTimeout(() => {
              this.loader.style.display = "none";
            }, 500);
          }, 1000);
        }
      }
    },
    beforeMount () {
      if (document.cookie.match(/logged-cookie=[^;]/)) {
        const userCredentials = document.cookie.match(/logged-cookie=([^;]+)/)[1];

        Promise.all([
          this.$store.dispatch('users/login', {userCredentials: userCredentials}),
          this.$store.dispatch('statics/config')
        ]).then(_ => {
          if (this.$store.getters['users/logged']) {
            this.startApp();
          } else {
            this.loader.style.display = "none";
          }
        }).catch(err => {
          console.error(err);
          console.log('error catched on the trackline status request');
        });
      } else {
        Promise.all([
          this.$store.dispatch('statics/config')
        ]).then(_ => {
          this.loading = false;
        });
      }
      // this.loading = false;
    },
    methods: {
      startApp () {
        const self = this;
        // moment.locale('en');
        // moment.updateLocale('en', { week: { dow: 1 }})
        this.loading = true;
        setTimeout(() => {
          new Vue({
            el: '#app',
            store,
            router,
            components: { App },
            template: '<App/>',
            created () {
              const loginSection = document.getElementById('login');
              loginSection.parentNode.removeChild(loginSection);
              self.loading = false;
            }
          });
        }, 0);
      }
    }
  });
}