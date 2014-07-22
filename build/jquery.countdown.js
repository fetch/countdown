(function() {
  var Countdown,
    __slice = [].slice;

  $.fn.extend({
    countdown: function() {
      var args, options;
      options = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      return this.each(function() {
        var countdown;
        countdown = $(this).data('countdown');
        if (countdown) {
          if (countdown[options]) {
            return countdown[options].apply(countdown, args);
          }
        } else {
          return $(this).data('countdown', new Countdown(this, options));
        }
      });
    }
  });

  Countdown = (function() {
    Countdown.defaults = {
      placeholder: '-',
      duration: 1000,
      digits: 8,
      min: null,
      max: null,
      easing: function(x, t, b, c, d) {
        return c * t / d + b;
      }
    };

    function Countdown(elem, options) {
      this.jq_elem = $(elem);
      this.value = 0;
      this.options = $.extend({}, Countdown.defaults, this.jq_elem.data(), options);
      this.buildHtml();
      this.parseOptions();
    }

    Countdown.prototype.parseOptions = function() {
      if (this.options.number != null) {
        this.setValue(this.options.number);
      }
      if (this.options.animateTo != null) {
        return this.animateTo(this.options.animateTo);
      }
    };

    Countdown.prototype.buildHtml = function() {
      var digits, i;
      i = 0;
      digits = [];
      while (i < this.options.digits) {
        digits.push("<span class=\"digit digit-" + i + "\">" + this.options.placeholder + "</span>");
        i++;
      }
      return this.jq_elem.append(digits.join("\n"));
    };

    Countdown.prototype.animateTo = function(value) {
      var animationStep, difference, duration, startTime, time;
      startTime = new Date().getTime();
      time = 0;
      if (typeof value === 'string') {
        if (/^\d+$/.test(value)) {
          this.targetValue = value;
        } else {
          this.targetValue = (this.targetValue || 0) + eval(value);
        }
      } else {
        this.targetValue = value;
      }
      if ((this.options.max != null) && this.targetValue > this.options.max) {
        this.jq_elem.trigger('countdown:limit', {
          value: this.targetValue,
          limit: 'max',
          limited_to: this.options.max
        });
        this.targetValue = this.options.max;
      }
      if ((this.options.min != null) && this.targetValue < this.options.min) {
        this.jq_elem.trigger('countdown:limit', {
          value: this.targetValue,
          limit: 'min',
          limited_to: this.options.min
        });
        this.targetValue = this.options.min;
      }
      difference = this.targetValue - this.value;
      duration = this.options.duration;
      this.oldValue = this.value;
      animationStep = (function(_this) {
        return function() {
          var timeDifference;
          time += 10;
          timeDifference = (new Date().getTime() - startTime) - time;
          _this.setValue(Math.round(_this.options.easing(null, time, _this.oldValue, difference, duration)));
          if (time < _this.options.duration) {
            return _this.timeout = setTimeout(animationStep, 10 - timeDifference);
          }
          return _this.jq_elem.trigger('countdown:finished', {
            old_value: _this.oldValue,
            value: _this.value
          });
        };
      })(this);
      if (this.timeout) {
        clearTimeout(this.timeout);
      }
      return this.timeout = setTimeout(animationStep, 10);
    };

    Countdown.prototype.stop = function() {
      if (this.timeout) {
        clearTimeout(this.timeout);
        this.jq_elem.trigger('countdown:stopped', {
          old_value: this.oldValue,
          value: this.value
        });
        return delete this.timeout;
      }
    };

    Countdown.prototype.setValue = function(value) {
      this.value = value;
      value = value.toString().lpad('0', this.options.digits).split('');
      return $('.digit', this.jq_elem).each((function(_this) {
        return function(index, digit) {
          return $(digit).text(value[index]);
        };
      })(this));
    };

    Countdown.prototype.setOption = function(option, value) {
      return this.options[option] = value;
    };

    return Countdown;

  })();

  if (typeof String.prototype.lpad !== 'function') {
    String.prototype.lpad = function(padString, length) {
      var str;
      str = this;
      while (str.length < length) {
        str = padString + str;
      }
      return str;
    };
  }

}).call(this);
