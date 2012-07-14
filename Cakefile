# Building Counter requires coffee-script and uglify-js. For
# help installing, try: 
#
# `npm install -d`
# 
# Or to install globally:
# 
# `npm install -dg`
#

fs               = require 'fs'
path             = require 'path'
{spawn, exec}    = require 'child_process'
CoffeeScript     = require 'coffee-script'
{parser, uglify} = require 'uglify-js'

javascripts = {
  'counter/counter.jquery.js':[
    'coffee/counter.coffee'
  ]
}

Array::unique = ->
  output = {}
  output[@[key]] = @[key] for key in [0...@length]
  value for key, value of output

# Gather a list of unique source files.
#
source_files = ->
  all_sources = []
  for javascript, sources of javascripts
    for source in sources
      all_sources.push source
  all_sources.unique()

# Get the version number
#
version = ->
  "#{fs.readFileSync('VERSION')}".replace /[^0-9a-zA-Z.]*/gm, ''

version_tag = ->
  "v#{version()}"

# Write files with a header
#
write_javascript = (filename, body, trailing='') ->
  fs.writeFileSync filename, """
// Counter, a Count Down plugin for jQuery and Protoype
// by Koen Punt for Fetch!, http://www.fetch.nl
// 
// Version #{version()}
// Full source at https://github.com/FetchNL/counter
// Copyright (c) 2012 Fetch! http://www.fetch.nl

// MIT License, https://github.com/FetchNL/counter/blob/master/LICENSE.md
// This file is generated by `cake build`, do not edit it by hand.
#{body}#{trailing}
"""
  console.log "Wrote #{filename}"

# Build Counter.
#
task 'build', 'build Counter from source', build = (cb) ->
  file_name = null; file_contents = null
  try
    for javascript, sources of javascripts
      code = ''
      for source in sources
        file_name = source
        file_contents = "#{fs.readFileSync source}"
        code += CoffeeScript.compile file_contents
      write_javascript javascript, code
      unless process.env.MINIFY is 'false'
        write_javascript javascript.replace(/\.js$/,'.min.js'), (
          uglify.gen_code uglify.ast_squeeze uglify.ast_mangle parser.parse code
        ), ';'
    package_npm () ->
      cb() if typeof cb is 'function'
  catch e
    print_error e, file_name, file_contents
 
task 'watch', 'watch coffee/ for changes and build Counter', ->
  console.log "Watching for changes in coffee/"
  for file in source_files()
    # Coffeescript wasn't scoping file correctly-
    # without this closure the file name displayed
    # is incorrect.
    ((file) ->
      fs.watchFile file, (curr, prev) ->
        if +curr.mtime isnt +prev.mtime
          console.log "Saw change in #{file}"
          invoke 'build'
    )(file)

task 'package_npm', 'generate the package.json file for npm', package_npm = (cb) ->
  try
    package_file = 'package.json'
    package_obj = JSON.parse("#{fs.readFileSync package_file}")
    package_obj['version'] = version()
    fs.writeFileSync package_file, JSON.stringify(package_obj, null, 2)
    console.log "Wrote #{package_file}"
    cb() if typeof cb is 'function'
  catch e
    print_error e, package_file

print_error = (error, file_name, file_contents) ->
  line = error.message.match /line ([0-9]+):/
  if line && line[1] && line = parseInt(line[1])
    contents_lines = file_contents.split "\n"
    first = if line-4 < 0 then 0 else line-4
    last  = if line+3 > contents_lines.size then contents_lines.size else line+3
    console.log "Error compiling #{file_name}. \"#{error.message}\"\n"
    index = 0
    for line in contents_lines[first...last]
      index++
      line_number = first + 1 + index
      console.log "#{(' ' for [0..(3-(line_number.toString().length))]).join('')} #{line}"
  else
    console.log """
Error compiling #{file_name}:
  
  #{error.message}

"""

