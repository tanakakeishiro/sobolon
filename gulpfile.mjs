// ===========================
// 📌 プラグインの読み込み
// ===========================
import gulp from "gulp";
import gulpSass from "gulp-sass";
import * as sass from "sass";
// gulp-sassにSassモジュールを渡す
const sassCompiler = gulpSass(sass);
import postcss from "gulp-postcss";
import autoprefixer from "autoprefixer";
import cssSorter from "css-declaration-sorter";
import mmq from "gulp-merge-media-queries";
import browserSync from "browser-sync";
import cleanCss from "gulp-clean-css";
import uglify from "gulp-uglify";
import rename from "gulp-rename";
import stylelint from "stylelint";
import prettier from "gulp-prettier";
import reporter from "postcss-reporter";
import postcssPresetEnv from "postcss-preset-env";

// ===========================
// 📌 パスの定義
// ===========================
const paths = {
  styles: {
    src: "./src/assets/sass/**/*.scss",
    dest: "./public/assets/css/",
  },
  scripts: {
    src: "./src/assets/js/**/*.js",
    dest: "./public/assets/js/",
  },
  html: {
    src: "./src/**/*.html",
    dest: "./public",
  },
  images: {
    src: "./src/assets/img/**/*",
    dest: "./public/assets/img/",
  },
};

// ===========================
// 📌 Sassのコンパイル & PostCSS
// ===========================
function compileSass() {
  return gulp
    .src(paths.styles.src)
    .pipe(sassCompiler().on("error", sassCompiler.logError)) // ここで使うのは 'sassCompiler'
    .pipe(
      postcss([
        autoprefixer(),
        cssSorter({ order: "concentric-css" }),
        postcssPresetEnv({
          stage: 0,
          features: {
            "logical-properties-and-values": true,
            "gap-properties": true,
            "custom-properties": true,
            clamp: true,
          },
        }),
      ])
    )
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(cleanCss())
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest(paths.styles.dest));
}

// ===========================
// 📌 JavaScriptの圧縮
// ===========================
function minJS() {
  return gulp
    .src(paths.scripts.src)
    .pipe(gulp.dest(paths.scripts.dest))
    .pipe(uglify())
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest(paths.scripts.dest));
}

// ===========================
// 📌 HTMLの整形（Prettier）
// ===========================
function formatHTML() {
  return gulp
    .src(paths.html.src)
    .pipe(
      prettier({
        tabWidth: 2,
        useTabs: false,
        printWidth: 80,
        singleQuote: false,
      })
    )
    .pipe(gulp.dest(paths.html.dest));
}

// ===========================
// 📌 画像のコピー
// ===========================
function copyImage() {
  return gulp
    .src(paths.images.src, { encoding: false })
    .pipe(gulp.dest(paths.images.dest));
}

// ===========================
// 📌 ブラウザの自動リロード
// ===========================
function browserReload(done) {
  browserSync.reload();
  done();
}

// ===========================
// 📌 ブラウザの初期化
// ===========================
function browserInit() {
  browserSync.init({
    server: {
      baseDir: "./public/",
    },
  });
}

// ===========================
// 📌 ファイル監視
// ===========================
function watchFiles() {
  gulp.watch(paths.styles.src, gulp.series(compileSass, browserReload));
  gulp.watch(paths.scripts.src, gulp.series(minJS, browserReload));
  gulp.watch(paths.images.src, gulp.series(copyImage, browserReload));
  gulp.watch(paths.html.src, gulp.series(formatHTML, browserReload));
}

// ===========================
// 📌 タスクのエクスポート
// ===========================
export { compileSass, minJS, formatHTML, copyImage, watchFiles, browserInit };

export const dev = gulp.parallel(watchFiles, browserInit);

gulp.task("default", gulp.series(compileSass, dev));

export const build = gulp.parallel(compileSass, minJS, formatHTML, copyImage);
