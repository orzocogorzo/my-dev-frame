import Vue from "vue";

export default function () {
  let callbacks = window.__resizeCallbacks || new Array();

  if (!window.resize) {
    window.__resizeCallbacks = callbacks;
    window.addEventListener("resize", function (e) {
      callbacks.map((fn) => {
        fn(e);
      });
    });
  
    window.resize = function (callback) {
      if (!callback.name) {
        console.warn(`Resize listener shouldn't be an anonim function. \
          To make possible to unbinde the function it must be declared \
          with name or assigned to a variable. Otherwise, it's not possible \
          to identify the stored function when trying to unbind. For now, you \
          are fucked because an anonim funciton was passed to the listener.`);
      };
  
      if (callbacks.indexOf(callback) < 0) {
        callbacks.push(callback);
      }
    }
  
    window.offResize = function (callback) {
      if (callbacks.indexOf(callback) >= 0) {
        let index = callbacks.indexOf(callback);
        callbacks = callbacks.slice(0, index).concat(callbacks.slice(index+1));
      }
    }
  }

  this.resize = function (callback, off) {
    if (off) {
      window.offResize(callback);
      return;
    }
    window.resize(callback);
  };


  this.bind = function (component)  {
    component.prototype.$resize = this.resize.bind(component);
  };

  return this;

}