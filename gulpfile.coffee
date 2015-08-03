gulp = require 'gulp'
gutil = require 'gulp-util'
parentDir = "app/"

#load all module
$ = require('gulp-load-plugins')({
	pattern: ['gulp-*', 'gulp.*'],
	replaceString: /\bgulp[\-.]/
})

browserSync = require 'browser-sync'
reload = browserSync.reload
runSequence = require('run-sequence');

gulp.task 'default', ->
	console.log 'gulp!'

#coffee compile
gulp.task 'coffee', ->
	gulp
	.src ['src/coffee/*.coffee']
	.pipe $.plumber()
	.pipe $.coffee()
	.pipe gulp.dest parentDir + 'js'

#typescript compile by gulp-ts
###
gulp.task 'tsc', () ->
	gulp
	.src ['src/*.ts','src/*/*.ts']
#	 --outオプションでひとまとめにコンパイル
	.pipe $.typescript({ target: "ES5", removeComments: true, out: "main.js" })
	.pipe $.plumber()
	.pipe $.tsc()
	.pipe gulp.dest parentDir + 'js'
###

#typescript compile using gulp-typescript
gulp.task 'typescript', () ->
	gulp
		.src ['src/*.ts','src/*/*.ts']
		.pipe $.plumber()
		.pipe $.typescript {
			# module:"amd"
			# target: 'ES6'
			removeComments: true
			sortOutput: false
			sourcemap: false
			out: 'app.js'
		}
		.pipe gulp.dest parentDir + 'js'

#run server / watch
gulp.task 'serve', ['default'], ->
	browserSync
		notify: false
		server:
			baseDir: [parentDir]
	gulp.watch ['src/coffee/*.coffee'], ['script']
	gulp.watch ['src/*.ts','src/*/*.ts'], ['script_type']
	gulp.watch [parentDir + '*.html'], reload

#coffee compile&reload
gulp.task 'script', ->
	runSequence 'coffee', reload

#typescript compile&reload
gulp.task 'script_type', ->
	runSequence 'typescript', reload
