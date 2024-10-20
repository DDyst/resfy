const workArea = document.querySelector(`.work-area`);
const originSelect = document.getElementById(`origin-select`);
const languageSelect = document.getElementById(`language-select`);
const originHintBtn = document.getElementById(`origin-hint`);
const languageHintBtn = document.getElementById(`language-hint`);

let currentOrigin = `dst`;
let currentLanguage = `python`;

const hintsSrcs = {
  dst: `dst-hint`,
  coding1: `coding1-hint`,
  coding2: `coding2-hint`
};

const containerIconStars = `<div class="container-icon"><svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 26 26" fill="none"> <path fill-rule="evenodd" clip-rule="evenodd" d="M6.99581 3.99658C6.99581 6.20664 5.2042 7.99825 2.99414 7.99825C5.2042 7.99825 6.99581 9.78986 6.99581 11.9999C6.99581 9.78986 8.78741 7.99825 10.9975 7.99825C8.78741 7.99825 6.99581 6.20664 6.99581 3.99658Z" stroke="#D1D0FD" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path fill-rule="evenodd" clip-rule="evenodd" d="M18.0021 16.0017C18.0021 13.2392 15.7626 10.9996 13 10.9996C15.7626 10.9996 18.0021 8.76013 18.0021 5.99756C18.0021 8.76013 20.2416 10.9996 23.0042 10.9996C20.2416 10.9996 18.0021 13.2392 18.0021 16.0017Z" stroke="#D1D0FD" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path fill-rule="evenodd" clip-rule="evenodd" d="M10.9978 14.501C10.9978 16.711 9.20615 18.5026 6.99609 18.5026C9.20615 18.5026 10.9978 20.2942 10.9978 22.5043C10.9978 20.2942 12.7894 18.5026 14.9994 18.5026C12.7894 18.5026 10.9978 16.711 10.9978 14.501Z" stroke="#D1D0FD" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> </svg></div>`;
const containerIconBook = `<div class="container-icon"><svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 26 26" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M12.9998 17.8658C10.971 15.8359 7.91272 15.4628 5.50472 16.7463C4.82144 17.1105 3.99609 16.6613 3.99609 15.887V6.79116C3.99609 6.1549 4.29022 5.54264 4.80843 5.17349C7.29447 3.40075 10.7689 3.62985 12.9998 5.86078C15.2308 3.62985 18.7052 3.40075 21.1913 5.17349C21.7095 5.54264 22.0036 6.1549 22.0036 6.79116V15.887C22.0036 16.6613 21.1782 17.1115 20.495 16.7463C18.087 15.4628 15.0287 15.8359 12.9998 17.8658Z" stroke="#FFF0EC" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" /><path d="M5.50391 20.8845C7.91191 19.601 10.9702 19.9741 12.999 22.004C15.0279 19.9741 18.0861 19.601 20.4941 20.8845" stroke="#FFF0EC" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" /><path d="M13.0002 17.8663V5.86133" stroke="#FFF0EC" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" /></svg></div>`;

const playAnimation = () => {
  workArea.classList.remove(`work-area--animated`);
  workArea.offsetWidth;  // Triggering DOM reflow
  workArea.classList.add(`work-area--animated`);
}

const renderModal = (src) => {
  document.body.insertAdjacentHTML(`beforeend`, `<div class="modal__overlay"></div><div class="modal"><button class="modal__close-btn"></button><img src="img/${src}.png"></div>`);
  const overlay = document.querySelector(`.modal__overlay`);
  const modal = document.querySelector(`.modal`);
  const closeBtn = document.querySelector(`.modal__close-btn`);
  overlay.addEventListener(`click`, () => {
    modal.remove();
    overlay.remove();
  });
  closeBtn.addEventListener(`click`, () => {
    modal.remove();
    overlay.remove();
  });
}


const processDST = (text) => {
  return text
    .replace(/<style.*?<\/style>/gs, ``)
    .replace(/<script.*?<\/script>/gs, ``)
    // Код
    .replace(/<span (?:class="code-blue".*?|style="[^"]*?font-family: 'Courier New'.*?")>(.*?)<\/span>/g, `<code>$1</code>`)
    .replace(/<div style="(?:clear: both; )*background: #(?:f8f8f8|F8F8F8); overflow: auto; width: auto; border: solid #(?:d1d9d7|D1D9D7); border-width: .1em; padding: .2em .6em;">\s*<pre style="margin: 0; line-height: 125%;">(.*?)<\/pre>\s*<\/div>/gs, `<pre class="language-${currentLanguage}"><code>$1</code></pre>`)
    .replace(/<pre style="margin: 0; line-height: 125%;">(.*?)<\/pre>/gs, `<pre class="language-${currentLanguage}"><code>$1</code></pre>`)
    // Списки, картинки, таблицы, черта-разделитель
    .replace(/<ul.*?>/g, `<ul class="list">`)
    .replace(/<ol.*?>/g, `<ol class="ordered-list">`)
    .replace(/<figure.*?>/g, `<figure class="img">`)
    .replace(/<figcaption>\s*(?:<em>)*([^]*?)(?:<\/em>)*\s*<\/figcaption>/g, `<p class="grey-text">$1</p>`)
    .replace(/(?<!<figure.*?>)\s*(<img.*?>)/g, `<figure class="img">$1</figure>`)
    .replace(/<table.*?>([^]*?)<\/table>/g, `<div class="overflow-table"><table style="width: 100%;">$1</table></div>`)
    .replace(/<div style="display: flex; justify-content: center;">\s*(<div class="overflow-table">[^]*?<\/div>)\s*<\/div>/g, `$1`)
    .replace(/<colgroup>\s*(?:<col.*?>)+\s*<\/colgroup>/g, ``)
    .replace(/<tr style="[^"]*?background-color: (?:#2e765e|#88cdb2);.*?">[^]*?<\/tr>/g, (match) => match.replace(/<td.*?>/g, `<th>`).replace(/<\/td>/g, `</th>`).replace(/<tr.*?>/g, `<tr>`))
    .replace(/<div style="display: flex; justify-content: center;.*?">\s*<div style="width: 40%;">([^]*?)<\/div>\s*<div class="vert-line-blue-green"><\/div>\s*<div style="width: 40%;">([^]*?)<\/div>\s*<\/div>/g, `<div class="two-col"><div class="col">$1</div><div class="col">$2</div></div>`)
    // Тултипы, раскрывашки, вкладки
    .replace(/<span [^>]*?data-title="(.*?)".*?>(.*?)<\/span>/g, `<span class="tooltip-button-green" data-title="$1">$2</span>`)
    .replace(/<span [^>]*?class="tooltip-button".*?>(.*?)<\/span>([^]*?)<div .*?class=".*?hidden.*?".*?>(.*?)<\/div>/g, `<span class="tooltip-button-green" data-title="$3">$1</span>$2`)
    .replace(/<(?:div|button) [^>]*?class="button-spoiler".*?>(.*?)<\/(?:div|button)>[^]*?<div [^>]*?class=".*?hidden.*?".*?>([^]*?)<\/div>/g, `<details><summary>$1</summary><div class="panel">$2</div></details>`)
    .replace(/<summary><span .*?>(.*?)<\/span>(.*?)<\/summary>/g, `<summary>$1$2</summary>`)
    // .replace(/<div [^>]*?class="tab".*?>\s*<div class="tablinks.*?" onclick=".*?">(.*?)<\/div>\s*<div class="tablinks.*?" onclick=".*?">(.*?)<\/div>\s*<\/div>[^]*?<div>\s*<div id=".*?" class="tabcontent.*?">([^]*?)<\/div>\s*<div id=".*?" class="tabcontent.*?">([^]*?)<\/div>\s*<\/div>/g, `<div class="two-col"><div class="col"><div class="h3">$1</div>$3</div><div class="col"><div class="h3">$2</div>$4</div></div>`)
    .replace(/<div [^>]*?class="tab".*?>\s*<div class="tablinks.*?" onclick=".*?">(.*?)<\/div>\s*<div class="tablinks.*?" onclick=".*?">(.*?)<\/div>\s*<\/div>[^]*?<div>\s*<div id="(.*?)" class="tabcontent.*?">([^]*?)<\/div>\s*<div id="(.*?)" class="tabcontent.*?">([^]*?)<\/div>\s*<\/div>/g, `<div class="tabs-wrapper"><!-- Tab links --><div class="tab-links"><div class="tab-links__item  tab-links__item--active" onclick="openTab(event, '$3')">$1</div><div class="tab-links__item" onclick="openTab(event, '$5')">$2</div></div><!-- Tab content --><div class="tab-content"><div id="$3" class="tab-content__item  tab-content__item--active">$4</div><div id="$5" class="tab-content__item">$6</div></div></div>`)
    // Контейнеры, рамки
    .replace(/class="green-(?:frame|container)"/g, `class="block-example"`)
    .replace(/class="info"/g, `class="term"`)
    .replace(/<div class="grey-container">\s*(?:<center>)*\s*(<div style="padding: 56.25% 0 0 0; position: relative;(?: margin-bottom: [\d]+px;)*">\s*(?:<br>)*\s*<iframe.*?<\/iframe>\s*<\/div>)\s*(?:<\/center>)*<\/div>/g, `$1`)
    .replace(/(style="padding: 56.25% 0 0 0; position: relative;)"/g, `$1 margin-bottom: 50px;"`)
    .replace(/class="grey-container"/g, `class="color-container blue-container"`)
    .replace(/<div class="blue-container-dotted">\s*(?:<p>)*<span class="h2-grey">(.*?)<\/span><\/p>([^]*?)<\/div>/g, `<div class="color-container container-flex orange-container">` + containerIconBook + `<div><p><strong>$1</strong></p>$2</div></div>`)
    .replace(/class="blue-container-dotted"/g, `class="color-container blue-container"`)
    .replace(/<div [^>]*?class="black-frame".*?>([^]*?)<\/div>/g, `$1`)
    .replace(/<p [^>]*?class="black-frame".*?>/g, `<p>`)
    // Жирный текст и заголовки
    .replace(/<span class="(?:black|green)-bold">(.*?)<\/span>/g, `<strong>$1</strong>`)
    .replace(/(?:<strong>)*<span style="font-weight: bold; color: #2e675e;">(.*?)<\/span>(?:<\/strong>)*/g, `<strong>$1</strong>`)
    .replace(/<p.*?>(?:<strong>)*<span class="h1-green">(.*?)<\/span>(?:<\/strong>)*<\/p>/g, `<div class="h1">$1</div>`)
    .replace(/<p><span style=".*?"><strong>⛏<\/strong><\/span>\s*<span class="h2-grey">(.*?)(<a .*?>)<span class="link">Metabase<\/span><\/a>(.*?)<\/span><\/p>/g, `<p><strong>$1$2Metabase</a>$3</strong></p>`)
    .replace(/<span class="h2-grey">(.*?)<\/span>/g, `<div class="h2">$1</div>`)
    .replace(/(?:<p>)*<span style="color: #696969; text-transform: uppercase; font-weight: bold;">(.*?)<\/span>(?:<\/p>)*/g, `<div class="h3">$1</div>`)
    // Финальная чистка
    .replace(/data-title=".*?"/g, (match) => match.replace(/<.*?>/g, ``))
    .replace(/<span class="link">(.*?)<\/span>/g, `$1`)
    .replace(/<ul.*?>\s*(<ul.*?>[^]*?<\/ul.*?>)\s*<\/ul.*?>/g, `$1`)
    .replace(/<ol.*?>\s*(<ol.*?>[^]*?<\/ol.*?>)\s*<\/ol.*?>/g, `$1`)
    .replace(/<span style="display: flex; float: left; align-items: center; justify-content: center; font-size: 16px; color: #2e765e; width: 30px; height: 30px; border: 2px solid #2e765e; border-radius: 50%; margin: 0px 20px 20px;"><strong>\?<\/strong><\/span>\s*/g, ``)
    .replace(/<p>\s*<\/p>/g, ``);
}

const processCodingV1 = (text) => {}

const processCodingV2 = (text) => {}

const origins = {
  dst: processDST,
  coding1: processCodingV1,
  coding2: processCodingV2
};

const processText = (text) => {
  const processedText = origins[currentOrigin](text);
  navigator.clipboard
    .writeText(`<div class="main-block">` + processedText + `</div>`)
    .then(playAnimation())
    .catch(() => alert(`Ошибка. Попробуйте ещё раз.`));
}


window.addEventListener(`click`, (evt) => {
  evt.preventDefault();
  if (evt.target !== originSelect && evt.target !== languageSelect) {
    workArea.focus();
  }
});

originSelect.addEventListener(`input`, () => {
  currentOrigin = originSelect.value;
  workArea.focus();
});

languageSelect.addEventListener(`input`, () => {
  currentLanguage = languageSelect.value;
  workArea.focus();
});

// Фикс фокуса селектов для Хрома
if (navigator.userAgent.indexOf(`Chrome`) !== -1) {
  originSelect.addEventListener(`focus`, () => {
    workArea.focus();
  });

  languageSelect.addEventListener(`focus`, () => {
    workArea.focus();
  });
}

workArea.addEventListener(`keypress`, (evt) => {
  evt.preventDefault();
});

workArea.addEventListener(`paste`, (evt) => {
  evt.preventDefault();
  navigator.clipboard
    .readText()
    .then((pastedText) => processText(pastedText))
    .catch(() => alert(`Ошибка. Попробуйте ещё раз.`));
});

originHintBtn.addEventListener(`click`, () => {
  renderModal(hintsSrcs[currentOrigin]);
});

languageHintBtn.addEventListener(`click`, (evt) => {
  renderModal(evt.target.id);
});