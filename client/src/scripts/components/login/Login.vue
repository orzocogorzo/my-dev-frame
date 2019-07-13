<template>
  <div id="login" class="view">
    <div class="view-wrapper">
      <div class="view-section left-col">
        <welcome-section/>
      </div>
      <div class="view-section right-col">
        <login-section v-on:logged="broadcastLogged"/>
      </div>
    </div>
    <cookies-panel></cookies-panel>
  </div>
</template>

<script>
import LoginSection from "./LoginSection.vue";
import WelcomeSection from "./WelcomeSection.vue";
import CookiesPanel from "../CookiesPanel.vue";

export default {
  name: "Login",
  data() {
    return {};
  },
  components: {
    LoginSection,
    WelcomeSection,
    CookiesPanel
  },
  methods: {
    broadcastLogged() {
      this.$emit("logged");
    }
  }
};
</script>

<style lang="stylus">
.view
  display: flex
  height: 100%
  width: 100%

.view-wrapper
  display: flex
  height: 100%
  width: 100%

  +m-breakpoint(sm xmd)
    display: block
    height: auto
    overflow-y: auto

.view-section
  background-color: #fff
  display: flex
  flex: 1 1 0
  padding: 2.5vw 5vw

  +m-breakpoint(sm xmd)
    padding: 5vw

  &.left-col
    background-color: $primary-theme-color

    +m-breakpoint(sm xmd)
      height: 50%

  &.right-col
    +m-breakpoint(sm xmd)
      height: 50%

.v-viewport
  .view-wrapper
    flex-direction: column
</style>
