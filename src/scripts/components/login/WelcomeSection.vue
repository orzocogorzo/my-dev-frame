<template>
  <div class="welcome-section">
    <div class="welcome-section-logo"></div>
    <div class="welcome-section-content">
      <div class="welcome-section-title" v-html="welcomeTitle"></div>
      <div class="welcome-section-subtitle" v-html="welcomeSubTitle"></div>
      <p
        class="welcome-section-description"
      >{{lng("welcome-section-description")}}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "WelcomeSection",
  data() {
    return {
      welcomeTitle: this.lng("hello"),
      welcomeSubTitle: this.lng("welcome-section-subtitle")
    };
  }
};
</script>

<style lang="stylus">
.welcome-section
  align-items: center
  display: flex
  position: relative

  +m-breakpoint(sm xmd)
    align-items: flex-end

.welcome-section-logo
  background-position: center
  background-repeat: no-repeat
  background-size: contain
  height: 70px
  left: 0
  position: absolute
  top: 0
  width: @height

  +m-breakpoint(sm xmd)
    height: 50px
    width: @height

.welcome-section-title
  font-weight: $fw-bold
  m-font-size(61, 73)
  font-size: 8vw
  line-height: 1.2

  +m-breakpoint(sm xmd)
    font-size: 6vw

  +m-breakpoint(sm md)
    font-size: 8vw

  +m-breakpoint(xmd)
    font-size: 4vw

.welcome-section-subtitle
  font-size: 6vw
  font-weight: $fw-bold
  line-height: 1.2
  margin-bottom: 0.5em

  +m-breakpoint(sm xmd)
    font-size: 4vw

  +m-breakpoint(sm md)
    font-size: 6vw

  +m-breakpoint(xmd)
    font-size: 3vw

.welcome-section-description
  m-font-size(26, 38)
  font-size: 4vw
  line-height: 1.2

  +m-breakpoint(sm xmd)
    font-size: 2.5vw

  +m-breakpoint(sm md)
    font-size: 4vw

  +m-breakpoint(xmd)
    font-size: 2vw
</style>
