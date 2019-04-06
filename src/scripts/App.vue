<template>
  <div class="app-wrapper">
    <app-header/>
    <router-view/>
    <app-footer/>
    <div class="root-landscape-disclaimer" v-if="onMobile && !onVideo">{{lng("rotate-device")}}</div>
    <cookies-panel></cookies-panel>
  </div>
</template>

<script>
import AppHeader from './components/Header.vue';
import AppFooter from './components/Footer.vue';
import CookiesPanel from './components/CookiesPanel.vue';

export default {
  name: "App",
  data() {
    return {}
  },
  components: {
    AppHeader,
    AppFooter,
    CookiesPanel
  },
  computed: {
    onMobile () {
      return globalEventBus.onMobile
    },
    onVideo () {
      return globalEventBus.onVideo
    }
  }
}
</script>

<style lang="stylus">
.app-wrapper
  display: flex
  flex: 1
  flex-direction: column
  height: 100%
  overflow: hidden
  width: 100%

.root-landscape-disclaimer
  align-items: center
  background-color: #000
  color: #fff
  display: none
  height: 100%
  justify-content: center
  left: 0
  position: fixed
  text-align: center
  top: 0
  width: 100%
  z-index: 1502

  +m-breakpoint(landscape)
    display: flex
</style>
