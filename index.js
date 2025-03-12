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

    // Slows scroll wheel to a reasonable speed
    document.addEventListener('wheel', (ev) =>
    {
        // allows scroll-y fallthrough from parent
        ev.preventDefault();
        ev.stopImmediatePropagation();
        ev.stopPropagation();
        const container = document.getElementById('text-container');
        container.scrollTop += ev.deltaY / 5;
    }, false);

    // Builds the different pages so they can be loaded dynamically
    buildPages(); 
}
