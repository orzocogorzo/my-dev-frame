export default function Dispatcher(root) {
        
  if (!root) {
    throw new Error("no root defined");
  }
  const _eventStore = new Object();

  function Dispatcher () {
    this.root = root;
  
    this.dispatch = function(event,data) {
        if (!_eventStore[event]) return;
        _eventStore[event].map(callback => {
            callback(data);
        });
    }
  
    this.on = function(event,callback) {
        if (!_eventStore[event]) {
            _eventStore[event] = new Array();
        }
        _eventStore[event].push(callback);
    }
  
    this.off = function(event, callback){
        if (!_eventStore[event]) return;
        if (!callback) {
            delete _eventStore[event];
            return;
        }
        let index;
        _eventStore[event].map((_callback,i) => {
            if (_callback == callback) {
                index = i;
            }
        });
        if (index) !_eventStore[event].splice(index,1);
    }

    this.killListeners = function () {
      Object.keys(_eventStore).map((k) => {
        _eventStore[k] = new Array();
      });
    }
  }

  if (root) {
    let _ = new Dispatcher();
    root.$on = _.on;
    root.$off = _.off;
    root.$killListeners = _.killListeners;
    root.$dispatch = _.dispatch;
    // void
  } else {
    return new Dispatcher();
  }
}