const makeVisible = (el) => {
    if (el.classList.contains('hidden')) { el.classList.remove('hidden'); }
    if (!el.classList.contains('visible')) { el.classList.add('visible'); }
};
const makeHidden = (el) => {
    if (el.classList.contains('visible')) { el.classList.remove('visible'); }
    if (!el.classList.contains('hidden')) { el.classList.add('hidden'); }
};

// Define computed CSS styles
function vh(percent) {
    var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    return (percent * h) / 100;
}
function vw(percent) {
    var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    return (percent * w) / 100;
}
function vmin(percent) {
    return Math.min(vh(percent), vw(percent));
}