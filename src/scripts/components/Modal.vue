<template>
  <div class="modal" v-if="visible">
    <div class="modal-inner">
      <h3>{{content}}</h3>
    </div>
  </div>
</template>

<script>
export default {
    name: "Modal",
    props: ["content"],
    data () {
      return {
        show: false
      }
    },
    computed: {
        visible() {
            return this.show;
        }
    },
    methods: {
        close() {
            this.show = false;
        },
        show () {
          this.show = true;
        }
    }
}
</script>

<style lang="stylus">
.privacy-modal
  align-items: center
  background-color: rgba(#000, 0.5)
  display: flex
  height: 100%
  justify-content: center
  left: 0
  position: fixed
  top: 0
  width: 100%
  z-index: 100

.privacy-modal-close-btn
  cursor: pointer
  height: 20px
  m-font-size(@height * 2, 0)
  position: absolute
  right: (@height / 2)
  top: (@height / 2)
  user-select: none
  width: @height

.privacy-modal-inner
  background-color: #000
  color: $natural-gray
  height: 90%
  padding: 40px 20px 20px
  position: relative
  width: 90%

  +m-breakpoint(xmd)
    padding: 40px

  +m-breakpoint(lg)
    height: 75%
    width: 50%

.privacy-modal-body
  height: 100%
  overflow-y: auto
  padding: 10px

.privacy-modal-title
  font-weight: $fw-bold
  m-font-size(20, 24)
  margin-bottom: 2em

.privacy-modal-content
  a
    word-break: break-all

  p
    m-font-size(14, 20)
    margin-bottom: 1em

  ul
    padding-left: 40px

  li
    list-style-type: disc
    m-font-size(14, 20)
    margin-bottom: 1em

  table
    border-collapse: collapse
    width: 100%

    th,
    td
      border: 1px solid
      m-font-size(14, 20)
      padding: 10px

.privacy-modal-content-title
  font-weight: $fw-bold
  m-font-size(18, 22)
  margin-bottom: 1.5em
  margin-top: 1.5em

.privacy-modal-content-subtitle
  font-weight: $fw-bold
  m-font-size(16, 20)
  margin-bottom: 1em
  margin-top: 1em
</style>
