import Dispatcher from '../helpers/dispatcher.js';

function renderNode (options) {
  var node = document.createElement('div');
  node.id = 'scrollBar'
  node.setAttribute('orientation', options.orientation === 'vertical' && 'vertical' || 'horizontal');
  node.innerHTML = `<div class="scroll-bar__wrapper">
    <div class="scroll-bar__body">
      <div class="scroll-bar__slider"></div>
    </div>
  </div>`;
  return node;
}

function genOffset () {
  this.offset = new Object();
  (function (self) {
    var contentOffset;
    Object.defineProperties(self.offset, {
      'content': {
        get () {
          return contentOffset;
        },
        set (val) {
          contentOffset = val || self.offsetGetter();
        }
      },
      'container': {
        get () {
          if (self.orientation === 'horizontal') {
            return self.container && self.container.offsetWidth || 0;
          } else {
            return self.container && self.container.offsetHeight || 0;
          }
        }
      },
      slider: {
        get () {
          let rel = self.offset.container / self.offset.content;
          if (rel >= 1) {
            self.html.classList.add('fits');
          } else {
            self.html.classList.remove('fits');
          }
          
          return rel * self.offset.container;
        }
      }
    });
  })(this);
}

function genGrabbing () {
  var active = false;
  Object.defineProperty(this, 'grabbing', {
    get () {
      return active;
    },
    set (val) {
      if (val != active) {
        active = val;
        if (active) {
          document.body.addEventListener('mousemove', this.onMouseMove);
          document.body.addEventListener('mouseup', this.onMouseUp);
        } else {
          document.body.removeEventListener('mousemove', this.onMouseMove);
          document.body.removeEventListener('mouseup', this.onMouseUp);
        }
      }
    }
  })
}

function resize () {
  this.update();
}

function onScroll (ev) {
  if (this.orientation === 'horizontal') {
    this.slider.style.marginLeft = (ev.srcElement.scrollLeft/this.offset.content)*this.offset.container + 'px';
  } else {
    this.slider.style.marginTop = (ev.srcElement.scrollTop/this.offset.content)*this.offset.container + 'px';
  }
}

export default function (options) {
  const self = this;
  options = options || new Object();
  Object.keys(options).map(k => this[k] = options[k]);

  new Dispatcher(this);
  genOffset.call(this);
  genGrabbing.call(this);
  this.offset.content = this.offsetGetter();

  this.html = renderNode(options);
  this.el.appendChild(this.html);
  this.slider = this.html.getElementsByClassName('scroll-bar__slider')[0];
  
  this.slider.addEventListener("mousedown", (e) => {
    self.grabbing = true;
  });

  this.onMouseUp = function onMouseUp () {
    self.grabbing = false;
  }

  this.onMouseMove = function onMouseMove (e) {
    const position = self.orientation === 'horizontal' ? {
      x: self.container.scrollLeft + e.movementX*(self.offset.content/self.offset.container),
      y: self.container.scrollTop
    } : {
      x: self.container.scrollLeft,
      y: self.container.scrollTop + e.movementY*(self.offset.content/self.offset.container),
    }

    self.container.scrollTo(position.x, position.y);
    self.$dispatch("scroll", position);
  }

  this.update = function () {
    this.offset.content = this.offsetGetter();
    if (this.orientation === 'horizontal') {
      this.slider.style.width = this.offset.slider + 'px';
    } else {
      this.slider.style.height = this.offset.slider + 'px';
    }
  }

  this.update();

  window.resize(resize.bind(this));

  this.container.addEventListener("scroll", onScroll.bind(this));
}
