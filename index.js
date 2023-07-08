/**
 * This function runs immediately on the DOM loading.
 * Initializes values and attaches listeners.
 */
window.onload = () =>
{
    // Attach event listeners
    document.getElementById('theme-toggle').addEventListener('mouseup', toggleTheme);
    document.getElementById('em-logo').addEventListener('mouseup', copyEmailToClipboard);
    document.getElementById('nav-list-vertical').addEventListener('mouseup', () =>
    {
        // Closes the sidenav on selection
        const burgerCheckbox = document.getElementById('burger-checkbox');
        burgerCheckbox.checked = false;
    });
    document.addEventListener('wheel', (ev) =>
    {
        // allows scroll-y fallthrough from parent
        const container = document.getElementById('text-container');
        container.scrollTop += ev.deltaY;
    });
}