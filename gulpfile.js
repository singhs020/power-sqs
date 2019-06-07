const {src, series} = require("gulp");
const eslint = require("gulp-eslint");


function lint() {
  return src(["src/**/*.js"])
  .pipe(eslint())
  .pipe(eslint.failAfterError());
}

exports.default = series([lint]);
exports.lint = lint;
