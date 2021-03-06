((root, factory) ->

  # AMD
  if typeof define is 'function' && define.amd
    define ['jquery', 'exports'], ($, exports) ->
      factory(root, exports, $)

  # CommonJS
  else if typeof exports != 'undefined'
    factory(root, exports, require('jquery'))

  # Browser
  else
    factory(root, {}, (root.jQuery || root.$))

) this, (root, exports, $) ->

  $.fn.extend
    countdown: (options, args...) ->
      this.each ->
        countdown = $(this).data 'countdown'
        if countdown
          countdown[options].apply(countdown, args) if countdown[options]
        else
          $(this).data 'countdown', new Countdown( this, options )

  class Countdown

    @defaults =
      placeholder: '-'
      duration: 1000
      digits: 8
      min: null
      max: null
      easing: (x, t, b, c, d) ->
        # Default linear interpolation
        c * t / d + b;

    constructor: (elem, options) ->
      @jq_elem = $ elem
      @value = 0
      @options = $.extend({}, Countdown.defaults, @jq_elem.data(), options)
      this.buildHtml()
      this.parseOptions()

    parseOptions: ->
      this.setValue(@options.number) if @options.number?
      this.animateTo(@options.animateTo) if @options.animateTo?

    buildHtml: ->
      i = 0
      digits = []
      while i < @options.digits
        digits.push "<span class=\"digit digit-#{i}\">#{@options.placeholder}</span>"
        i++
      @jq_elem.append digits.join("\n")

    animateTo: (value) ->
      startTime = new Date().getTime()
      time = 0
      if typeof value == 'string'
        if /^\d+$/.test(value)
          @targetValue = value
        else
          @targetValue = (@targetValue || 0) + eval(value)
      else 
        @targetValue = value

      if @options.max? and @targetValue > @options.max
        @jq_elem.trigger 'countdown:limit', {value: @targetValue, limit: 'max', limited_to: @options.max}
        @targetValue = @options.max

      if @options.min? and @targetValue < @options.min
        @jq_elem.trigger 'countdown:limit', {value: @targetValue, limit: 'min', limited_to: @options.min}
        @targetValue = @options.min

      difference = @targetValue - @value
      duration = @options.duration
      @oldValue = @value

      animationStep = =>
        time += 10 
        timeDifference = (new Date().getTime() - startTime) - time
        this.setValue Math.round( @options.easing(null, time, @oldValue, difference, duration) )
        if time < @options.duration
          return @timeout = setTimeout animationStep, 10 - timeDifference
        @jq_elem.trigger 'countdown:finished', {old_value: @oldValue, value: @value}

      clearTimeout @timeout if @timeout
      @timeout = setTimeout animationStep, 10

    stop: ->
      if @timeout
        clearTimeout @timeout
        @jq_elem.trigger 'countdown:stopped', {old_value: @oldValue, value: @value}
        delete @timeout

    setValue: (value) ->
      @value = value
      value = value.toString().lpad('0', @options.digits).split('')
      $('.digit', @jq_elem).each (index, digit) =>
        $(digit).text value[index]

    setOption: (option, value) ->
      @options[option] = value

unless typeof String::lpad == 'function'
  String::lpad = (padString, length) ->
    str = this
    while str.length < length
      str = padString + str
    return str
