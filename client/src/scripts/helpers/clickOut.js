export default function () {
  const _listeners = new Object();

  function clickListener (e) {
    let node = e.srcElement,
      isIn = false;

    while (node) {
      if (node == this.parent) {
        isIn = true;
        node = null;
        break;
      }
      node = node.parentNode;
    }

    if (!isIn) {
      var listenerName = this.selector.replace(/(\.|#)/g,'').replace(/-/g,'_')+'ClickListener';
      document.removeEventListener('click', _listeners[listenerName]);
      delete _listeners[listenerName];
      this.callback();
    }
  }

  this.bind = function (parentSelector, callback) {
    var listenerName = `${parentSelector.replace(/(\.|#)/g,'').replace(/-/g,'_')}ClickListener`;
    eval(`_listeners["${listenerName}"] = (function () {
      return function ${listenerName} (e) {
        var parent = document.getElementsByClassName(parentSelector.replace(/(\\.|#)/g,''))[0];
        clickListener.call({parent: parent, callback: callback, selector: parentSelector}, e)
      };
    })()`);
    setTimeout(() => document.addEventListener("click", _listeners[listenerName]), 0);   
  }

  this.bindOff = function (parentSelector) {
    let listenerName = `${parentSelector.replace(/(\.|#)/g,'').replace(/-/g,'_')}ClickListener`;
    _listeners[`${listenerName}`] && document.removeEventListener('click', _listeners[`${listenerName}`]);
    delete _listeners[listenerName];
  }

  return this;
}