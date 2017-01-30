var gulp = require('gulp'),
    server = require('gulp-server-livereload'),
    useref = require('gulp-useref'),
    gulpif = require('gulp-if'),
    uglify = require('gulp-uglify'),
    minifyCss = require('gulp-clean-css'),
    handlebars = require('gulp-handlebars'),
    declare = require('gulp-declare'),
    wrap = require('gulp-wrap'),
    concat = require('gulp-concat'),
    nodemon = require('gulp-nodemon');


/**
 * Run livereload server
 */
gulp.task('server', ['nodemon'], function () {
 /* return gulp.src('./deploy/')
        .pipe(server({
            port: 8000,
            open: true,
            livereload: {
                defaultFile: 'index.html',
                enable: true,
                filter: function (filePath, cb) {
                    cb(!(/node_modules/.test(filePath)));
                }
            }
        }));*/
});


/**
 * Run nodemon
 */
gulp.task('nodemon', function (cb) {

    var started = false;

    return nodemon({
        script: './app/server.js'
    }).on('start', function () {
        // to avoid nodemon being started multiple times
        // thanks @matthisk
        if (!started) {
            cb();
            started = true;
        }
    });
});

/**
 * Run libs task
 */
gulp.task('html', ['templates'], function () {
    return gulp.src('./app/*.html')
        .pipe(useref())
        .pipe(gulpif('*.js', gulp.dest('deploy/public')))
        .pipe(gulpif('*.css', gulp.dest('deploy/public')))
        .pipe(gulpif('*.html', gulp.dest('deploy/')));
});

/**
 * Run images task
 */
gulp.task('images', function () {
    return gulp.src('./app/public/img/**/*.*')
        .pipe(gulp.dest('./deploy/public/img/'));
});

/**
 * Compiles all handlebars files
 */
gulp.task('templates', function () {
    return gulp.src('./app/**/*.hbs')
        .pipe(handlebars({
            handlebars: require('handlebars')
        }))
        .pipe(wrap('Handlebars.template(<%= contents %>)'))
        .pipe(declare({
            namespace: 'app.templates',
            noRedeclare: true, // Avoid duplicate declarations 
        }))
        .pipe(concat('templates.js'))
        .pipe(gulp.dest('./app/public/js', {
            overwrite: true
        }));
});


gulp.task('watch', function () {
    gulp.watch('./app/*.html', ['html']);
    gulp.watch('./app/**/*.js', ['html']);
    gulp.watch('./app/public/css/*.css', ['html']);
    gulp.watch('./app/public/img/*.*', ['images']);
    gulp.watch('./app/**/*.hbs', ['templates']);
});

gulp.task('default', ['html', 'images', 'watch'], function () {
    gulp.start('server');
});