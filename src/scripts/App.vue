<template>
  <div class="app-wrapper">
    <curtain :delta="600" :hexcolor="'#0A0A0A'" />
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
import Curtain from './helpers/Curtain.vue';

export default {
  name: "App",
  data() {
    return {}
  },
  components: {
    AppHeader,
    AppFooter,
    CookiesPanel,
    Curtain
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

  +m-breakpoint(sm xmd)
    flex-direction: column

  > .curtain
    width 100%
    max-width calc(100% - 200px)
    left auto

    +m-breakpoint(sm xmd)
      left 0px
      top $header-height
      width 100%
      max-width unset
      
</style>
