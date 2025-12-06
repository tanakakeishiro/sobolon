//375px 未満は JS で viewport を固定する
// =============================
(function () {
  // <meta name="viewport"> タグを取得（ビューポートの設定を変更するため）
  const viewport = document.querySelector('meta[name="viewport"]');

  // 画面幅に応じて viewport の content 属性を切り替える関数
  function switchViewport() {
    // 画面の外枠の幅（ブラウザのスクロールバーなどを含む）をチェック
    const value =
      window.outerWidth > 375
        ? // 375px より広い場合は、通常のレスポンシブ表示（端末幅に合わせる）
          "width=device-width,initial-scale=1"
        : // 375px 以下の狭い画面では、幅を固定（375px に強制）
          "width=375";

    // すでに設定されている content と異なる場合のみ変更を加える
    if (viewport.getAttribute("content") !== value) {
      viewport.setAttribute("content", value);
    }
  }

  // ウィンドウサイズが変更されたときに switchViewport を実行する
  addEventListener("resize", switchViewport, false);

  // 初回読み込み時にも現在の幅に応じて viewport を設定する
  switchViewport();
})();

// メニュー展開時に背景を固定
const backgroundFix = (bool) => {
  const scrollingElement = () => {
    const browser = window.navigator.userAgent.toLowerCase();
    if ("scrollingElement" in document) return document.scrollingElement;
    return document.documentElement;
  };

  const scrollY = bool
    ? scrollingElement().scrollTop
    : parseInt(document.body.style.top || "0");

  const fixedStyles = {
    height: "100vh",
    position: "fixed",
    top: `${scrollY * -1}px`,
    left: "0",
    width: "100vw",
  };

  Object.keys(fixedStyles).forEach((key) => {
    document.body.style[key] = bool ? fixedStyles[key] : "";
  });

  if (!bool) {
    window.scrollTo(0, scrollY * -1);
  }
};

// 変数定義
const CLASS = "is-checked";
let flg = false;
const $hamburger = jQuery("#js-drawer-button");
const $menu = jQuery("#js-drawer-content");
const $focusTrap = jQuery("#js-focus-trap");
const $firstLink = jQuery(".header__link").first();

// メニュー開閉制御
$hamburger.on("click", function (e) {
  e.preventDefault();
  $hamburger.toggleClass(CLASS);
  $menu.toggleClass(CLASS);

  if (flg) {
    // メニューを閉じる
    backgroundFix(false);
    $hamburger.attr("aria-expanded", "false");
    $hamburger.focus();
    flg = false;
  } else {
    // メニューを開く
    backgroundFix(true);
    $hamburger.attr("aria-expanded", "true");
    flg = true;
    // メニューが開いたら先頭のリンクにフォーカスを移動
    // visibility: visibleになるのを待つため、少し遅延を入れる
    setTimeout(function () {
      if ($firstLink.length) {
        $firstLink.focus();
      }
    }, 100);
  }
});

// エスケープキーでメニューを閉じる
jQuery(window).on("keydown", function (e) {
  if (e.key === "Escape" && flg) {
    $hamburger.removeClass(CLASS);
    $menu.removeClass(CLASS);
    backgroundFix(false);
    $hamburger.attr("aria-expanded", "false");
    $hamburger.focus();
    flg = false;
  }
});

// フォーカストラップ制御
$focusTrap.on("focus", function () {
  $hamburger.focus();
});

// sp表示のときにドロワーメニューが開いている状態でリンクをクリックしたときに、ドロワーメニューを閉じるようにするためのコード。
jQuery('#js-drawer-content a[href^="#"]').on("click", function (e) {
  $hamburger.removeClass(CLASS);
  $menu.removeClass(CLASS);
  backgroundFix(false);
  $hamburger.attr("aria-expanded", "false");
  flg = false;
});
// =============================
// フォームバリデーション（jQuery）
// =============================

jQuery(function ($) {
  const $form = $("#js-contact-form");
  if (!$form.length) return;

  const $inputName = $("#your-name");
  const $inputEmail = $("#your-email");
  const $inputMessage = $("#your-message");
  const $inputPrivacy = $("#your-privacy");

  const $errorName = $("#js-error-name");
  const $errorEmail = $("#js-error-email");
  const $errorMessage = $("#js-error-message");
  const $errorPrivacy = $("#js-error-privacy");

  function scrollToElement($el) {
    const el = $el.get(0);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function clearError($input, $errorEl) {
    $input.removeClass("is-invalid");
    if ($errorEl && $errorEl.length) {
      $errorEl.text("");
    }
  }

  function setError($input, $errorEl, message) {
    $input.addClass("is-invalid");
    if ($errorEl && $errorEl.length) {
      $errorEl.text(message);
    }
  }

  // blur / focus 時の簡易バリデーション
  $inputName.on("blur", function () {
    if (!$inputName.val().trim()) {
      setError($inputName, $errorName, "必須項目です。");
    }
  });

  $inputName.on("focus", function () {
    clearError($inputName, $errorName);
  });

  $inputEmail.on("blur", function () {
    if (!$inputEmail.val().includes("@")) {
      setError(
        $inputEmail,
        $errorEmail,
        "メールアドレスの形式でご入力ください。"
      );
    }
  });

  $inputEmail.on("focus", function () {
    clearError($inputEmail, $errorEmail);
  });

  $inputMessage.on("blur", function () {
    if (!$inputMessage.val().trim()) {
      setError($inputMessage, $errorMessage, "必須項目です。");
    }
  });

  $inputMessage.on("focus", function () {
    clearError($inputMessage, $errorMessage);
  });

  if ($inputPrivacy.length) {
    $inputPrivacy.on("change", function () {
      if ($inputPrivacy.prop("checked")) {
        clearError($inputPrivacy, $errorPrivacy);
      } else {
        setError($inputPrivacy, $errorPrivacy, "必須項目です。");
      }
    });
  }

  $form.on("submit", function (event) {
    let hasError = false;

    clearError($inputName, $errorName);
    clearError($inputEmail, $errorEmail);
    clearError($inputMessage, $errorMessage);
    if ($inputPrivacy.length) {
      clearError($inputPrivacy, $errorPrivacy);
    }

    if (!$inputName.val().trim()) {
      setError($inputName, $errorName, "必須項目です。");
      if (!hasError) {
        scrollToElement($inputName);
      }
      hasError = true;
    }

    if (!$inputEmail.val().includes("@")) {
      setError(
        $inputEmail,
        $errorEmail,
        "メールアドレスの形式でご入力ください。"
      );
      if (!hasError) {
        scrollToElement($inputEmail);
      }
      hasError = true;
    }

    if (!$inputMessage.val().trim()) {
      setError($inputMessage, $errorMessage, "必須項目です。");
      if (!hasError) {
        scrollToElement($inputMessage);
      }
      hasError = true;
    }

    if (!$inputPrivacy.length || !$inputPrivacy.prop("checked")) {
      if ($inputPrivacy.length) {
        setError($inputPrivacy, $errorPrivacy);
        if (!hasError) {
          scrollToElement($inputPrivacy);
        }
        hasError = true;
      }
    }

    if (hasError) {
      event.preventDefault();
    }
  });
});
