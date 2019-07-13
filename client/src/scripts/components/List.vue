<template>
  <div :id="id" class="list" v-if="condition">
    <div class="list__title-wrapper" v-if="title" ref="title">
      <div :class="['list__title', titleAction && 'action' || '']" @click="titleAction && titleAction()">{{title}}</div>
      <div class="list__subtitle">{{subtitle}}</div>
    </div>
    <div class="list__wrapper">
      <div class="list__body" ref="body">
        <div
          @click="interaction && interaction.fn(item)"
          :class="['list__item', itemClass == null ? '' : (typeof itemClass == 'function') ? itemClass(item) : itemClass]"
          :key="i"
          v-for="(item, i) of items"
          :afterContent="afterContent && item[afterContent] || ''"
        >
          <div class="list__item-info"><span v-if="ordered">{{parseIndex(item,i) + '. '}}</span>{{item[value]}}</div>
          <div v-if="link != null && item[link]" class="list__item-link"><div class="link-btn" @click="openLink($event, item[link])"></div></div>
          <div v-if="attachment != null && item[attachment]" class="list__item-attachment"><div class="attachment-btn" @click="openLink($event, item[attachment])"></div></div>
          <div v-if="video != null && item[video]" class="list__item-video"><div class="video-btn" @click="openLink($event, item[video])"></div></div>
          <div v-if="action != null" class="list__item-download"><div class="download-btn" @click="action && action(item, $event)"></div></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ScrollBar from './ScrollBar.js';

export default {
  name: "List",
  props: [
    "id",
    "ordered",
    "condition",
    "title",
    "items",
    "itemClass",
    "value",
    "action",
    "interaction",
    "hover",
    "afterContent",
    "index",
    "titleAction",
    "link",
    "attachment",
    "video",
    "subtitle"
  ],
  methods: {
    openLink (ev, url) {
      ev.stopPropagation();
      ev.preventDefault();
      window.open(url.trim());
    },
    parseIndex (item, i) {
      return this.index ? item[this.index] : i + 1;
    },
    getContentOffset (direction) {
      return this.$refs.body && Array.apply(null, this.$refs.body.getElementsByClassName('list__item')).reduce((acum, el) => acum + el.offsetHeight, 0) || 0;
    },
    attachScrollBar () {
      this.scrollBar = new ScrollBar({
        parent: this,
        el: this.$refs.body.parentNode,
        orientation: 'vertical',
        container: this.$refs.body,
        offsetGetter: () => this.getContentOffset('vertical')
      });
    }
  },
  updated () {
    this.scrollBar && this.scrollBar.update();
    if (this.hover) {
      Array.apply(null, this.$el.querySelectorAll('.list__item')).map((el,i) => {
        el.addEventListener('mouseover', (ev) => typeof this.hover === "function" && this.hover(ev, this.items[i]));
      });
    }
  },
  data () {
    return {
      scrollBar: null
    }
  },
  mounted () {
    if (this.condition && !this.scrollBar) {
      this.attachScrollBar();
    }
    if (this.hover) {
      Array.apply(null, this.$el.querySelectorAll('.list__item')).map((el,i) => {
        el.addEventListener('mouseover', (ev) => typeof this.hover === "function" && this.hover(ev, this.items[i]));
      });
      this.$el.addEventListener("mouseleave", (ev) => typeof this.hover === "function" && this.hover(ev, null));
    }
  },
  beforeDestroy () {
    if (this.hover) {
      typeof this.hover === "function" && this.hover();
    }
  },
  watch: {
    condition (to, from) {
      if (to && !from) {
        setTimeout(this.attachScrollBar,0);
      }
    }
  },
}
</script>

<style lang="stylus">
.st-james-infermary
  .list .btn--secondary
    color: $font-colors[st-james-highlight]

  .list .list__item:hover
    .list__item-info
      color: $font-colors[st-james-highlight]
      span 
        color: $font-colors[st-james-highlight]

.list
  display flex
  flex-direction column
  flex 1
  padding-left 20px
  position relative
  max-height calc(100% - 35px)

.list__title-wrapper
  margin-top 20px
  margin-bottom 5px
  padding-right 15px

.list__title
  font-size 1.1em
  opacity 0.5

  &.action
    cursor pointer
    &:hover
      opacity .9
  // border-bottom 1px solid #ffffff

.list__subtitle
  font-size: 0.7em
  line-height: 15px

.list__wrapper
  display flex
  flex 1
  flex-direction column
  width calc(100% + 16px)
  max-height calc(100% - 50px)
  position: relative

  #scrollBar
    right: 16px

.list__body
  display flex
  flex 1
  flex-direction column
  width 100%
  overflow hidden
  overflow-y auto

.list__item
  cursor pointer
  display flex
  display flex
  flex-direction row
  padding 10px 16px 10px 3px
  margin-right 20px
  height 20px
  &:hover
    .list__item-info
      color: $font-colors[highlight]
      span 
        color: $font-colors[highlight]
    .list__item-action
      opacity 1

    // .link-btn
      

.list__item-info
  line-height 20px
  text-align left
  flex 1
  display block
  overflow hidden
  text-overflow ellipsis
  white-space nowrap

.list__item-action
  display flex
  opacity 0
  flex 0.25
  font-size 0.7em
  text-align right
  justify-content flex-end
  align-items center
  .btn
    height 30px
    font-size 0.8em
    padding 0.8em 1.5em 1em


.list__item-link
.list__item-download
.list__item-attachment
.list__item-video
  width: 2%
  min-width: 20px
  .link-btn
    height: 20px
    width: 20px
    background-image url(../../statics/svg/link-icon.svg)
    background-size 80%
    background-position center
    background-repeat no-repeat

  .download-btn
    height: 20px
    width: 20px
    background-image url(../../statics/svg/print-icon.svg)
    background-size 60%
    background-position center
    background-repeat no-repeat

  .attachment-btn
    height: 20px
    width: 20px
    background-image url(../../statics/svg/attachment-icon.svg)
    background-size 80%
    background-position center
    background-repeat no-repeat

  .video-btn
    height: 20px
    width: 20px
    background-image url(../../statics/svg/youtube-icon.svg)
    background-size 80%
    background-position center
    background-repeat no-repeat

</style>
