// =============================
// 1. 画面の幅が375pxより小さい時、画面のサイズを固定する機能
// =============================
// 説明：スマホの画面が小さすぎると、ウェブサイトが変な形になっちゃうから、
//       375pxより小さい画面の時だけ、画面の幅を375pxに固定するよ

(function () {
  // 【変数】viewport = 画面の表示方法を決める設定を見つける
  // document.querySelector = HTMLの中から指定したものを探すメソッド
  // 'meta[name="viewport"]' = 「viewport」という名前の設定を探すセレクタ
  const viewport = document.querySelector('meta[name="viewport"]');
  
  // 【条件分岐】もし設定が見つからなかったら、ここで処理を終わる
  if (!viewport) return;

  // 【関数】switchViewport = 画面の幅に応じて設定を変える関数
  const switchViewport = () => {
    // 【変数】value = 設定する値（文字列）
    // window.outerWidth = ブラウザの画面の幅（数字）
    // 375より大きい時は「画面の幅に合わせる」、小さい時は「375pxに固定」
    const value =
      window.outerWidth > 375
        ? "width=device-width,initial-scale=1"  // 画面の幅に合わせる
        : "width=375";                           // 375pxに固定
    
    // 【条件分岐】今の設定と違う時だけ、新しい設定にする
    // getAttribute = 今の設定を取得するメソッド
    // setAttribute = 新しい設定を保存するメソッド
    if (viewport.getAttribute("content") !== value) {
      viewport.setAttribute("content", value);
    }
  };

  // 【イベントリスナー】画面のサイズが変わった時に、switchViewportを実行する
  // addEventListener = 何かが起きた時に実行するメソッド
  // "resize" = 画面のサイズが変わったというイベント
  addEventListener("resize", switchViewport, false);
  
  // ページが読み込まれた時にも一度実行する
  switchViewport();
})();

// =============================
// 2. メニューを開いた時、背景（ページ）をスクロールできないように固定する機能
// =============================
// 説明：メニューを開いている時、背景が動いちゃうと見づらいから、
//       メニューを開いたら背景を固定して、閉じたら元に戻すよ

// 【関数】backgroundFix = 背景を固定したり解除したりする関数
// 【引数】bool = true（固定する）か false（解除する）かを決める変数
const backgroundFix = (bool) => {
  // 【関数】scrollingElement = スクロールできる要素を見つける関数
  // "scrollingElement" in document = ブラウザが対応しているかチェック
  // 対応してる時は document.scrollingElement、してない時は document.documentElement を使う
  const scrollingElement = () =>
    "scrollingElement" in document
      ? document.scrollingElement
      : document.documentElement;

  // 【変数】scrollY = 今、ページのどこまでスクロールしているか（数字）
  // boolがtrueの時 = 今のスクロール位置を取得
  // boolがfalseの時 = 保存してた位置を取得（parseInt = 文字列を数字に変換）
  const scrollY = bool
    ? scrollingElement().scrollTop  // 今のスクロール位置
    : parseInt(document.body.style.top || "0");  // 保存してた位置

  // 【条件分岐】boolがtrueの時（メニューを開く時）
  if (bool) {
    // Object.assign = 複数の設定を一度に適用するメソッド
    // document.body.style = ページ全体のスタイル（見た目）を変える
    Object.assign(document.body.style, {
      height: "100vh",              // 高さを画面いっぱいに
      position: "fixed",             // 位置を固定する
      top: `${scrollY * -1}px`,      // 今の位置を保つ（マイナスにする）
      left: "0",                     // 左端に配置
      width: "100vw",                // 幅を画面いっぱいに
    });
  } else {
    // 【条件分岐】boolがfalseの時（メニューを閉じる時）
    // 固定を解除して、元の設定に戻す
    Object.assign(document.body.style, {
      height: "",      // 高さを元に戻す
      position: "",    // 固定を解除
      top: "",         // 位置を元に戻す
      left: "",        // 左端の設定を解除
      width: "",       // 幅を元に戻す
    });
    // スクロール位置を元の場所に戻す
    // window.scrollTo = 指定した位置にスクロールするメソッド
    window.scrollTo(0, scrollY * -1);
  }
};

const CLASS = "is-checked";
let flg = false;
const $hamburger = jQuery("#js-drawer-button");
const $menu = jQuery("#js-drawer-content");
const $focusTrap = jQuery("#js-focus-trap");
const $firstLink = jQuery(".header__link").first();

// メニューを閉じる処理（共通化）
const closeMenu = () => {
  $hamburger
    .removeClass(CLASS)
    .attr({
      "aria-expanded": "false",
      "aria-haspopup": "menu",
    })
    .focus();
  $menu.removeClass(CLASS);
  backgroundFix(false);
  flg = false;
};

// メニューを開く処理
const openMenu = () => {
  $hamburger
    .addClass(CLASS)
    .attr("aria-expanded", "true")
    .removeAttr("aria-haspopup");
  $menu.addClass(CLASS);
  backgroundFix(true);
  flg = true;
  setTimeout(() => $firstLink.length && $firstLink.focus(), 100);
};

// メニュー開閉制御
$hamburger.on("click", function (e) {
  e.preventDefault();
  flg ? closeMenu() : openMenu();
});

// エスケープキーでメニューを閉じる
jQuery(window).on("keydown", (e) => {
  if (e.key === "Escape" && flg) closeMenu();
});

// フォーカストラップ制御
$focusTrap.on("focus", () => $hamburger.focus());

// アンカーリンククリックでメニューを閉じる
jQuery('#js-drawer-content a[href^="#"]').on("click", closeMenu);
// =============================
// フォームバリデーション（jQuery）
// =============================

jQuery(function ($) {
  const $form = $("#js-contact-form");
  if (!$form.length) return;

  const fields = [
    {
      $input: $("#your-name"),
      $error: $("#js-error-name"),
      validate: (val) => val.trim() !== "",
      message: "必須項目です。",
    },
    {
      $input: $("#your-email"),
      $error: $("#js-error-email"),
      validate: (val) => val.includes("@"),
      message: "メールアドレスの形式でご入力ください。",
    },
    {
      $input: $("#your-message"),
      $error: $("#js-error-message"),
      validate: (val) => val.trim() !== "",
      message: "必須項目です。",
    },
  ];

  const $inputPrivacy = $("#your-privacy");
  const $errorPrivacy = $("#js-error-privacy");

  const scrollToElement = ($el) => {
    const el = $el.get(0);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const clearError = ($input, $errorEl) => {
    $input.removeClass("is-invalid");
    $errorEl.length && $errorEl.text("");
  };

  const setError = ($input, $errorEl, message) => {
    $input.addClass("is-invalid");
    $errorEl.length && $errorEl.text(message);
  };

  // blur / focus 時の簡易バリデーション
  fields.forEach(({ $input, $error, validate, message }) => {
    $input
      .on("blur", function () {
        if (!validate($input.val())) {
          setError($input, $error, message);
        }
      })
      .on("focus", () => clearError($input, $error));
  });

  // プライバシーポリシー同意チェック
  if ($inputPrivacy.length) {
    $inputPrivacy.on("change", function () {
      $inputPrivacy.prop("checked")
        ? clearError($inputPrivacy, $errorPrivacy)
        : setError($inputPrivacy, $errorPrivacy, "必須項目です。");
    });
  }

  // フォーム送信時のバリデーション
  $form.on("submit", function (event) {
    let hasError = false;

    // エラーをクリア
    fields.forEach(({ $input, $error }) => clearError($input, $error));
    if ($inputPrivacy.length) clearError($inputPrivacy, $errorPrivacy);

    // バリデーション実行
    fields.forEach(({ $input, $error, validate, message }) => {
      if (!validate($input.val())) {
        setError($input, $error, message);
        if (!hasError) {
          scrollToElement($input);
          hasError = true;
        }
      }
    });

    if ($inputPrivacy.length && !$inputPrivacy.prop("checked")) {
      setError($inputPrivacy, $errorPrivacy, "必須項目です。");
      if (!hasError) {
        scrollToElement($inputPrivacy);
        hasError = true;
      }
    }

    if (hasError) event.preventDefault();
  });
});
