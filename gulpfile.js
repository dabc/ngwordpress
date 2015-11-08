var gulp = require('gulp'),
    concat = require('gulp-concat'),
    connect = require('gulp-connect'),
    mainBowerFiles = require('main-bower-files'),
    less = require('gulp-less'),
    jshint = require('gulp-jshint'),
    karma = require('karma').server,
    sourcemaps = require('gulp-sourcemaps'),
    del = require('del'),
    uglify = require('gulp-uglify'),
    minifyCss = require('gulp-minify-css'),
    gulpFilter = require('gulp-filter'),
    ngAnnotate = require('gulp-ng-annotate');

var paths = {
    styles: ['./app/less/**/*.less'],
    scripts: ['./app/modules/**/*.js', './app/scripts/**/*.js'],
    html: ['./app/modules/**/*.html'],
    tests: ['./tests/*.js']
};

// clean
gulp.task('clean', function () {
    return del([
        './build/**/*'
    ]);
});

// vendor scripts and css
gulp.task('vendor', ['clean'], function () {
    var jsFilter = gulpFilter('*.js', {restore: true});
    var cssFilter = gulpFilter(['*.css','*.less'], {restore: true});

    return gulp.src(mainBowerFiles())
        // js
        .pipe(jsFilter)
        .pipe(concat('vendor.js'))
        .pipe(gulp.dest('./build/scripts'))
        .pipe(jsFilter.restore)

        // css
        .pipe(cssFilter)
        .pipe(less())
        .pipe(concat('vendor.css'))
        .pipe(gulp.dest('./build/stylesheets'));
});

// vendor fonts
gulp.task('fontawesome', ['clean'], function () {
    return gulp.src('./bower_components/fontawesome/fonts/**/*.{ttf,woff,woff2,eof,svg}')
        .pipe(gulp.dest('./build/fonts'));
});
gulp.task('vendor-fonts', ['fontawesome']);

gulp.task('vendor-build', ['vendor', 'vendor-fonts']);

// app
var appJs = function () {
    return gulp.src(paths.scripts)
        .pipe(concat('app.js'))
        .pipe(ngAnnotate({ single_quotes: true }))
        .pipe(connect.reload())
        .pipe(gulp.dest('./build/scripts'));
};
gulp.task('app-js', ['clean'], appJs);
gulp.task('app-js-watch', appJs);

var appHtml = function () {
    return gulp.src(paths.html)
        .pipe(connect.reload())
        .pipe(gulp.dest('./build/modules'));
};
gulp.task('app-html', ['clean'], appHtml);
gulp.task('app-html-watch', appHtml);

var appCss = function () {
    return gulp.src(paths.styles)
        .pipe(less())
        .pipe(connect.reload())
        .pipe(gulp.dest('./build/stylesheets'));
};
gulp.task('app-css', ['clean'], appCss);
gulp.task('app-css-watch', appCss);

gulp.task('app-build', ['app-js', 'app-html', 'app-css']);

// code linting
gulp.task('lint', function () {
    return gulp.src(paths.scripts)
        .pipe(jshint({ devel: true, debug: true }))
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(jshint.reporter('fail'));
});

// uglify
gulp.task('uglify-vendor-js', ['build'], function () {
    gulp.src('./build/scripts/vendor.js')
        .pipe(uglify())
        .pipe(gulp.dest('./build/scripts'));
});

gulp.task('uglify-app-js', ['build'], function () {
    gulp.src('./build/scripts/app.js')
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./build/scripts'));
});

gulp.task('uglify-app-css', ['build'], function () {
    gulp.src('./build/stylesheets/style.css')
        .pipe(sourcemaps.init())
        .pipe(minifyCss())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./build/stylesheets'));
});
gulp.task('uglify', ['uglify-vendor-js', 'uglify-app-js', 'uglify-app-css']);

// tests
gulp.task('test', function (done) {
    karma.start({
        configFile: 'karma.conf.js',
        singleRun: true
    }, done);
});

// dev server
gulp.task('connect', ['build'], function () {
    connect.server({
        port: 3000,
        root: 'build',
        livereload: true
    });
});

// watch files
gulp.task('watch', ['connect'], function () {
    gulp.watch(paths.html, ['app-html-watch']);
    gulp.watch(paths.scripts, ['lint', 'app-js-watch']);
    gulp.watch(paths.styles, ['app-css-watch']);
});

// build
gulp.task('build', ['vendor-build', 'app-build', 'lint'], function () {
    return gulp.src('index.html')
        .pipe(gulp.dest('build'));
});

// deploy
gulp.task('deploy', ['build'], function () {
    del(['./dist/**/*']).then(function () {
        return gulp.src('./build/**/*')
            .pipe(gulp.dest('dist'));
    });
});

// default gulp task
gulp.task('default', ['build', 'connect', 'watch']);
