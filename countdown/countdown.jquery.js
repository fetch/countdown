// Countdown, a Counter and Countdown plugin for jQuery
// by Koen Punt for Fetch!, http://www.fetch.nl
// 
// Version 0.1.2
// Full source at https://github.com/fetch/countdown
// Copyright (c) 2012 Fetch! http://www.fetch.nl

// MIT License, https://github.com/fetch/countdown/blob/master/LICENSE.md
// This file is generated by `cake build`, do not edit it by hand.
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
      var animationStep, difference, duration, startTime, time,
        _this = this;
      startTime = new Date().getTime();
      time = 0;
      if (typeof value === 'string') {
        this.targetValue = (this.targetValue || 0) + eval(value);
      } else {
        this.targetValue = value;
      }
      difference = this.targetValue - this.value;
      duration = this.options.duration;
      this.oldValue = this.value;
      animationStep = function() {
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
      var pad,
        _this = this;
      this.value = value;
      pad = '0';
      value = value.toString().lpad(pad, this.options.digits).split('');
      return $('.digit', this.jq_elem).each(function(index, digit) {
        return $(digit).text(value[index]);
      });
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
