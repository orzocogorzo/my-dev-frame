import Dispatcher from '../../helpers/dispatcher.js';
import { select } from 'd3';

export default (function () {

  function prepareEl (node) {
    const self = this;
    var el = node;

    Object.defineProperty(this, 'el', {
      get () {
        return el;
      },
      set (node) {
        if (node) {
          el = typeof node == 'string' ? document.querySelector(node) : node;
          self.$el = select(el);

          if (self.template) {
            el.innerHTML = self.template;
          }
        }
      }
    });
  };
  function genLifeCycle () {
    const self = this;
    var parser;
    Object.defineProperties(self, {
      born: {
        get () {
          return self._born;
        },
        set (fn) {
          self.$off('born:after');
          self.$off('born');
          self.$off('born:before');
          self._born = wrap.call(self, fn, 'born').bind(self);
        }
      },
      parse: {
        get () {
          return parser || self._parse;
        },
        set (fn) {
          parser = (data) => {
            fn(self._parse(data));
            return self;
          }
        }
      },
      draw: {
        get () {
          return self._draw;
        },
        set (fn) {
          self._draw = wrap.call(self, fn, 'draw').bind(self);
        }
      },
      update: {
        get () {
          return self._update || function () {};
        },
        set (fn) {
          self._update = wrap.call(self, fn, 'update').bind(self);
        }
      },
      attach: {
        get () {
          return self._attach || function () {};
        },
        set (fn) {
          self._attach = wrap.call(self, fn, 'attach').bind(self);
        }
      },
      resize: {
        get () {
          return self._resize;
        },
        set (fn) {
          self.$off('resize:after');
          self.$off('resize');
          self.$off('resize:before');
          self._resize = wrap.call(self, fn, 'resize').bind(self);
        }
      },
      erase: {
        get () {
          return self._erase;
        },
        set (fn) {
          self.$off('erase:after');
          self.$off('erase');
          self.$off('erase:before');
          self._erase = wrap.call(self, fn, 'erase').bind(self);
        }
      },
      die: {
        get () {
          return self._die;
        },
        set (fn) {
          self.$off('die:after');
          self.$off('die');
          self.$off('die:before');
          self._die = wrap.call(self, fn, 'die').bind(self);
        }
      }
    });
    self.born = self._born;
    self.draw = self._draw;
    self.update = self._update;
    self.attach = self._attach;
    self.resize = self._resize;
    self.erase = self._erase;
    self.die = self._die;
  };
  function genLoader () {
    const self = this;
    var loading = false;
    Object.defineProperty(self, 'loading', {
      get () {
        return loading;
      },
      set (val) {
        val = Boolean(val);
        loading = val;
        self.el.classList[loading === true ? 'add' : 'remove']('loading');
      }
    })
  };
  function genSize () {
    const self = this;
    this.size = new Object();
    Object.defineProperties(this.size, {
      "width": {
        get () {
          return self.el.offsetWidth;
        }
      },
      "height": {
        get () {
          return self.el.offsetHeight;
        }
      },
      "left": {
        get () {
          return self.el.getBoundingClientRect().left;
        }
      },
      "top": {
        get () {
          return self.el.getBoundingClientRect().top;
        }
      },
      "margin": {
        get () {
          return self.options.margin || 10;
        }
      },
      "radius": {
        get () {
          return (Math.min(self.size.width, self.size.height)-self.size.margin*2)/2;
        }
      }
    });
  };
  function genData (init) {
    const self = this;
    var data;
    if (init) {
      data = self.parse(init);
    }
    Object.defineProperty(self, "data", {
      set (source) {
        if (source !== data) {
          data = self.parse(source);
          self.$dispatch("change:data", data);
        }
      },
      get () {
        return data != null && data;
      }
    });
  };
  var _debouncedRedize;
  function _resize (e, delta) {
    clearTimeout(_debouncedRedize);
    if (!delta) {
      delta = 300;
    }
    _debouncedRedize = setTimeout((e) => {
      this.resize && this.resize(e);
      this.$dispatch("resize", this);
    }, delta);
  };
  function wrap (fn, event) {
    const self = this;
    function wrapper () {
      self.$dispatch(event+":before", this);
      fn.apply(self, arguments);
      self.$dispatch(event, this);
      self.$dispatch(event+":after", this);
      return self;
    }
    return wrapper;
  };
  function BaseViz (el, options) {
    this._initialize(el, options);
  };
  BaseViz.prototype._initialize = function (el, options) {
    const self = this;
    if (!options) {
      options = new Object();
    }

    self._ready = false;
    self.template = options.template || `<div class="chart-wrapper">
      <div class="chart-loader">Loading...</div>
      <div class="chart-header"><button id="print">print</button></div>
      <div class="chart-content">
        <svg id="chart"></svg>
      </div>
      <div class="chart-footer"></div>
    </div>`;
    delete options.template;
    self.options = options;
    Object.freeze(self.options);

    prepareEl.call(this, el);
    this.el = el;
    genLoader.call(this);
    this.loading = true;

    new Dispatcher(self);
    genSize.call(self);
    genData.call(self);
    genLifeCycle.call(self);
    const resizeCallback = (e) => _resize.call(self, e, self.options.debounce);
    window.resize(resizeCallback);

    self.$on("born:after", () => {
      self._ready = true;
      if (this.options.printable) {
        var wrapper = Array.apply(null, this.el.getElementsByClassName('chart-wrapper')).pop();
        wrapper.classList.add('printable');
      }
    });
    self.$on('change:data', () => {
      var node = this.el.querySelector('#chart-ready-flag');
      node && node.parentElement.removeChild(node);
      if (self.isReady()) {
        self.draw();
      }
    });

    self.$on('draw:after', () => {
      setTimeout(() => {
        var node = document.createElement('div');
        node.id = 'chart-ready-flag';
        this.el.appendChild(node);
      }, 0);

    })

    setTimeout(self.born.bind(self), 0);
  };
  BaseViz.prototype._born = function () {    
    this.prepareChart();
  };
  BaseViz.prototype._resize = function () {
    console.log('resize');
    return this;
  };
  BaseViz.prototype._draw = function () {
    if (!this.isReady()) {
      return;
    }

    if (!this.chart) {
      this.prepareChart();
    }

    console.log('draw');
    return this;
  };
  BaseViz.prototype._update = function () {
    console.log('update');
  };
  BaseViz.prototype._attach = function () {
    if (!this.dom) {
      throw new Error("nothing to attach");
    }

    this.prepare();

    this.dom.map((node) => {
      this.chart.appendChild(node);
    });

    return this;
  };
  BaseViz.prototype._erase = function () {
    if (!this.chart) return;
    this.dom = Array.apply(null, this.chart.childNodes);
    this.chart.innerHTML = '';
    this.chart.setAttribute('height', '0px');
    this.chart.setAttribute('width', '0px');
    // this.chart.parentNode.removeChild(this.chart);

    delete this.chart;
    delete this.$chart;

    return this;
  };
  
  BaseViz.prototype._die = function () {
    if (this.el.parentNode) {
      this.el.parentNode.removeChild(this.el);
      delete this.el;
      this.$killListeners();
    }
    return this;
  };

  BaseViz.prototype._parse = function (data) {
    return data.map((d,i) => {
      d._id = i;
      return d;
    });
  };
  BaseViz.prototype.prepareChart = function () {
    if (this.el) {
      this.chart = this.el.querySelector('#chart');
      this.$chart = this.chart && select(this.chart);
    }
    if (this.options.print === true) {
      this.el.querySelector('#print').removeEventListener('click', this.print);
      this.el.querySelector('#print').addEventListener('click', this.print);
      this.el.children[0].classList.add('print')
    }
    return this;
  };
  BaseViz.prototype.isReady = function () {return Boolean(this._ready && this.data)};
  
  BaseViz.prototype.parseNumber = function (value, suffix) {
    return (value < 0.01 ? '0.00' : value.toPrecision(3)) + (suffix || '');
  }

  BaseViz.prototype.print = function () {
    const parser = document.createElement('template');
    // const img = document.createElement('img');
    // const canvas = document.createElement('canvas');
    const link = document.createElement('a');
    const chart = document.getElementById('chart');

    // img.setAttribute('height', chart.getAttribute('height'));
    // img.setAttribute('width', chart.getAttribute('width'));
    // canvas.setAttribute('height', chart.getAttribute('height'));
    // canvas.setAttribute('width', chart.getAttribute('width'));

    parser.innerHTML = new XMLSerializer().serializeToString(chart);

    Array.apply(null, parser.content.children.chart.getElementsByClassName('no-print')).map(el => {
      el.parentNode.removeChild(el);
    });

    var background = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    background.setAttribute('width', '100%');
    background.setAttribute('height', '100%');
    background.setAttribute('fill','#000000');

    parser.content.children.chart.prepend(background);

    var file = new Blob([parser.innerHTML], {type: "image/xml+svg;charset=utf-8"});
    var url = window.URL.createObjectURL(file);
    link.href = url;
    link.download = 'chart.svg';
    link.click();

    // img.onload = function () {
    //   canvas.getContext('2d').drawImage(img, 0, 0);
    //   link.href = canvas.toDataURL('image/png');
    //   link.download = 'chart.png';
    //   link.click();
    // };
    
    // img.src = 'data:image/svg+xml;base64,' + btoa(parser.innerHTML);;
  }

  return BaseViz;

})();