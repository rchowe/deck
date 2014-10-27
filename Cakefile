
fs = require 'fs'
{print} = require 'sys'
{spawn} = require 'child_process'

task 'build', 'compile javascript', ->
	coffee = spawn 'coffee', ['-c', '-o', 'js', 'coffee']
	coffee.stderr.on 'data', (data) ->
		process.stderr.write data.toString()
	coffee.stdout.on 'data', (data) ->
		print data.toString()
	coffee.on 'exit', (code) ->
		print 'OK\n' if code is 0
