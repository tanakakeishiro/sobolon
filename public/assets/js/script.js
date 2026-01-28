// =============================
// 画面の幅が375pxより小さい時、画面のサイズを固定する機能
// =============================
(function () {
  const viewport = document.querySelector('meta[name="viewport"]');

  if (!viewport) return;

  const switchViewport = () => {
    const value =
      window.outerWidth > 375
        ? "width=device-width,initial-scale=1"
        : "width=375";

    if (viewport.getAttribute("content") !== value) {
      viewport.setAttribute("content", value);
    }
  };

  addEventListener("resize", switchViewport, false);

  switchViewport();
})();

// =============================
// ハンバーガーメニュー
// =============================
const backgroundFix = (bool) => {
  const scrollingElement = () =>
    "scrollingElement" in document
      ? document.scrollingElement
      : document.documentElement;

  const scrollY = bool
    ? scrollingElement().scrollTop
    : parseInt(document.body.style.top || "0");

  if (bool) {
    Object.assign(document.body.style, {
      height: "100vh",
      position: "fixed",
      top: `${scrollY * -1}px`,
      left: "0",
      width: "100vw",
    });
  } else {
    Object.assign(document.body.style, {
      height: "",
      position: "",
      top: "",
      left: "",
      width: "",
    });
    window.scrollTo(0, scrollY * -1);
  }
};

const CLASS = "is-checked";
let flg = false;
const $hamburger = jQuery("#js-drawer-button");
const $menu = jQuery("#js-drawer-content");
const $focusTrap = jQuery("#js-focus-trap");
const $firstLink = jQuery(".header__link").first();

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

$hamburger.on("click", function (e) {
  e.preventDefault();
  flg ? closeMenu() : openMenu();
});

jQuery(window).on("keydown", (e) => {
  if (e.key === "Escape" && flg) closeMenu();
});

$focusTrap.on("focus", () => {
  $hamburger.focus();
});

jQuery('#js-drawer-content a[href^="#"]').on("click", closeMenu);

// =============================
// フォームバリデーション
// =============================

jQuery(function ($) {
  const $form = $("#js-contact-form");
  if (!$form.length) return;

  // PHP工房側の必須設定（$require）に合わせてクライアント側もチェック
  const fields = [
    {
      // お名前（必須）
      $input: $("#your-name"),
      $error: $("#js-error-name"),
      validate: (val) => val.trim() !== "",
      message: "必須項目です。",
    },
    {
      // メールアドレス（必須＋形式チェック）
      $input: $("#your-email"),
      $error: $("#js-error-email"),
      validate: (val) => {
        const value = val.trim();
        if (!value) return false;
        // mail.php 内の checkMail() を簡略化したパターンに近い形でチェック
        const emailPattern =
          /^[.!#%&\-_0-9a-zA-Z?\/+]+@[!#%&\-_0-9a-zA-Z]+(\.[!#%&\-_0-9a-zA-Z]+)+$/;
        return emailPattern.test(value);
      },
      message: "メールアドレスの形式が正しくありません。",
    },
    {
      // お問い合わせ内容（必須）
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
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const clearError = ($input, $errorEl) => {
    $input.removeClass("is-invalid");
    $errorEl.length && $errorEl.text("");
  };

  const setError = ($input, $errorEl, message) => {
    $input.addClass("is-invalid");
    $errorEl.length && $errorEl.text(message);
  };

  fields.forEach(({ $input, $error, validate, message }) => {
    $input
      .on("blur", function () {
        if (!validate($input.val())) {
          setError($input, $error, message);
        }
      })
      .on("focus", () => {
        clearError($input, $error);
      });
  });

  if ($inputPrivacy.length) {
    $inputPrivacy.on("change", function () {
      $inputPrivacy.prop("checked")
        ? clearError($inputPrivacy, $errorPrivacy)
        : setError($inputPrivacy, $errorPrivacy, "必須項目です。");
    });
  }

  $form.on("submit", function (event) {
    let hasError = false;

    fields.forEach(({ $input, $error }) => {
      clearError($input, $error);
    });

    if ($inputPrivacy.length) {
      clearError($inputPrivacy, $errorPrivacy);
    }

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

    if (hasError) {
      event.preventDefault();
    }
  });
});
