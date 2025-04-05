window.onload = () =>
{
    // Attach event listeners
    document.getElementById('theme-toggle').addEventListener('mouseup', toggleTheme);
    document.getElementById('em-logo').addEventListener('mouseup', copyEmailToClipboard);
    document.addEventListener('click', (event) => {   
        if (!document.getElementById('sidenav').contains(event.target))
        {
            if (!document.getElementById('label-burger').contains(event.target))
            {
                const burgerCheckbox = document.getElementById('burger-checkbox');
                burgerCheckbox.checked = false;    
            }
        }
    });

    document.getElementById('label-burger').addEventListener('mouseup', () => {
        if (document.getElementById('nav-list').classList.contains('hidden'))
        {
            makeVisible(document.getElementById('nav-list'));
            makeVisible(document.getElementById('project-title'));
        }
        else
        {
            makeHidden(document.getElementById('nav-list'));
            makeHidden(document.getElementById('project-title'));
        }
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
    document.addEventListener('scroll', (event) => { event.preventDefault(); }, { passive: false });
    document.addEventListener('DOMMouseScroll', (event) => { event.preventDefault(); }, { passive: false });
    document.addEventListener('MozMousePixelScroll', (event) => { event.preventDefault(); }, { passive: false });
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
