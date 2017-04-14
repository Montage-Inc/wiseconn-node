require('babel-polyfill');
require('legit-inflectors');
var fs = require('fs')
var repl = require('./babel-node')

// Preload the client
var AlsoEnergy = require('../lib/AlsoEnergy');

// Run the console
var replServer = repl.start()
replServer.context.AlsoEnergy = AlsoEnergy.default;
replServer.on('exit', function() {
	process.exit()
})
