<template>
  <div v-if="show" class="cookies-panel">
    <div class="cookies-panel-left">
      <div class="cookies-panel-title">Política de Cookies</div>
      <p>I'm a cookies panel</p>
    </div>
    <div class="cookies-panel-right">
      <button
        @click="setCookie"
        class="cookies-panel-btn btn btn--primary btn--ghost"
      >Aceptar</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "CookiesPanel",
  data () {
    return {
      show: !Boolean(document.cookie.match(/cookies-acceptance=true/))
    }
  },
  methods: {
    setCookie () {
      document.cookie = 'cookies-acceptance=true';
      this.show = false;
    }
  }
}
</script>

<style lang="stylus">
.cookies-panel
    align-items: center
    background-color: rgba(#000, 0.9)
    bottom: 0
    color: $natural-gray
    display: flex
    flex-direction: column
    padding: 20px
    position: absolute
    z-index: 1

    +m-breakpoint(xmd)
        flex-direction: row
        padding: 1.5vw 3vw

.cookies-panel-left
    margin-bottom: 10px
    padding-right: 3vw

    +m-breakpoint(xmd)
        margin-bottom: 0
        padding-right: 1.5vw

.cookies-panel-right
    padding-left: 3vw

    +m-breakpoint(xmd)
        padding-right: 1.5vw

.cookies-panel-title
    m-font-size(15)
    margin-bottom: 1em

.cookies-panel-text
    m-font-size(15)
    margin-bottom: 1em
</style>
