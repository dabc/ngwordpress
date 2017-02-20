var gulp = require('gulp'),
    concat = require('gulp-concat'),
    connect = require('gulp-connect'),
    mainBowerFiles = require('main-bower-files'),
    less = require('gulp-less'),
    jshint = require('gulp-jshint'),
    sourcemaps = require('gulp-sourcemaps'),
    del = require('del'),
    uglify = require('gulp-uglify'),
    cssnano = require('gulp-cssnano'),
    gulpFilter = require('gulp-filter'),
    ngAnnotate = require('gulp-ng-annotate'),
    p = require('./package.json');

var paths = {
    styles: ['./app/less/**/*.less','!./app/less/variables/bootstrap-overrides.less'],
    scripts: ['./app/modules/**/*.js', './app/scripts/**/*.js'],
    html: ['./app/modules/**/*.html'],
    config: ['./config/*.json']
};

// clean
gulp.task('clean', function () {
    return del([
        './build/**/*',
        './dist/**/*'
    ]);
});

// vendor scripts and css
gulp.task('bower', ['clean'], function () {
    var jsFilter = gulpFilter('*.js', {restore: true});
    var cssFilter = gulpFilter(['*.css','*.less'], {restore: true});
    var imageFilter = gulpFilter(['*.jpg','*.png'], {restore: true});

    return gulp.src(mainBowerFiles())
        // js
        .pipe(jsFilter)
        .pipe(sourcemaps.init())
        .pipe(concat('vendor.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./build/scripts'))
        .pipe(jsFilter.restore)

        // css
        .pipe(cssFilter)
        .pipe(less())
        .pipe(concat('bower.css'))
        .pipe(gulp.dest('./.tmp'))
        .pipe(cssFilter.restore)

        // images
        .pipe(imageFilter)
        .pipe(gulp.dest('./build/stylesheets/images'))
});

// handle bootstrap separately to facilitate bootstrap overrides
// copy bootstrap mixins
gulp.task('bootstrapMixins', ['bower'], function () {
    return gulp.src('./bower_components/bootstrap/less/mixins/*.less')
        .pipe(gulp.dest('./.tmp/bootstrap/mixins'));
});

// copy bootstrap less files
gulp.task('bootstrap', ['bootstrapMixins'], function () {
    return gulp.src('./bower_components/bootstrap/less/*.less')
        .pipe(gulp.dest('./.tmp/bootstrap'));
});

// concat bootstrap variables and custom bootstrap override variables
gulp.task('bootstrapVariables', ['bootstrap'], function () {
    return gulp.src(['./bower_components/bootstrap/less/variables.less','./app/less/variables/bootstrap-overrides.less'])
        .pipe(concat('variables.less'))
        .pipe(gulp.dest('./.tmp/bootstrap'));
});

// compile bootstrap less
gulp.task('compileBootstrap', ['bootstrapVariables'], function () {
    return gulp.src('./.tmp/bootstrap/bootstrap.less')
        .pipe(less())
        .pipe(gulp.dest('./.tmp'))
});

// concat bootstrap and other bower css
gulp.task('vendor', ['compileBootstrap'], function () {
    return gulp.src('./.tmp/*.css')
        .pipe(concat('vendor.css'))
        .pipe(gulp.dest('./build/stylesheets'));
});

// vendor fonts
gulp.task('fontawesome', ['clean'], function () {
    return gulp.src('./bower_components/fontawesome/fonts/**/*.{otf,eot,woff,woff2,svg,ttf}')
        .pipe(gulp.dest('./build/fonts'));
});

gulp.task('glyphicons', ['clean'], function () {
    return gulp.src('./bower_components/bootstrap/fonts/**/*.{otf,eot,woff,woff2,svg,ttf}')
        .pipe(gulp.dest('./build/fonts'));
});

gulp.task('vendor-fonts', ['fontawesome','glyphicons']);

gulp.task('vendor-build', ['vendor', 'vendor-fonts'], function () {
    return del([
        './.tmp'
    ]);
});

// app
var appJs = function () {
    return gulp.src(paths.scripts)
        .pipe(sourcemaps.init())
        .pipe(concat('app.js'))
        .pipe(ngAnnotate({ single_quotes: true }))
        .pipe(sourcemaps.write())
        .pipe(connect.reload())
        .pipe(gulp.dest('./build/scripts'));
};
gulp.task('app-js', ['clean'], appJs);
gulp.task('app-js-watch', appJs);

var appConfig = function () {
    return gulp.src(paths.config)
        .pipe(gulp.dest('./build/config'));
};
gulp.task('app-config', ['clean'], appConfig);

var appHtml = function () {
    return gulp.src(paths.html)
        .pipe(connect.reload())
        .pipe(gulp.dest('./build/modules'));
};
gulp.task('app-html', ['clean'], appHtml);
gulp.task('app-html-watch', appHtml);

var appCss = function () {
    return gulp.src(paths.styles)
        .pipe(sourcemaps.init())
        .pipe(less())
        .pipe(concat('app.css'))
        .pipe(sourcemaps.write())
        .pipe(connect.reload())
        .pipe(gulp.dest('./build/stylesheets'));
};
gulp.task('app-css', ['clean'], appCss);
gulp.task('app-css-watch', appCss);

gulp.task('app-build', ['app-js', 'app-config', 'app-html', 'app-css']);

// code linting
gulp.task('lint', function () {
    return gulp.src(paths.scripts)
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
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
    return gulp.src('app/index.html')
        .pipe(gulp.dest('build'));
});

// copy build files to dist
gulp.task('dist-copy', ['build'], function () {
    return gulp.src('./build/**/*')
        .pipe(gulp.dest('dist'));
});

// uglify dist files
gulp.task('uglify-vendor-js', ['dist-copy'], function () {
    gulp.src('./dist/scripts/vendor.js')
        .pipe(uglify())
        .pipe(gulp.dest('./dist/scripts'));
});

gulp.task('uglify-app-js', ['dist-copy'], function () {
    gulp.src('./dist/scripts/app.js')
        .pipe(uglify())
        .pipe(gulp.dest('./dist/scripts'));
});

gulp.task('uglify-app-css', ['dist-copy'], function () {
    gulp.src('./dist/stylesheets/*.css')
        .pipe(cssnano())
        .pipe(gulp.dest('./dist/stylesheets'));
});

// main dist task
gulp.task('dist', ['uglify-vendor-js', 'uglify-app-js', 'uglify-app-css']);

gulp.task('deploy', ['deploy-ngwordpress'], function () {
    return del([
        './ngwordpress'
    ]);
});

// default gulp task
gulp.task('default', ['watch']);
