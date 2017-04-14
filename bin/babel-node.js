var pathIsAbsolute = require("path-is-absolute");
var commander = require("commander");
var util = require("util");
var path = require("path");
var repl = require("repl");
var promiseRepl = require("promirepl").promirepl;
var babelCore = require("babel-core");
var vm = require("vm");
var babelRegister = require("babel-register");
var program = new commander.Command("babel-node");

program.option("-e, --eval [script]", "Evaluate script");
program.option("-p, --print [code]", "Evaluate script and print result");
program.option("-o, --only [globs]", "");
program.option("-i, --ignore [globs]", "");
program.option("-x, --extensions [extensions]", "List of extensions to hook into [.es6,.js,.es,.jsx]");
program.option("-w, --plugins [string]", "", babelCore.util.list);
program.option("-b, --presets [string]", "", babelCore.util.list);

var pkg = require("../package.json");

program.version(pkg.version);
program.usage("[options] [ -e script | script.js ] [arguments]");
program.parse(process.argv);

//

babelRegister({
	extensions: program.extensions,
	ignore: program.ignore,
	only: program.only,
	plugins: program.plugins,
	presets: program.presets
});

//

var replPlugin = function replPlugin() {
	return {
		visitor: {
			ModuleDeclaration: function ModuleDeclaration(path) {
				throw path.buildCodeFrameError("Modules aren't supported in the REPL");
			},

			VariableDeclaration: function VariableDeclaration(path) {
				if (path.node.kind !== "var") {
					throw path.buildCodeFrameError("Only `var` variables are supported in the REPL");
				}
			}
		}
	};
};

var _eval = function _eval(code, filename) {
	code = code.trim();
	if (!code) return undefined;

	code = babelCore.transform(code, {
		filename: filename,
		presets: program.presets,
		plugins: (program.plugins || []).concat([replPlugin])
	}).code;

	return vm.runInThisContext(code, {
		filename: filename
	});
};


function replEval(code, context, filename, callback) {
	var err = undefined;
	var result = undefined;

	try {
		if (code[0] === "(" && code[code.length - 1] === ")") {
			code = code.slice(1, -1); // remove "(" and ")"
		}

		result = _eval(code, filename);
	} catch (e) {
		err = e;
	}

	callback(err, result);
}

exports.start = function() {
	var newRepl = repl.start({
		prompt: "node> ",
		input: process.stdin,
		output: process.stdout,
		eval: replEval,
		useGlobal: true
	})
	promiseRepl(newRepl);
	return newRepl;
}
