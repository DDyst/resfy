const workArea = document.querySelector(`.work-area`);

const containerIcon = `<div class="container-icon"><svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 26 26" fill="none"> <path fill-rule="evenodd" clip-rule="evenodd" d="M6.99581 3.99658C6.99581 6.20664 5.2042 7.99825 2.99414 7.99825C5.2042 7.99825 6.99581 9.78986 6.99581 11.9999C6.99581 9.78986 8.78741 7.99825 10.9975 7.99825C8.78741 7.99825 6.99581 6.20664 6.99581 3.99658Z" stroke="#D1D0FD" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path fill-rule="evenodd" clip-rule="evenodd" d="M18.0021 16.0017C18.0021 13.2392 15.7626 10.9996 13 10.9996C15.7626 10.9996 18.0021 8.76013 18.0021 5.99756C18.0021 8.76013 20.2416 10.9996 23.0042 10.9996C20.2416 10.9996 18.0021 13.2392 18.0021 16.0017Z" stroke="#D1D0FD" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path fill-rule="evenodd" clip-rule="evenodd" d="M10.9978 14.501C10.9978 16.711 9.20615 18.5026 6.99609 18.5026C9.20615 18.5026 10.9978 20.2942 10.9978 22.5043C10.9978 20.2942 12.7894 18.5026 14.9994 18.5026C12.7894 18.5026 10.9978 16.711 10.9978 14.501Z" stroke="#D1D0FD" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> </svg></div>`;

const playAnimation = () => {
  workArea.classList.remove(`work-area--animated`);
  workArea.offsetWidth;  // Triggering DOM reflow
  workArea.classList.add(`work-area--animated`);
}

const processText = (text) => {
  const processedText = text
    .replace(/<style.*?<\/style>/gs, ``)
    .replace(/<script.*?<\/script>/gs, ``)
    // Списки, картинки, таблицы
    .replace(/<ul.*?>/g, `<ul class="list">`)
    .replace(/<ol.*?>/g, `<ol class="ordered-list">`)
    .replace(/<figure.*?>/g, `<figure class="img">`)
    .replace(/<figcaption>\s*(?:<em>)*([^]*?)(?:<\/em>)*\s*<\/figcaption>/g, `<p class="grey-text">$1</p>`)
    .replace(/<img style=".*?"/g, `<img`)
    .replace(/(?<!<figure.*?>)\s*(<img.*?>)/g, `<figure class="img">$1</figure>`)
    .replace(/<table>([^]*?)<\/table>/g, `<div class="overflow-table"><table style="width: 100%;">$1</table></div>`)
    // Код
    .replace(/<span (?:class="code-blue"|style="[^"]*?font-family: 'Courier New'.*?")>(.*?)<\/span>/g, `<code>$1</code>`)
    .replace(/<div style="background: #(?:f8f8f8|F8F8F8); overflow: auto; width: auto; border: solid #(?:d1d9d7|D1D9D7); border-width: .1em; padding: .2em .6em;">\s*<pre style="margin: 0; line-height: 125%;">(.*?)<\/pre>\s*<\/div>/gs, `<pre class="language-python"><code>$1</code></pre>`)
    // Тултипы, раскрывашки
    .replace(/<span [^<]*?data-title="(.*?)".*?>(.*?)<\/span>/g, `<span class="tooltip-button-green" data-title="$1">$2</span>`)
    .replace(/<span [^<]*?class="tooltip-button".*?>(.*?)<\/span>([^]*?)<div .*?class=".*?hidden.*?".*?>(.*?)<\/div>/g, `<span class="tooltip-button-green" data-title="$3">$1</span>$2`)
    .replace(/<div [^<]*?class="button-spoiler".*?>(.*?)<\/div>[^]*?<div [^<]*?class=".*?hidden.*?".*?>([^]*?)<\/div>/g, `<details><summary>$1</summary><div class="panel">$2</div></details>`)
    .replace(/<summary><span .*?>(.*?)<\/span><\/summary>/g, `<summary>$1</summary>`)
    // Контейнеры, рамки
    .replace(/class="green-(?:frame|container)"/g, `class="block-example"`)
    .replace(/class="info"/g, `class="term"`)
    .replace(/<div class="grey-container">\s*(<div style="padding: 56.25% 0 0 0; position: relative; margin-bottom: 20px;">\s*(?:<br>)*\s*<iframe.*?<\/iframe>)\s*<\/div>/g, `$1`)
    .replace(/class="grey-container"/g, `class="color-container blue-container"`)
    .replace(/<div class="blue-container-dotted">\s*(?:<p>)*<span class="h2-grey">(.*?)<\/span><\/p>([^]*?)<\/div>/g, `<div class="color-container container-flex blue-container">` + containerIcon + `<div><p><strong>$1</strong></p>$2</div></div>`)
    .replace(/class="blue-container-dotted"/g, `class="color-container blue-container"`)
    // Жирный текст и заголовки
    .replace(/<span class="(?:black|green)-bold">(.*?)<\/span>/g, `<strong>$1</strong>`)
    .replace(/(?:<strong>)*<span style="font-weight: bold; color: #2e675e;">(.*?)<\/span>(?:<\/strong>)*/g, `<strong>$1</strong>`)
    .replace(/<p.*?>(?:<strong>)*<span class="h1-green">(.*?)<\/span>(?:<\/strong>)*<\/p>/g, `<div class="h1">$1</div>`)
    .replace(/<span class="h2-grey">(.*?)<\/span>/g, `<div class="h2">$1</div>`)
    .replace(/(?:<p>)*<span style="color: #696969; text-transform: uppercase; font-weight: bold;">(.*?)<\/span>(?:<\/p>)*/g, `<div class="h3">$1</div>`);
  navigator.clipboard
    .writeText(`<div class="main-block">` + processedText + `</div>`)
    .then(playAnimation())
    .catch(() => alert(`Ошибка. Попробуйте ещё раз.`));
}

window.addEventListener(`click`, () => {
  workArea.focus();
});

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