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
import { deleteAsync } from "del";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
  // Sassファイルの監視（削除も検知）
  gulp.watch(paths.styles.src, { events: "all" }, function (cb) {
    compileSass();
    cb();
  }).on("unlink", function (filepath) {
    const filePathFromSrc = path.relative(path.resolve("src/assets/sass"), filepath);
    const destFilePath = path.resolve("public/assets/css", filePathFromSrc.replace(/\.scss$/, ".css"));
    const destMinFilePath = path.resolve("public/assets/css", filePathFromSrc.replace(/\.scss$/, ".min.css"));
    deleteAsync([destFilePath, destMinFilePath]).then(() => {
      browserSync.reload();
    });
  });

  // JavaScriptファイルの監視（削除も検知）
  gulp.watch(paths.scripts.src, { events: "all" }, function (cb) {
    minJS();
    cb();
  }).on("unlink", function (filepath) {
    const filePathFromSrc = path.relative(path.resolve("src/assets/js"), filepath);
    const destFilePath = path.resolve("public/assets/js", filePathFromSrc);
    const destMinFilePath = path.resolve("public/assets/js", filePathFromSrc.replace(/\.js$/, ".min.js"));
    deleteAsync([destFilePath, destMinFilePath]).then(() => {
      browserSync.reload();
    });
  });

  // 画像ファイルの監視（削除も検知）
  gulp.watch(paths.images.src, { events: "all" }, function (cb) {
    copyImage();
    cb();
  }).on("unlink", function (filepath) {
    const filePathFromSrc = path.relative(path.resolve("src/assets/img"), filepath);
    const destFilePath = path.resolve("public/assets/img", filePathFromSrc);
    deleteAsync([destFilePath]).then(() => {
      browserSync.reload();
    });
  });

  // HTMLファイルの監視（削除も検知）
  gulp.watch(paths.html.src, { events: "all" }, function (cb) {
    formatHTML();
    cb();
  }).on("unlink", function (filepath) {
    const filePathFromSrc = path.relative(path.resolve("src"), filepath);
    const destFilePath = path.resolve("public", filePathFromSrc);
    deleteAsync([destFilePath]).then(() => {
      browserSync.reload();
    });
  });
}

// ===========================
// 📌 publicフォルダのクリーンアップ
// ===========================
function clean() {
  return deleteAsync(["public/**/*", "!public"]);
}

// ===========================
// 📌 タスクのエクスポート
// ===========================
export { compileSass, minJS, formatHTML, copyImage, watchFiles, browserInit, clean };

export const dev = gulp.series(clean, gulp.parallel(compileSass, minJS, formatHTML, copyImage), gulp.parallel(watchFiles, browserInit));

gulp.task("default", gulp.series(clean, compileSass, gulp.parallel(watchFiles, browserInit)));

export const build = gulp.series(clean, gulp.parallel(compileSass, minJS, formatHTML, copyImage));
