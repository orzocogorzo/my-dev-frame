<template>
  <div id="dataTable" :visible="visible">
    <button id="print" v-on:click="printTable">print</button>
    <div ref="content" class="data-table__content" v-on:mouseout="onMouseOut">
      <div v-grabbable:x ref="header" class="data-table__header grabbable">
          <div class="data-table__header-content">
            <div
              :key="colIdx"
              v-for="(colName, colIdx) of columns"
              :column="colIdx"
              :row="0"
              class="data-table__header-item column"
              v-on:mouseover="onCellHover(colIdx, 0)"
            >{{colName}}</div>
          </div>
      </div>
      <div v-on:wheel="onMouseWheel" v-grabbable:xy ref="body" class="data-table__body grabbable">
          <div ref="content" class="data-table__body-content">
            <div
              :key="rowIdx+1"
              v-for="(item, rowIdx) of items"
              :row="rowIdx"
              class="data-table__row"
            >
              <div
                :key="colIdx"
                v-for="(d,colIdx) of item.data"
                :column="colIdx"
                class="data-table__cell"
                v-on:mouseover="onCellHover(colIdx, rowIdx)"
              >{{formatter ? formatter(d, item) : d.value}}</div>
            </div>
          </div>
      </div>
      <div ref="footer" class="data-table__footer"></div>
    </div>
  </div>
</template>

<script>
import ScrollBar from './ScrollBar.js';

export default {
  name: "DataTable",
  props: ["items", "columns", "formatter", "visible"],
  data () {
    return  {
      tableBody: null,
      tableContent: null,
      scrollBarH: null,
      scrollBarV: null
    }
  },
  mounted () {
    this.$refs.header.$on('mousemove', (e) => this.syncSectionsScroll('header', e));
    this.$refs.body.$on('mousemove', (e) => this.syncSectionsScroll('body', e));
    this.scrollBarH = new ScrollBar({
      parent: this,
      el: this.$refs.body.parentNode,
      orientation: 'horizontal',
      container: this.$refs.body,
      offsetGetter: () => this.getContentOffset('horizontal')
    });
    this.scrollBarH.$on("scroll", (e) => this.syncSectionsScroll('body', e));
    this.scrollBarV = new ScrollBar({
      parent: this,
      el: this.$refs.body.parentNode,
      orientation: 'vertical',
      container: this.$refs.body,
      offsetGetter: () => this.getContentOffset('vertical')
    });
    this.scrollBarV.$on("scroll", (e) => this.syncSectionsScroll('body', e));
    this.$emit("mounted", this.syncSectionsScroll);
  },
  updated () {
    this.scrollBarH.update();
    this.scrollBarV.update();
  },
  methods: {
    getContentOffset (direction) {
      if (this.$refs.body) {
        if (direction === 'horizontal') {
          let row = this.$refs.body.querySelector('.data-table__row');
          if (row) {
            return Array.apply(null, row.childNodes).reduce((acum, child) => acum + child.offsetWidth, 0);
          }
        } else {
          let rows = this.$refs.body.querySelectorAll('.data-table__row');
          if (rows.length) {
            return Array.apply(null, rows).reduce((acum, child) => acum + child.offsetHeight, 0);
          }
        }
      }
      return 0;
    },
    onMouseOut () {
      Array.apply(null, this.$el.querySelectorAll('.focus')).map(el => el.classList.remove('focus'));
    },
    onCellHover (colIdx, rowIdx) {
      this.onMouseOut();
      this.$refs.header.querySelector(`[column="${colIdx}"`).classList.add('focus');
      this.$refs.body.querySelector(`[row="${rowIdx}"`).classList.add('focus');
      Array.apply(null, this.$refs.body.querySelectorAll(`[column="${colIdx}"`)).map(el => el.classList.add('focus'));
    },
    syncSectionsScroll (dispatcher, position) {
      if (dispatcher === 'header') {
        this.$refs.body.scrollTo(position.x, position.y);
      } else if (dispatcher === 'body') {
        this.$refs.header.scrollTo(position.x, position.y);
      } else {
        this.$refs.header.scrollTo(position.x, position.y);
        this.$refs.body.scrollTo(position.x, position.y);
      }
      dispatcher != null && this.$emit("scroll", position);
    },
    onMouseWheel (e) {
      const position = {
        x: this.$refs.body.scrollLeft,
        y: this.$refs.body.scrollTop + e.deltaY
      }

      this.$refs.body.scrollTo(position.x, position.y);
      this.$emit("scroll", position);
    },
    printTable () {
      const table = this.items.reduce((table, item) => {
        table.push(item.data.reduce((acum,d,i) => {
          acum.push(this.formatter ? this.formatter(d, item) : d.value);
          return acum;
        }, new Array()).join(';'));
        return table;
      }, [this.columns.join(';')]).join('\n');

      const file = new Blob([table], {type: "text/csv"});
      const link = document.createElement('a');
      const url = window.URL.createObjectURL(file);
      link.href = url;
      link.download = 'table.csv';
      link.click();
    }
  }
}
</script>

<style lang="stylus">
.st-james-infermary
  #dataTable .data-table__row:not(.focus)
    .data-table__cell.focus
      background-color #60D47615

    &:nth-child(odd) .data-table__cell.focus
      background-color #60D47620

  #dataTable .data-table__row.focus

    > .data-table__cell
      background-color #60D47615

      &.focus
        background-color #60D47630
        border 0.5px solid white
          
      &:nth-child(odd)
        background-color #60D47620

        &.focus
          background-color #60D47630

  #dataTable .data-table__header-item.focus
    background-color #60D47620

#dataTable
  flex 1
  height 100%
  width 100%
  display flex
  flex-direction row
  font-size 0.8em
  position: relative

  .grabbable
    cursor grab 
    &.grabbing
      cursor grabbing

  .data-table__content
    flex 1
    height 100%
    width 0px
    position relative
    overflow: hidden

  .data-table__header
    overflow hidden
    width 100%
    height 35px
    font-size 0.8em
    border 1px solid white
    text-transform capitalize

  .data-table__header-content
    display flex
    flex-direction row
    height 35px
    max-height 30px
    overflow visible

  .data-table__header-item
    flex 1
    display flex
    align-items center
    justify-content center
    min-width 150px
    height 35px
    line-height 10px
    padding 3px
    text-align center
    user-select none

    &:first-of-type
      border-right 1px solid white

    &.focus
      background-color #60a2d420

  .data-table__body
    width 100%
    max-height: calc(100% - 35px)
    flex 1
    display flex
    font-size 0.8em
    overflow hidden
    border 1px solid #ffffff

  .data-table__body-content
    display flex
    flex 1
    flex-direction column
    width 100%
    overflow visible

  .data-table__row
    flex-direction row
    display flex
    height 30px
    min-height 30px

    &:not(.focus) 
      .data-table__cell.focus
        background-color #60a2d415

      &:nth-child(odd) .data-table__cell.focus
        background-color #60a2d420

    &:nth-child(odd) > .data-table__cell
      background-color #00000010

      &:nth-child(odd)
        background-color #00000020

    &.focus > .data-table__cell
      background-color #60a2d415

      &.focus
        background-color #60a2d430
        border 0.5px solid white

      &:nth-child(odd)
        background-color #60a2d420

        &.focus
          background-color #60a2d430
          border 0.5px solid white
  
  .data-table__cell
    flex 1
    min-width 150px
    height 30px
    min-height 30px
    line-height 10px
    padding 3px
    text-align center
    user-select none
    text-align center
    display flex
    justify-content center
    align-items center

    &:first-of-type
      border-right 1px solid white

    
  #scrollBar[orientation='vertical']
    margin-top: 35px

  #print
    position: absolute
    left: 2px
    top: 2px
    font-size: 0
    width: 30px
    height: 30px
    background-image: url('../../statics/svg/print-icon.svg')
    background-size: 65%
    background-position: 50%
    background-repeat: no-repeat
    background-color: unset
    border: 1px solid #ffffff33
    border-radius: 4px
    opacity: .25
    outline: none
    z-index: 10

    &:hover
      opacity: 1

</style>
