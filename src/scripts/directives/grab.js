import Vue from 'vue';
import Dispatcher from '../helpers/dispatcher.js';

function Handler () {
  const _this = this;

  function onMouseDown () {
    _this.grabbing = true;
    _this.el.classList.add("grabbing");
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  }
  
  function onMouseMove (ev) {
    if (_this.grabbing) {
      let y = _this.yEnabled ? _this.el.scrollTop + ev.movementY*-1 : _this.el.scrollTop;
      let x = _this.xEnabled ? _this.el.scrollLeft + ev.movementX*-1 : _this.el.scrollLeft;
      _this.el.scrollTo(x, y);
      _this.el.$dispatch("mousemove", {x: _this.el.scrollLeft, y: _this.el.scrollTop});
    }
  }

  
  function onMouseUp () {
    _this.grabbing = false;
    _this.el.classList.remove("grabbing");
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mouseup", onMouseUp);
  }

  this.bind = function (el, binding) {
    this.el = el;
    new Dispatcher(el);
    this.grabbing = false;
    this.xEnabled = binding.arg && binding.arg.toLowerCase().indexOf('x') >= 0;
    this.yEnabled = binding.arg && binding.arg.toLowerCase().indexOf('y') >= 0;
    el.addEventListener("mousedown", onMouseDown);
  }

  this.unbind = function () {
    this.el.removeEventListener("mousedown", onMouseDown);
  }

}

Vue.directive("grabbable", {
  inserted (el, binding) {
    el.__grabHandler = new Handler();
    el.__grabHandler.bind(el, binding);
  },
  unbind (el) {
    el.__grabHandler.unbind();
  }
});