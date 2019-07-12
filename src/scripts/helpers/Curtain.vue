<template>
  <div :style="{
      'backgroundColor': hexcolor,
      'transition': ('opacity ' + sDelta + ' ease-in-out'),
      'display': display ? display : null
    }"
    :fading="fading" 
    class="curtain"
  ></div>
</template>

<script>
export default {
  name: "Curtain",
  props: ["hexcolor", "delta"],
  data () {
    return {fading: false}
  },
  computed: {
    sDelta () {
      return this.delta/1000/2 + 's';
    },
    display () {
      return this.$route.query.printable == 'true' ? 'none' : null;
    }
  },
  watch: {
    $route (to, from) {
      this.$el.style.display = 'block';
      this.fading = true;
      // setTimeout(() => {
      //   this.fading = true;
        setTimeout(() => {
          this.fading = false;
          setTimeout(() => {
            this.$el.style.display = 'none';
          }, Math.round(this.delta/2));
        }, Math.round(this.delta/2));
      // }, 0);
    }
  }
}
</script>

<style lang="stylus">
.st-james-infermary
  .curtain
    background-color: $theme-colors[st-james-secondary]

.curtain
  position absolute
  left 0px
  right 0px
  top 0px
  bottom 0px
  margin auto 
  z-index 1000
  background-color: $theme-colors[secondary]
  opacity 0
  transition opacity 0.3s ease-in-out
  display none
  &[fading]
    display block
    opacity 1
</style>
