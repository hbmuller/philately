var RushLayer = (function() {
  var layer = function(options) {
    var extended = this._applyDefaults(options);

    this._data = {};
    this.source(extended.source);
    this.opacity(extended.opacity);
    this.label(extended.label);
    this.active(extended.active);
    this.position(extended.x, extended.y);
  };

  layer.prototype._defaults = {
    source: null,
    label: "",
    opacity: 1,
    active: true,
    x: 0,
    y: 0
  };

  layer.prototype._applyDefaults = function(options) {
    var data = Object.create(this._defaults);

    for (var key in data) {
      if (typeof options[key] !== "undefined") data[key] = options[key];
    }

    return data;
  };

  layer.prototype.source = function(source) {
    if (source) {
      var sourceElement =
        typeof source === "string" ? document.querySelector(source) : source;

      if (
        sourceElement instanceof HTMLImageElement ||
        sourceElement instanceof HTMLCanvasElement
      ) {
        this._data.source = sourceElement;
      } else {
        console.error(
          'The "source" option must be a canvas or image element or a string selector to one of them.'
        );
        return false;
      }
    }

    return this._data.source || null;
  };

  layer.prototype.label = function(label) {
    if (typeof label === "string") {
      this._data.label = label;
    } else if (typeof label !== "undefined") {
      console.error('The "label" option must be a string');
      return false;
    }

    return this._data.label;
  };

  layer.prototype.opacity = function(opacity) {
    if (typeof opacity === "number") {
      this._data.opacity = Math.max(0, Math.min(1, opacity));
    } else if (typeof opacity !== "undefined") {
      console.error('The "opacity" option must be a number');
      return false;
    }

    return this._data.opacity;
  };

  layer.prototype.active = function(active) {
    if (typeof active === "boolean") {
      this._data.active = active;
    }

    return this._data.active;
  };

  layer.prototype.position = function(x, y) {
    if (typeof x === "number" && typeof x === "number") {
      this._data.position = {
        x: x,
        y: y
      };
    }

    return this._data.position;
  };

  return layer;
})();
