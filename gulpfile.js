//Paths
let srcDir = "#src";
let distDir = "dist";

let path = {
	dist:{
		img: distDir + "/img/",
		html: distDir + "/",
		css: distDir + "/css/",
		js: distDir + "/js/",
		fonts: distDir + "/fonts/",
	},
	src:{
		img: srcDir + '/img/**/*.{svg,png,jpg}',
		html: srcDir + "/*.html",
		css: srcDir + "/scss/main.scss",
		js: srcDir + "/js/index.js",
		fonts: srcDir + "/fonts/*.ttf",
	},
	watch:{
		img: srcDir + '/img/**/*.{svg,png,jpg}',
		html: srcDir + "/**/*.html",
		css: srcDir + "/scss/**/*.scss",
		js: srcDir + "/js/**/*.js",
	},
	clean:{
		img: distDir + "/img/**/*.{svg,png,jpg}",
		html: distDir + "/*.html",
		css: distDir + "/css/**/*.css",
		js: distDir + "/js/**/*.js",	
		fonts: distDir + "/fonts/*.{woff, woff2}",
	}
}
//END OF Paths


//Load Modules
let {src, dest} = require('gulp');
let gulp = require('gulp');
let browsersync = require('browser-sync').create();
let gulpFileInclude = require('gulp-file-include');
let del = require('del');
let gulpSass = require('gulp-sass');
let gulpGroupCSSMediaQueries = require('gulp-group-css-media-queries');
let gulpAutoprefixer = require('gulp-autoprefixer');
let gulpCSSNano = require('gulp-cssnano');
let gulpRename = require('gulp-rename');
let gulpUglifyEs = require('gulp-uglify-es').default;
let gulpBabel = require('gulp-babel');
let gulImagemin = require('gulp-imagemin');
let ttf2woff = require('gulp-ttf2woff');
let ttf2woff2 = require('gulp-ttf2woff2');
let fonter = require('gulp-fonter');
//END OF Load Modules


//Modules Setup
function browserSync(params) {
	browsersync.init({
		server: {
			baseDir: "./" + distDir + "/"
		},
		port: 3000
	});
}


function img() {
	return src(path.src.img)
	.pipe(dest(path.dist.img))
	.pipe(browsersync.stream());
}

function html() {
	return src(path.src.html)
	.pipe(gulpFileInclude())
	.pipe(dest(path.dist.html))
	.pipe(browsersync.stream());
}

function css() {
	return src(path.src.css)
		.pipe(gulpFileInclude())
		.pipe(gulpSass({otputStyle: "expanded"}))
		.pipe(gulpGroupCSSMediaQueries())
		.pipe(
			gulpAutoprefixer({
				overrideBrowserslist: ["last 5 versions"],
				cascade: true
			})
		)
		.pipe(gulpRename("styles.css"))
		.pipe(dest(path.dist.css))
		.pipe(gulpCSSNano())
		.pipe(gulpRename("styles.min.css"))
		.pipe(dest(path.dist.css))
		.pipe(browsersync.stream());
}

function js() {
	return src(path.src.js)
		.pipe(gulpFileInclude())
		.pipe(dest(path.dist.js))
		.pipe(gulpUglifyEs())
		.pipe(gulpBabel({
			presets: ['@babel/env']
		}))
		.pipe(gulpRename({extname: ".min.js"}))
		.pipe(dest(path.dist.js))
		.pipe(browsersync.stream());
}

function fonts() {
	src(path.src.fonts)
		.pipe(ttf2woff())
		.pipe(dest(path.dist.fonts));
	return src(path.src.fonts)
		.pipe(ttf2woff2())
		.pipe(dest(path.dist.fonts));
}

function clean(params) {
	return del([path.clean.html, path.clean.css, path.clean.js, path.clean.img]);
}

function fileWatch() {
	gulp.watch([path.watch.html, path.watch.css, path.watch.js, path.watch.img], dist);
}

let dist = gulp.series(clean, img, gulp.parallel(html, css, js, fonts));
let watch = gulp.parallel(dist, fileWatch, browserSync);
//END OF Modules Setup

//Tasks
gulp.task('imagemin', ()=>{
	return src(path.src.img)
	.pipe(
		gulImagemin({
			progressive: true,
			svgoPlugins:[{removeViewBox: false}],
			interlaced: true,
			optimizationLevel: 3 // 0 to 7
		})
	)
	.pipe(dest(path.dist.img));
});

gulp.task('otf2ttf', () => {
	return src([srcDir + '/fonts/*.otf'])
		.pipe( fonter({formats: ['ttf']}) )
		.pipe(dest(srcDir + '/fonts/'));
});

//Exports
exports.img = img;
exports.html = html;
exports.css = css;
exports.js = js;
exports.fonts = fonts;
exports.dist = dist;
exports.watch = watch;
exports.default = watch;
//END OF Exports
