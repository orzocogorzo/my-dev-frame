import Vue from 'vue';

export default function (data) {
  data = data || new Object();
  if (data instanceof Object && typeof data === "object") {
    return new Vue({
      data () {
        return data;
      },
      beforeCreate () {
        if (data.app) {
          data.app.$bus = this;
          delete data.app.bus;
        }
      },
    });
  } else {
    throw new Error("EventBus tells: Dude! this data isn't an object, fuck you nigga!");
  }  
}
