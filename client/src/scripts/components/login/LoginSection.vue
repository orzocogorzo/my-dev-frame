<template>
  <div class="login-section">
    <div class="login-section-content">
      <div v-if="!error.code" class="login-section-wrapper">
        <div class="login-section-label">{{lng("order-number")}}</div>
        <div class="login-section-input-wrapper">
          <div :class="{'login-section--input-background': true, 'error': error.code}">
            <input
              id="codeInput"
              v-on:keydown="keyBind($event, 'code')"
              v-model="code"
              class="login-section-code-input"
              type="text"
              placeholder="#1234567"
            >
          </div>
          <div class="login-section-submit-btn-wrapper">
            <div
              v-on:click="submitCode"
              class="btn btn--primary login-section-submit-btn"
            >{{lng("enter-code")}}</div>
          </div>
        </div>
      </div>
      <div v-if="error.code" class="login-section-error-wrapper">
        <div
          :class="{'login-section__error-message': true, error: error.code}"
        >{{error.errorMessage}}</div>
        <div class="login-section-error-btn-wrapper">
          <div
            v-on:click="tryItAgain"
            class="btn btn--primary login-section-error-btn"
          >{{lng("try-it-again")}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: "LoginSection",
  data () {
    return {
      code: undefined,
      error: {
        code: false
      },
      errorMessage: undefined
    };
  },
  beforeMount () {
    if (document.cookie.match(/user_credentials=([^;]+)/)) {
      this.code = document.cookie.match(/user_credentials=([^;]+)/)[1];
    }
  },
  methods: {
    keyBind (e, input) {
      if (e.keyCode === 13) {
        this.submitCode();
      } else {
        this.error[input] = false;
        this.errorMessage = void 0;
      }
    },
    tryItAgain () {
      this.error.code = false;
      this.error.errorMessage = void 0;
    },
    submitCode () {
      if (!this.code) {
        this.error.code = true;
        this.error.errorMessage = this.lng("login-code-not-submited");
        return;
      }

      this.requestStatus().then(success => {
        success && this.login();
      });
    },
    requestStatus () {
      return this.$store
        .dispatch("users/login", {userCredentials: this.code })
        .then(status => {
          if (!status.success) {
            this.error.code = true;
            this.error.errorMessage = this.lng("login-code-not-found");
          } else {
            this.error.code = false;
            this.error.errorMessage = void(0);
          }
          return !this.error.code;
        }).catch(err => {
          console.error(err);
          console.log('error catched on the trackline status request');
          this.errorMessage = this.lng('login-code-error');
          this.error.code = true;
          return this.error.code;
      });
    },
    login () {
      document.cookie = `user_credentials=${this.code};max-age=2592000`;
      document.cookie = "user_session=true;max-age=1800";
      this.$emit("logged");
    }
  }
};
</script>

<style lang="stylus">
.login-section
  align-items: center
  display: flex
  flex-direction: column
  position: relative
  width: 100%

  .advisments-wrapper
    margin-top: 20px

    .advisments__privacy-list
      display: flex !important

.privacy-policy-text
  font-size 0.75em
  text-align justify
  padding 0px 7.5%
  margin 75% 0px 30px 0px
  color #444
  // b
  //   margin-left 3px

.floating-advertisment
  m-font-size(14, 18)
  margin-top: auto

  .contact-us
    display: inline-block
    m-font-size(14, 18)
    m-link($primary-theme-color, $primary-theme-color)
    margin-left: 0.5em

.advisments-wrapper
  display: flex

.login-section-content
  position: absolute
  top: 50%
  transform: translateY(-50%)

  +m-breakpoint(sm xmd)
    margin-top: auto
    position: static
    top: 0
    transform: none

.login-section-label
  m-font-size(16, 20)
  margin-bottom: 0.5em

.login-section--input-background,
.email-section--input-background
  background-color: $westar
  display: flex
  margin-bottom: 1em
  padding: 10px

  &.error
    > input
      color: #ff3333aa

.login-section__error-message
  display: none
  justify-content: center
  justify-content: flex-start
  m-font-size(16, 20)
  margin-bottom: 40px
  text-align: center

  &.error
    display: flex

.login-section-code-input,
.email-section-email-input
  background: none
  border: none
  color: $zorba
  m-font-size(32)
  width: 100%

  &:focus
    outline: none

.login-section-submit-btn-wrapper,
.login-section-error-btn-wrapper
  text-align: right

.privacy-list
  align-items: center
  display: flex
  margin-bottom: 1em
  margin-top: 1em

.privacy-list-item
  &:not(:last-child)
    margin-right: 10px

  > a
    display: block
    m-font-size(10, 12)
</style>
