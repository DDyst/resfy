const workArea = document.querySelector(`.work-area`);
const originSelect = document.getElementById(`origin-select`);
const languageSelect = document.getElementById(`language-select`);
const originHintBtn = document.getElementById(`origin-hint`);
const languageHintBtn = document.getElementById(`language-hint`);

let currentOrigin = `dst`;
let currentLanguage = `python`;

const hintsSrcs = {
  'dst': `hint-dst`,
  'coding-v1': `hint-coding-v1`,
  'coding-v2': `hint-coding-v2`
};

const colors = {
  'dst': `#033932`,
  'coding-v1': `#008b31`,
  'coding-v2': `#000`
};

const containerIconStars = `<div class="container-icon"><svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 26 26" fill="none"> <path fill-rule="evenodd" clip-rule="evenodd" d="M6.99581 3.99658C6.99581 6.20664 5.2042 7.99825 2.99414 7.99825C5.2042 7.99825 6.99581 9.78986 6.99581 11.9999C6.99581 9.78986 8.78741 7.99825 10.9975 7.99825C8.78741 7.99825 6.99581 6.20664 6.99581 3.99658Z" stroke="#D1D0FD" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path fill-rule="evenodd" clip-rule="evenodd" d="M18.0021 16.0017C18.0021 13.2392 15.7626 10.9996 13 10.9996C15.7626 10.9996 18.0021 8.76013 18.0021 5.99756C18.0021 8.76013 20.2416 10.9996 23.0042 10.9996C20.2416 10.9996 18.0021 13.2392 18.0021 16.0017Z" stroke="#D1D0FD" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path fill-rule="evenodd" clip-rule="evenodd" d="M10.9978 14.501C10.9978 16.711 9.20615 18.5026 6.99609 18.5026C9.20615 18.5026 10.9978 20.2942 10.9978 22.5043C10.9978 20.2942 12.7894 18.5026 14.9994 18.5026C12.7894 18.5026 10.9978 16.711 10.9978 14.501Z" stroke="#D1D0FD" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> </svg></div>`;
const containerIconBook = `<div class="container-icon"><svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 26 26" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M12.9998 17.8658C10.971 15.8359 7.91272 15.4628 5.50472 16.7463C4.82144 17.1105 3.99609 16.6613 3.99609 15.887V6.79116C3.99609 6.1549 4.29022 5.54264 4.80843 5.17349C7.29447 3.40075 10.7689 3.62985 12.9998 5.86078C15.2308 3.62985 18.7052 3.40075 21.1913 5.17349C21.7095 5.54264 22.0036 6.1549 22.0036 6.79116V15.887C22.0036 16.6613 21.1782 17.1115 20.495 16.7463C18.087 15.4628 15.0287 15.8359 12.9998 17.8658Z" stroke="#FFF0EC" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" /><path d="M5.50391 20.8845C7.91191 19.601 10.9702 19.9741 12.999 22.004C15.0279 19.9741 18.0861 19.601 20.4941 20.8845" stroke="#FFF0EC" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" /><path d="M13.0002 17.8663V5.86133" stroke="#FFF0EC" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" /></svg></div>`;

const playAnimation = () => {
  workArea.classList.remove(`work-area--animated`);
  workArea.offsetWidth;  // Triggering DOM reflow
  workArea.classList.add(`work-area--animated`);
}

const updateColors = () => {
  workArea.style.color = colors[currentOrigin];
  workArea.style.borderColor = colors[currentOrigin];
  document.body.style.color = colors[currentOrigin];
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
    .replace(/<span (?:class="code-blue".*?|style="[^"]*?font-family: 'Courier New'[^"]*?")>(.*?)<\/span>/g, `<code>$1</code>`)
    .replace(/<div style="(?:clear: both; )*background: #(?:f8f8f8|F8F8F8); overflow: auto; width: auto; border: (?:0.1em )*solid #(?:d1d9d7|D1D9D7); (?:border-width: (?:0)*.1em; )*padding: (?:0)*.2em (?:0)*.6em;(?: text-align: left;)*(?: clear: both;)*">\s*<pre style="margin: 0; line-height: 125%;">(.*?)<\/pre>\s*<\/div>/gs, `<pre class="language-${currentLanguage}"><code>$1</code></pre>`)
    .replace(/<pre style="margin: 0; line-height: 125%;">(.*?)<\/pre>/gs, `<pre class="language-${currentLanguage}"><code>$1</code></pre>`)
    // Списки, картинки, таблицы, черта-разделитель, автор модуля
    .replace(/<ul[^>]*?>/g, `<ul class="list">`)
    .replace(/<ol[^>]*?>/g, `<ol class="ordered-list">`)
    .replace(/<div style="width: [\d]+%;(?: background-color: [^;]+?; padding: [^;]+?; margin-top: [^;]+?; margin-bottom: [^;]+?; border: [^;]+?;)*">\s*(<div style="position: relative; padding-bottom: [\d]+\.[\d]+%; padding-top: 0; height: 0;"><iframe.*?<\/iframe><\/div>)\s*<\/div>/g, `<figure class="img">$1</figure>`)
    .replace(/<div style="display: flex; justify-content: center;[^"]*?">\s*<div style="width: 40%;">([^]*?)<\/div>\s*<div class="vert-line-blue-green"><\/div>\s*<div style="width: 40%;">([^]*?)<\/div>\s*<\/div>/g, `<div class="two-col"><div class="col"><ul class="list">$1</ul></div><div class="col"><ul class="list">$2</ul></div></div>`)
    .replace(/<div class="col">[^]*?<\/div>/g, (match) => match.replace(/<p>\s*<img [^>]*?src="[^"]*?checkbox-blue-green\.png"[^>]*?>\s*(.*?)\s*<\/p>/g, `<li>$1</li>`))
    .replace(/<p>\s*<img [^>]*?src="[^"]*?checkbox-blue-green\.png"[^>]*?>\s*(.*?)\s*<\/p>/g, `<ul class="list"><li>$1</li></ul>`)
    .replace(/<div class="green-frame">\s*<table style="[^"]*?width: 100%;[^"]*?">\s*<tbody>\s*<tr>\s*<td [^>]*?rowspan="2"[^>]*?>\s*<p style="text-align: center;">\s*<img [^>]*?src="([^"]*?)"[^>]*?>\s*<\/p>\s*<div style="text-align: center;"><span style="[^"]*?font-weight: bold;[^"]*?">(?:<span[^>]*?>)*(.*?)(?:<\/span>)*<\/span><\/div>\s*<\/td>\s*<td [^>]*?colspan="2"[^>]*?>([^]*?)<\/td>\s*<\/tr>\s*<\/tbody>\s*<\/table>\s*<\/div>/g, `<div class="module-author"><div class="module-author-descr"><div class="module-author-descr-name">$2</div><div class="module-author-descr-head">Автор модуля</div><div class="module-author-descr-works">$3</div></div><img src="$1"></div>`)
    .replace(/<figure[^>]*?>/g, `<figure class="img">`)
    .replace(/<figcaption[^>]*?>\s*(?:<em>)*([^]*?)(?:<\/em>)*\s*<\/figcaption>/g, `<p class="grey-text">$1</p>`)
    .replace(/(?<!<figure[^>]*?>)\s*(?:<p[^>]*?>)*(<img[^>]*?>)(?:<\/p>)*/g, `<figure class="img">$1</figure>`)
    .replace(/<\/figure>\s*<p (?:style="text-align: center;"|class="grey-text")>(.*?)<\/p>/g, `<p class="grey-text">$1</p></figure>`)
    .replace(/<table[^>]*?>([^]*?)<\/table>/g, `<div class="overflow-table"><table>$1</table></div>`)
    .replace(/<div style="display: flex; justify-content: center;">\s*(<div class="overflow-table">[^]*?<\/div>)\s*<\/div>/g, `$1`)
    .replace(/<colgroup>\s*(?:<col[^>]*?>)+\s*<\/colgroup>/g, ``)
    .replace(/<tr style="[^"]*?background-color: (?:#2e765e|#88cdb2);[^"]*?">[^]*?<\/tr>/g, (match) => match.replace(/<td[^>]*?>/g, `<th>`).replace(/<\/td>/g, `</th>`).replace(/<tr[^>]*?>/g, `<tr>`))
    .replace(/<td style="[^"]*?background-color: #88cdb2; [^"]*?text-align: center; [^"]*?text-transform: uppercase;[^"]*?">([^]*?)<\/td>/g, `<th>$1</th>`)
    .replace(/<td [^>]*?style="[^"]*?background-color[^"]*?"[^>]*?>/g, (match) => match.replace(/#ffdcd4/g, `#fff0ec`).replace(/#88cdb2/g, `#f0fbd0`))
    // Тултипы, раскрывашки, вкладки
    .replace(/<span [^>]*?data-title="([^"]*?)"[^>]*?>(.*?)<\/span>/g, `<span class="tooltip-button-green" data-title="$1">$2</span>`)
    .replace(/<span [^>]*?class="tooltip-button"[^>]*?>(.*?)<\/span>([^]*?)<div [^>]*?class="[^"]*?hidden[^"]*?"[^>]*?>(.*?)<\/div>/g, `<span class="tooltip-button-green" data-title="$3">$1</span>$2`)
    .replace(/(?:<div>)*\s*<details>\s*<summary>(.*?)<\/summary>([^]*?)\s*<\/details>\s*(?:<\/div>)*/g, `<details><summary>$1</summary><div class="panel">$2</div></details>`)
    .replace(/<(?:div|button) [^>]*?class="button-spoiler"[^>]*?>(.*?)<\/(?:div|button)>[^]*?<div [^>]*?class="[^"]*?hidden[^"]*?"[^>]*?>([^]*?)<\/div>/g, `<details><summary>$1</summary><div class="panel">$2</div></details>`)
    .replace(/<div [^>]*?class="accordion"[^>]*?>([^]*?)<\/div>\s*<div [^>]*?class="panel"[^>]*?>([^]*?)<\/div>/g, `<details><summary>$1</summary><div class="panel">$2</div></details>`)
    .replace(/<summary><span[^>]*?>(.*?)<\/span>(.*?)<\/summary>/g, `<summary>$1$2</summary>`)
    .replace(/<div [^>]*?class="tab"[^>]*?>\s*<div class="tablinks[^"]*?" onclick="[^"]*?">(.*?)<\/div>\s*<div class="tablinks[^"]*?" onclick="[^"]*?">(.*?)<\/div>\s*<\/div>[^]*?<div>\s*<div id="([^"]*?)" class="tabcontent[^"]*?">([^]*?)<\/div>\s*<div id="([^"]*?)" class="tabcontent[^"]*?">([^]*?)<\/div>\s*<\/div>/g, `<div class="tabs-wrapper"><!-- Tab links --><div class="tab-links"><div class="tab-links__item  tab-links__item--active" onclick="openTab(event, '$3')">$1</div><div class="tab-links__item" onclick="openTab(event, '$5')">$2</div></div><!-- Tab content --><div class="tab-content"><div id="$3" class="tab-content__item  tab-content__item--active">$4</div><div id="$5" class="tab-content__item">$6</div></div></div>`)
    .replace(/<div [^>]*?class="tabs"[^>]*?>\s*<input type="radio" [^>]*?id="([^"]*?)"[^>]*?>\s*<label for="[^"]*?">(.*?)<\/label>\s*<input type="radio" [^>]*?id="([^"]*?)"[^>]*?>\s*<label for="[^"]*?">(.*?)<\/label>\s*<div [^>]*?id="[^"]*?"[^>]*?>([^]*?)<\/div>\s*<div [^>]*?id="[^"]*?"[^>]*?>([^]*?)<\/div>\s*<\/div>/g, `<div class="tabs-wrapper"><!-- Tab links --><div class="tab-links"><div class="tab-links__item  tab-links__item--active" onclick="openTab(event, '$1')">$2</div><div class="tab-links__item" onclick="openTab(event, '$3')">$4</div></div><!-- Tab content --><div class="tab-content"><div id="$1" class="tab-content__item  tab-content__item--active">$5</div><div id="$3" class="tab-content__item">$6</div></div></div>`)
    // Контейнеры, рамки, видео
    .replace(/class="green-(?:frame|container)"/g, `class="block-example"`)
    .replace(/class="info"/g, `class="term"`)
    .replace(/<div class="(?:grey-container|black-frame)" style="[^"]*?display: flex;[^"]*?">\s*<div style="width: [^;]*?;">\s*[^]*?\s*<\/div>\s*<div style="width: [^;]*?;">\s*[^]*?\s*<\/div>\s*<\/div>/g, (match) => match.replace(/<figure[^>]*?>\s*([^]*?)\s*<\/figure>/g, `$1`).replace(/(<img [^>]*?style="[^"]*?)width: [^;]*?;([^"]*?"[^>]*?>)/g, `$1$2`))
    .replace(/<div class="(?:grey-container|black-frame)" style="[^"]*?display: flex;[^"]*?">\s*<div style="width: [^;]*?;">\s*([^]*?)\s*<\/div>\s*<div style="width: [^;]*?;">\s*([^]*?)\s*<\/div>\s*<\/div>/g, `<div class="color-container container-flex blue-container"><div>$1</div><div>$2</div></div>`)
    .replace(/<div class="grey-container">\s*(?:<center>)*\s*(<div style="padding: 56.25% 0 0 0; position: relative;(?: margin-bottom: [\d]+px;)*">\s*(?:<br>)*\s*<iframe.*?<\/iframe>\s*<\/div>)\s*(?:<\/center>)*([^]*?)<\/div>/g, `$1$2`)
    .replace(/style="padding: 56.25% 0 0 0; position: relative;[^"]*?"/g, `style="position: relative; padding-top: 56.25%; width: 100%; margin-bottom: 50px;"`)
    .replace(/class="grey-container"/g, `class="color-container blue-container"`)
    .replace(/class="red-container"/g, `class="color-container orange-container"`)
    .replace(/<div class="blue-container-dotted">\s*(?:<p>)*<span class="h2-grey">(.*?)<\/span>(?:<\/p>)*([^]*?)<\/div>/g, `<div class="color-container container-flex orange-container">` + containerIconBook + `<div><div class="example-title">$1</div>$2</div></div>`)
    .replace(/class="blue-container-dotted"/g, `class="color-container blue-container"`)
    .replace(/<div [^>]*?class="black-frame"[^>]*?>\s*(<p>(?:<strong>)*✍[^]*?)\s*<\/div>/g, `<div class="color-container blue-container">$1</div>`)
    .replace(/<p [^>]*?class="black-frame"[^>]*?>\s*((?:<strong>)*✍.*?)<\/p>/g, `<div class="color-container blue-container">$1</div>`)
    .replace(/<div [^>]*?class="black-frame"[^>]*?>([^]*?)<\/div>/g, `$1`)
    .replace(/<p [^>]*?class="black-frame"[^>]*?>/g, `<p>`)
    // Жирный текст и заголовки
    .replace(/<span class="(?:black|green)-bold">(.*?)<\/span>/g, `<strong>$1</strong>`)
    .replace(/(?:<strong[^>]*?>)*<span [^>]*?style="font-weight: bold; color: #2e675e;">(.*?)<\/span>(?:<\/strong>)*/g, `<strong>$1</strong>`)
    .replace(/<p[^>]*?>(?:<strong>)*<span class="h1-green">(.*?)<\/span>(?:<\/strong>)*<\/p>/g, `<div class="h1">$1</div>`)
    .replace(/<p><span style="[^"]*?"><strong>⛏<\/strong><\/span>\s*<span class="h2-grey">(.*?)(<a [^>]*?>)<span class="link">Metabase<\/span><\/a>(.*?)<\/span><\/p>/g, `<p><strong>$1$2Metabase</a>$3</strong></p>`)
    .replace(/(?:<p[^>]*?>)*<span class="h2-grey">(.*?)<\/span>(?:<\/p>)*/g, `<div class="h2">$1</div>`)
    .replace(/(?:<strong>)*<span style="(?:font-size: 1em; )*font-weight: bold; font-family: 'courier new', courier;(?: text-transform: uppercase; color: #062425;)*">\s*<span style="font-size: 1.2em;(?: text-transform: uppercase; color: #062425;)*">(.*?)<\/span>\s*<\/span>(?:<\/strong>)*/g, `<div class="h2">$1</div>`)
    .replace(/(?:<p[^>]*?>)*<span style="color: #696969; text-transform: uppercase; font-weight: bold;">(.*?)<\/span>(?:<\/p>)*/g, `<div class="h3">$1</div>`)
    // Финальная чистка
    .replace(/data-title="[^"]*?"/g, (match) => match.replace(/<[^>]*?>/g, ``))
    .replace(/<span class="link">(.*?)<\/span>/g, `$1`)
    .replace(/class="language-[^"]*?"/g, `class="language-${currentLanguage}"`)
    .replace(/(class="color-container[^"]*?") style="[^"]*?"/g, `$1`)
    .replace(/<ul[^>]*?>\s*(<ul[^>]*?>[^]*?<\/ul>)\s*<\/ul>/g, `$1`)
    .replace(/<ol[^>]*?>\s*(<ol[^>]*?>[^]*?<\/ol>)\s*<\/ol>/g, `$1`)
    .replace(/<span style="display: flex; float: left; align-items: center; justify-content: center; font-size: 16px; color: #2e765e; width: 30px; height: 30px; border: 2px solid #2e765e; border-radius: 50%; margin: 0px 20px 20px;"><strong>\?<\/strong><\/span>\s*/g, ``)
    .replace(/style="[^"]*?text-decoration: underline;[^"]*?"/g, (match) => match.replace(/text-decoration: underline;/g, ``))
    .replace(/<p[^>]*?>[^]*?<br(?: )*(?:\/)*>[^]*?<\/p>/g, (match) => match.replace(/<br(?: )*(?:\/)*>/g, ``))
    .replace(/<td[^>]*?>[^]*?<\/td>/g, (match) => match.replace(/<p[^>]*?>(.*?)<\/p>/g, `<br><br>$1`))
    .replace(/<td[^>]*?>(?:\s*<br>)+/g, (match) => match.replace(/<br>/g, ``))
    .replace(/<td[^>]*?>[^]*?<\/td>/g, (match) => match.replace(/<\/pre>(?:\s*<br>)+/g, `</pre>`))
    .replace(/<hr(?: )*(?:\/)*>/g, ``)
    .replace(/<(?:p|div|pre)[^>]*?>\s*<\/(?:p|div|pre)>/g, ``);
}

const processCodingV1 = (text) => {
  return text
    .replace(/<style.*?<\/style>/gs, ``)
    .replace(/<script.*?<\/script>/gs, ``)
    // Код
    .replace(/<code style="background-color: #f0f8ff;">/g, `<code>`)
    .replace(/<span style="(?:font-family: monospace, serif;|background-color: #f0f8ff;) (?:font-family: monospace, serif;|background-color: #f0f8ff;)">(.*?)<\/span>/g, `<code>$1</code>`)
    .replace(/<div style="(?:clear: both; )*background(?:-color)*: (?:#f8f8f8|#F8F8F8|white); overflow: auto; width: [^;]*?; border: (?:0.1em )*solid #(?:d1d9d7|D1D9D7); (?:border-width: (?:0)*.1em; )*padding: (?:0)*.2em (?:0)*.6em;(?: text-align: left;)*(?: clear: both;)*">[^]*?<\/div>/g, (match) => match.replace(/<pre[^>]*?>([^]*?)<\/pre>/g, `$1`))
    .replace(/<div style="(?:clear: both; )*background(?:-color)*: (?:#f8f8f8|#F8F8F8|white); overflow: auto; width: [^;]*?; border: (?:0.1em )*solid #(?:d1d9d7|D1D9D7); (?:border-width: (?:0)*.1em; )*padding: (?:0)*.2em (?:0)*.6em;(?: text-align: left;)*(?: clear: both;)*">\s*([^]*?)\s*<\/div>/g, `<pre class="language-${currentLanguage}"><code>$1</code></pre>`)
    .replace(/<pre style="margin: 0; line-height: 125%;">(\S+?)<\/pre>/gs, `<pre class="language-${currentLanguage}"><code>$1</code></pre>`)
    // Списки, картинки, таблицы, цитаты, автор модуля
    .replace(/<ul[^>]*?>/g, `<ul class="list">`)
    .replace(/<ol[^>]*?>/g, `<ol class="ordered-list">`)
    .replace(/<div class="block block-quote">\s*<div class="quote">\s*<div class="quote-text">(.*?)<\/div>\s*<div class="quote-author">\s*(<img [^>]*?>)\s*(<div>.*?<\/div>)\s*<\/div>\s*<\/div>\s*<\/div>/g, `<div class="quote"><div class="quote-text">$1</div><div class="quote-footer"><div class="quote-author">$2$3</div></div></div>`)
    .replace(/<div class="icon">\s*<img [^>]*?src="[^"]*?link_2\.png"[^>]*?>\s*<(?:span|p)>(.*?)<\/(?:span|p)>\s*<\/div>/g, `<div class="color-container container-flex orange-container">` + containerIconBook + `<div>$1</div></div>`)
    .replace(/<div class="icon">\s*<img [^>]*?>\s*<(?:span|p)>(.*?)<\/(?:span|p)>\s*<\/div>/g, `<p>$1</p>`)
    .replace(/<div style="width: [\d]+%;(?: background-color: #f5f5f5; padding: 20px; margin-top: 20px; margin-bottom: 20px; border: 1px solid #404040;)*">\s*(<div style="position: relative; padding-bottom: [\d]+\.[\d]+%; padding-top: 0; height: 0;"><iframe.*?<\/iframe><\/div>)\s*<\/div>/g, `<figure class="img">$1</figure>`)
    .replace(/<img src="[^"]*?(?:exclamation-mark.svg|screencast_icon.svg)"[^>]*?>/g, ``)
    .replace(/<figure[^>]*?>/g, `<figure class="img">`)
    .replace(/<figcaption[^>]*?>\s*(?:<em>)*([^]*?)(?:<\/em>)*\s*<\/figcaption>/g, `<p class="grey-text">$1</p>`)
    .replace(/<p style="text-align: center;"><span style="color: #808080;">(.*?)<\/span><\/p>/g, `<p class="grey-text">$1</p>`)
    .replace(/<center>(<img [^>]*?>)<\/center><center>(.*?)<\/center>/g, `<figure class="img">$1<p class="grey-text">$2</p></figure>`)
    .replace(/<\/figure>\s*<p (?:style="text-align: center;"|class="grey-text")>(.*?)<\/p>/g, `<p class="grey-text">$1</p></figure>`)
    .replace(/(?<!<figure[^>]*?>)\s*(?:<p>)*(?:<center>)*(?<!<div class="quote-author">)(?<!<p class="img">)(<img (?![^>]*?src="[^"]*?(?:book_1\.png|cbe85a34bed8-512|blob:[^"]*?|paper-and-pencil_[^"]*?|tick_2\.png|download_icon\.svg)")[^>]*?>)(?:<\/center>)*(?:<\/p>)*/g, `<figure class="img">$1</figure>`)
    .replace(/<div class="grey-container">\s*(?:<br>)*\s*<div class="h2 div-margin">\s*<strong>.*?<\/strong>\s*<\/div>\s*<table[^>]*?>\s*<tbody>\s*<tr>\s*<td[^>]*?>\s*<p class="img">(<img [^>]*?src="[^"]*?"[^>]*?>)<\/p>\s*<\/td>\s*<td[^>]*?>\s*<h2>.*?<b>(.*?)<\/b>.*?<\/h2>([^]*?)<\/td>\s*<\/tr>\s*<\/tbody>\s*<\/table>\s*<\/div>/g, `<div class="module-author"><div class="module-author-descr"><div class="module-author-descr-name">$2</div><div class="module-author-descr-head">Автор модуля</div><div class="module-author-descr-works">$3</div></div>$1</div>`)
    .replace(/<table[^>]*?>([^]*?)<\/table>/g, `<div class="overflow-table"><table>$1</table></div>`)
    .replace(/<tr style="[^"]*?background-color: #00b43f;[^"]*?">[^]*?<\/tr>/g, (match) => match.replace(/<td[^>]*?>/g, `<th>`).replace(/<\/td>/g, `</th>`).replace(/<tr[^>]*?>/g, `<tr>`))
    // Тултипы, раскрывашки, вкладки
    .replace(/<span [^>]*?data-title="([^"]*?)"[^>]*?>(.*?)<\/span>/g, `<span class="tooltip-button-green" data-title="$1">$2</span>`)
    .replace(/(?:<div>)*\s*<details>\s*<summary>(.*?)<\/summary>([^]*?)\s*<\/details>\s*(?:<\/div>)*/g, `<details><summary>$1</summary><div class="panel">$2</div></details>`)
    // .replace(/<button [^>]*?onclick="[^"]*?\('#([^']*?)'\)[^"]*?"[^>]*?>(.*?)<\/button>/g, ``)
    .replace(/<div [^>]*?class="tab"[^>]*?>\s*<div class="tablinks[^"]*?" onclick="[^"]*?">(.*?)<\/div>\s*<div class="tablinks[^"]*?" onclick="[^"]*?">(.*?)<\/div>\s*<\/div>[^]*?<div>\s*<div id="([^"]*?)" class="tabcontent[^"]*?">([^]*?)<\/div>\s*<div id="([^"]*?)" class="tabcontent[^"]*?">([^]*?)<\/div>\s*<\/div>/g, `<div class="tabs-wrapper"><!-- Tab links --><div class="tab-links"><div class="tab-links__item  tab-links__item--active" onclick="openTab(event, '$3')">$1</div><div class="tab-links__item" onclick="openTab(event, '$5')">$2</div></div><!-- Tab content --><div class="tab-content"><div id="$3" class="tab-content__item  tab-content__item--active">$4</div><div id="$5" class="tab-content__item">$6</div></div></div>`)
    // Контейнеры, рамки, видео
    .replace(/<div style="border-left: 5px solid #00b43f; padding-left: 10px;">\s*<h2><strong>(.*?)<\/strong><\/h2>\s*<\/div>/g, `<div class="h1">$1</div>`)
    .replace(/<div style="background-color: #f5f5f5; padding: 20px; margin-top: 20px; margin-bottom: 20px; border: 1px solid #404040;"[^>]*?>([^]*?)(?:<center>)*\s*(<div style="padding: 56.25% 0 0 0; position: relative;">\s*<iframe.*?<\/iframe>\s*<\/div>)\s*(?:<\/center>)*\s*<\/div>/g, `$1$2`)
    .replace(/<center>\s*<iframe [^>]*?src="([^"]*?youtube.com[^"]*?)".*?<\/iframe>\s*<\/center>/g, `<div style="position: relative; padding-top: 56.25%; width: 100%; margin-bottom: 50px;"><iframe src="$1" allow="autoplay; fullscreen; picture-in-picture; encrypted-media;" frameborder="0" allowfullscreen style="position: absolute; width: 100%; height: 100%; top: 0; left: 0; border-radius:8px;"></iframe></div>`)
    .replace(/<div (?:style="background-color: #f5f5f5; padding: 15px;"|class="grey-frame")>\s*<img src="[^"]*?cbe85a34bed8-512"[^>]*?>\s*<p><span style="color: #00b43f;"><strong>(.*?)<\/strong><\/span><\/p>([^]*?)<\/div>/g, `<div class="block-example"><div class="example-title">$1</div><div>$2</div></div>`)
    .replace(/(?:<center>)*\s*(<div style="padding: 56.25% 0 0 0; position: relative;(?: margin-bottom: [\d]+px;)*">\s*(?:<br>)*\s*<iframe.*?<\/iframe>\s*<\/div>)\s*(?:<\/center>)/g, `$1`)
    .replace(/<td[^>]*?>[^]*?<\/td>/g, (match) => match.replace(/(style="padding: 56.25% 0 0 0; position: relative;)"/g, `$1 margin: 32px 0 !important;"`))
    .replace(/(style="padding: 56.25% 0 0 0; position: relative;)"/g, `$1 margin-bottom: 50px;"`)
    .replace(/<div style="background-color: #f5f5f5; padding: [\d]+px;">\s*<img [^>]*?src="[^"]*?book_1\.png"[^>]*?>\s*(?:<\/div>\s*<div style="background-color: #f5f5f5; padding: 15px;">)*([^]*?)<\/div>/g, `<div class="color-container container-flex orange-container">` + containerIconBook + `<div>$1</div></div>`)
    .replace(/<div style="background-color: #f5f5f5; padding: [\d]+px;(?: margin-top: [\d]+px; margin-bottom: [\d]+px; border: 1px solid #404040;)*">\s*<h2>\s*(?:<strong>\s*|<img [^>]*?src="[^"]*?book_1\.png"[^>]*?>\s*)(?:<strong>\s*|<img [^>]*?src="[^"]*?book_1\.png"[^>]*?>\s*)(.*?)<\/strong><\/h2>([^]*?)<\/div>/g, `<div class="color-container container-flex orange-container">` + containerIconBook + `<div><div class="example-title">$1</div>$2</div></div>`)
    .replace(/<div style="background-color: #f5f5f5; padding: [\d]+px;(?: margin-top: [\d]+px; margin-bottom: [\d]+px; border: 1px solid #404040;)*">\s*(<icon [^>]*?class="[^"]*?fa-book[^"]*?"[^>]*?>[^]*?)<\/div>/g, `<div class="color-container container-flex orange-container">` + containerIconBook + `<div>$1</div></div>`)
    .replace(/<div (?:style="background-color: #ffdcd4; padding: [\d]+px;(?: margin-top: [\d]+px;)*(?: margin-bottom: [\d]+px;)*(?: border-radius: [\d]+px;)*"|class="red-container")>([^]*?)<\/div>/g, `<div class="color-container orange-container">$1</div>`)
    .replace(/(?:<center>)*\s*<div style="padding: 15px; border: [\d]+px solid #00b43f; max-width: 800px;(?: border-radius: [\d]+px;)*(?: text-align: left;)*">([^]*?)<\/div>\s*(?:<\/center>)*/g, `<div class="block-example">$1</div>`)
    .replace(/<div style="border-left: 5px solid #00b43f; padding-left: [\d]+px;(?: padding: [\d]+px;)*">([^]*?)<\/div>/g, `<div class="block-example">$1</div>`)
    .replace(/<div style="background-color: (?:#e0ffd1|#eeffe8|#ebfff0); padding: [\d]+px;(?: margin-top: [\d]+px;)*(?: margin-bottom: [\d]+px;)*(?: border-radius: [\d]+px;)*">([^]*?)<\/div>/g, `<div class="block-example">$1</div>`)
    .replace(/<div style="padding: 20px; margin-bottom: 20px; width: 85%; border: 3px dotted #00b43f; margin: 0 auto;">([^]*?)<\/div>/g, `<div class="block-example">$1</div>`)
    .replace(/<div (?:style="border-left: 5px solid #00b43f; padding-left: 10px; padding: 15px; background-color: #eeffe8;"|class="info")>([^]*?)<\/div>/g, `<div class="term">$1</div>`)
    .replace(/<div (?:style="padding-left: 10px; padding: 15px; background-color: #eeffe8;"|class="green-container")>([^]*?)<\/div>/g, `<div class="block-example">$1</div>`)
    .replace(/<div (?:style="[^"]*?background-color: #f5f5f5; padding: [\d]+px;[^"]*?"|class="grey-container")>\s*<img [^>]*?src="[^"]*?(?:pencil_2\.png|download_icon\.svg)"[^>]*?>\s*([^]*?)<\/div>/g, `<div class="color-container container-flex blue-container">` + containerIconStars + `<div>$1</div></div>`)
    .replace(/<div (?:style="[^"]*?background-color: #f5f5f5; padding: [\d]+px;[^"]*?"|class="grey-container")>([^]*?)<\/div>/g, `<div class="color-container blue-container">$1</div>`)
    // Жирный текст, заголовки, кнопки
    .replace(/<h3 [^>]*?class="[^"]*?problem-header[^"]*?"[^>]*?>(.*?)<\/h3>/g, `<div class="text-problem-title">$1</div>`)
    .replace(/<h2>(?:<(?:b|strong)>)*(.*?)(?:<\/(?:b|strong)>)*<\/h2>/g, `<div class="h2">$1</div>`)
    .replace(/(?:<p>)*\s*<span [^>]*?class="h2-green"[^>]*?>(.*?)<\/span>\s*(?:<\/p>)*/g, `<div class="h2">$1</div>`)
    .replace(/<h3>(?:<(?:b|strong)>)*(.*?)(?:<\/(?:b|strong)>)*<\/h3>/g, `<div class="h3">$1</div>`)
    .replace(/<span (?:color="#00b43f" )*style="color: #00b43f;">(\s*<(?:strong|b)>.*?<\/(?:strong|b)>\s*)<\/span>/g, `$1`)
    .replace(/<strong style="color: #00b43f;">/g, `<strong>`)
    .replace(/<span [^>]*?class="green-bold"[^>]*?>(.*?)<\/span>/g, `<strong>$1</strong>`)
    .replace(/<div class="button-container">\s*(?:<center>)*<a [^>]*?href="(.*?)"[^>]*?>(.*?)<\/a>(?:<\/center>)*\s*<\/div>/g, `<center><a class="button-sf button-sf--icon-start" href="$1" download="" rel="noopener"><span class="button-label">$2</span></a></center>`)
    // Финальная чистка
    .replace(/data-title="[^"]*?"/g, (match) => match.replace(/<[^>]*?>/g, ``))
    .replace(/<summary>[^]*?<\/summary>/g, (match) => match.replace(/style="[^"]*?"/g, ``))
    .replace(/<ul[^>]*?>\s*(<ul[^>]*?>[^]*?<\/ul>)\s*<\/ul>/g, `$1`)
    .replace(/<ol[^>]*?>\s*(<ol[^>]*?>[^]*?<\/ol>)\s*<\/ol>/g, `$1`)
    .replace(/style="[^"]*?text-decoration: underline;[^"]*?"/g, ``)
    .replace(/<div align="left" style="height: 0px; border-bottom: 2px #00b43f solid; width: 40%;"><\/div>/g, ``)
    .replace(/<p><!-- HTML generated using hilite.me --><\/p>/g, ``)
    .replace(/→\s*/g, ``)
    .replace(/<icon[^>]*?>(.*?)<\/icon>/g, `$1`)
    .replace(/<img [^>]*?src="[^"]*?(?:paper-and-pencil_1|tick_2)\.png"[^>]*?>/g, ``)
    .replace(/<p style="(?:padding-left: [\d]+px;|text-align: center;)">/g, `<p>`)
    .replace(/<(?:p|div|pre)[^>]*?>\s*<\/(?:p|div|pre)>/g, ``)
    .replace(/<img [^>]*?(?!style="vertical-align: middle;")style=[^>]*?>/g, (match) => match.replace(/style="[^"]*?"/g, ``))
    .replace(/<tr style="background-color: #f5f5f5;">/g, `<tr>`)
    .replace(/<td[^>]*?>[^]*?<\/td>/g, (match) => match.replace(/<p[^>]*?>(.*?)<\/p>/g, `<br><br>$1`))
    .replace(/<td[^>]*?>(?:\s*<br>)+/g, (match) => match.replace(/<br>/g, ``))
    .replace(/<td[^>]*?>[^]*?<\/td>/g, (match) => match.replace(/<\/pre>(?:\s*<br>)+/g, `</pre>`))
    .replace(/<hr(?: )*(?:\/)*>/g, ``);
}

const processCodingV2 = (text) => {}

const origins = {
  'dst': processDST,
  'coding-v1': processCodingV1,
  'coding-v2': processCodingV2
};

const processText = (text) => {
  ym(98738608,'reachGoal','pasteGoalId');
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
  updateColors();
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