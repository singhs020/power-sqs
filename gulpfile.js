const {src, series, task} = require("gulp");
const eslint = require("gulp-eslint");
const shell = require("gulp-shell");

function lint() {
  return src(["src/**/*.js"])
  .pipe(eslint())
  .pipe(eslint.failAfterError());
}

task("test", shell.task("nyc mocha 'test/**/*.spec.js'"));

exports.default = series([lint, "test"]);
exports.lint = lint;
