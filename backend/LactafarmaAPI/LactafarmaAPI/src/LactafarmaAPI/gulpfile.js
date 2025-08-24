var gulp = require('gulp');
var uglify = require('gulp-uglify');

gulp.task('minify', function () {
    return gulp.src("wwwroot/js/*.js")
        .pipe(uglify())
        .pipe(gulp.dest("wwwroot/lib/_app")); 
});