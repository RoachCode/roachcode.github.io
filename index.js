/**
 * This function runs immediately on the DOM loading.
 * Initializes values and attaches listeners.
 */
window.onload = () =>
{
    // Attach event listeners
    document.getElementById('theme-toggle').addEventListener('mouseup', toggleTheme);
    document.getElementById('em-logo').addEventListener('mouseup', copyEmailToClipboard);

    // Populate text fields
    const intro = document.getElementById('home');
    intro.innerText = 'Under Construction - Coming Soon';
}