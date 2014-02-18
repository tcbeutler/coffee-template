# * build - compiles your src directory to your lib directory
# * watch - watches any changes in your src directory and automatically compiles to the lib directory
# * test  - runs mocha test framework, you can edit this task to use your favorite test framework
# * clean - clean generated .js files
files = [
  'lib'
  'src'
]

fs = require 'fs'
{print} = require 'util'
{spawn, exec} = require 'child_process'

try
  which = require('which').sync
catch err
  if process.platform.match(/^win/)?
    console.log 'WARNING: the which module is required for windows\ntry: npm install which'
  which = null

# ANSI Terminal Colors
bold = '\x1b[0;1m'
green = '\x1b[0;32m'
reset = '\x1b[0m'
red = '\x1b[0;31m'

# Cakefile Tasks
#
# ## *build*
#
# Builds Source
#
# <small>Usage</small>
#
# ```
# cake build
# ```
task 'build', 'compile source', -> build -> log ":)", green

# ## *watch*
#
# Builds your source whenever it changes
#
# <small>Usage</small>
#
# ```
# cake watch
# ```
task 'watch', 'compile and watch', -> build true, -> log ":-)", green

# ## *test*
#
# Runs your test suite.
#
# <small>Usage</small>
#
# ```
# cake test
# ```
task 'test', 'run tests', -> build -> mocha -> log ":)", green

# ## *clean*
#
# Cleans up generated js files
#
# <small>Usage</small>
#
# ```
# cake clean
# ```
task 'clean', 'clean generated files', -> clean -> log ";)", green


# Internal Functions
#
# ## *walk* 
#
# **given** string as dir which represents a directory in relation to local directory
# **and** callback as done in the form of (err, results)
# **then** recurse through directory returning an array of files
#
# Examples
#
# ``` coffeescript
# walk 'src', (err, results) -> console.log results
# ```
walk = (dir, done) ->
  results = []
  fs.readdir dir, (err, list) ->
    return done(err, []) if err
    pending = list.length
    return done(null, results) unless pending
    for name in list
      file = "#{dir}/#{name}"
      try
        stat = fs.statSync file
      catch err
        stat = null
      if stat?.isDirectory()
        walk file, (err, res) ->
          results.push name for name in res
          done(null, results) unless --pending
      else
        results.push file
        done(null, results) unless --pending

# ## *log* 
# 
# **given** string as a message
# **and** string as a color
# **and** optional string as an explanation
# **then** builds a statement and logs to console.
# 
log = (message, color, explanation) -> console.log color + message + reset + ' ' + (explanation or '')

# ## *launch*
#
# **given** string as a cmd
# **and** optional array and option flags
# **and** optional callback
# **then** spawn cmd with options
# **and** pipe to process stdout and stderr respectively
# **and** on child process exit emit callback if set and status is 0
launch = (cmd, options=[], callback) ->
  op = ['/c', cmd].concat options
  cp = spawn process.env.comspec, op, { stdio: 'inherit' }
  cp.on 'exit', (status) -> callback?() if status is 0

# ## *build*
#
# **given** optional boolean as watch
# **and** optional function as callback
# **then** invoke launch passing coffee command
# **and** defaulted options to compile src to lib
build = (watch, callback) ->
  if typeof watch is 'function'
    callback = watch
    watch = false

  options = ['-c', '-b', '-o' ]
  options = options.concat files
  options.unshift '-w' if watch
  launch 'coffee', options, callback

# ## *unlinkIfCoffeeFile*
#
# **given** string as file
# **and** file ends in '.coffee'
# **then** convert '.coffee' to '.js'
# **and** remove the result
unlinkIfCoffeeFile = (file) ->
  if file.match /\.coffee$/
    fs.unlink file.replace('src','lib').replace(/\.coffee$/, '.js'), ->
    true
  else false

# ## *clean*
#
# **given** optional function as callback
# **then** loop through files variable
# **and** call unlinkIfCoffeeFile on each
clean = (callback) ->
  try
    for file in files
      unless unlinkIfCoffeeFile file
        walk file, (err, results) ->
          for f in results
            unlinkIfCoffeeFile f

    callback?()
  catch err

# ## *moduleExists*
#
# **given** name for module
# **when** trying to require module
# **and** not found
# **then* print not found message with install helper in red
# **and* return false if not found
moduleExists = (name) ->
  try 
    require name 
  catch err 
    log "#{name} required: npm install #{name}", red
    false


# ## *mocha*
#
# **given** optional array of option flags
# **and** optional function as callback
# **then** invoke launch passing mocha command
mocha = (options, callback) ->
  #if moduleExists('mocha')
  if typeof options is 'function'
    callback = options
    options = []
  # add coffee directive
  options.push 'node_modules/mocha/bin/_mocha'
  options.push '--compilers'
  options.push 'coffee:coffee-script/register'
  options.push '--reporter'
  options.push 'spec'
  
  launch 'node', options, callback


