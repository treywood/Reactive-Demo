var babel = require("broccoli-babel-transpiler");
var ES6Modules = require("broccoli-es6modules");
var funnel = require("broccoli-funnel");
var mergeTrees = require("broccoli-merge-trees");

var appJs = babel(new ES6Modules("src/js", {
  format: 'cjs',
  bundleOptions: {
    entry: 'index.js',
    name: 'index'
  }
}));

appJs = funnel(appJs, { destDir: 'js' });
var libs = funnel('src', { include: ["js/lib/**.*js"]});
var index = funnel('src', { files: ["index.html"] });

module.exports = mergeTrees([index, libs, appJs]);
