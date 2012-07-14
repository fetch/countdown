$.fn.extend 
  counter: (options, args...) ->
    this.each ->
      counter = $(this).data 'counter'
      if counter
        counter[options].apply(counter, args) if counter[options]
      else
        $(this).data 'counter', new Countdown( this, options )

class Countdown
  
  @defaults = 
    placeholder: '-'
    duration: 1000
    digits: 8
    easing: (x, t, b, c, d) ->
      # Default linear interpolation
      c*t/d + b;
  
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
      @targetValue = (@targetValue || 0) + eval(value)
    else 
      @targetValue = value
    difference = @targetValue - @value
    duration = @options.duration
    @oldValue = @value
    
    animationStep = =>
      time += 10 
      timeDifference = (new Date().getTime() - startTime) - time
      this.setValue Math.round( @options.easing(null, time, @oldValue, difference, duration) )
      if time < @options.duration
        return @timeout = setTimeout animationStep, 10 - timeDifference
      @jq_elem.trigger 'counter:finished', {old_value: @oldValue, value: @value}
    
    clearTimeout @timeout if @timeout
    @timeout = setTimeout animationStep, 10
  
  stop: ->
    if @timeout
      clearTimeout @timeout
      @jq_elem.trigger 'counter:stopped', {old_value: @oldValue, value: @value}
      delete @timeout
  
  setValue: (value) ->
    @value = value 
    pad = '0' # if value > 0 then '0' else @options.placeholder
    value = value.toString().lpad(pad, @options.digits).split('')
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
