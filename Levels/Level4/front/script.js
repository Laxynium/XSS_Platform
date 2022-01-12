const textarea = document.querySelector('textarea');
const output = document.querySelector('#output');
const shareUrlElement = document.querySelector('#share-url');
const sanitizedHtmlElement = document.querySelector('#sanitized-html');

const update = () => {
    const text = textarea.value;
    const sanitized = DOMPurify.sanitize(text);

    output.innerHTML = sanitized;
    sanitizedHtmlElement.textContent = sanitized;
    const params = new URLSearchParams({ text });
    const share = `${location.origin}/?${params}#html`
    shareUrlElement.textContent = share;
}

textarea.oninput = () => update();

window.addEventListener('DOMContentLoaded', () => {
    console.log("Content loaded")
    const { text } = deparam(location.search.slice(1));

    textarea.value = text || 'Oto <b>przykład</b> wizytówki!';
    update();
});