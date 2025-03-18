//import { pageHandler, toggleTheme, copyEmailToClipboard } from "./navigation.js";
//import { buildPages } from "./build-pages.js"

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

    // Hides or shows pages based on user selection
    const links = document.getElementsByTagName('a');
    for (clickable of links)
    {
        if (clickable.getAttribute('href') === '#')
        {
            clickable.addEventListener('mouseup', pageHandler);
        }
    }

    // Slow scroll speed
    document.addEventListener('wheel', (event) =>
    {
        event.preventDefault();
        const container = document.getElementById('text-container');

        // Calculate the new scroll position
        let delta = event.deltaY;
        let scrollPosition = container.scrollTop + (delta * 0.5);

        // Set the new scroll position
        container.scrollTo({ top: scrollPosition, behavior: 'smooth' });
    }, { passive: false });

    // Builds the different pages so they can be loaded dynamically
    buildPages(); 
}
