/**
 * Toggles between dark mode and light mode.
 * Changes the body.dataset.theme attribute between 'dark' and 'light'
 */
function toggleTheme()
{
    const checkbox = document.getElementById('theme-checkbox');
    const wheel = document.getElementById('gradient-wheel');
    const themedElements = document.querySelectorAll('[data-theme]');

    if (checkbox.checked)
    {
        document.body.dataset.theme = 'dark';
        if (wheel.classList.contains('rotate-out')) { wheel.classList.remove('rotate-out') }        
        wheel.classList.add('rotate-in');
    }
    else
    {
        document.body.dataset.theme = 'light';
        if (wheel.classList.contains('rotate-in')) { wheel.classList.remove('rotate-in') }
        wheel.classList.add('rotate-out');
    }
    for (ele of themedElements)
    {
        ele.dataset.theme = document.body.dataset.theme;
    }
}

function copyEmailToClipboard() 
{
     // Copy the text inside the text field
    navigator.clipboard.writeText('roachcode@gmail.com');
  
    // Alert the copied text
    popUpAlert('Email address copied to clipboard.', 3000);
}

function pageHandler()
{
    
    document.getElementById('project-title').innerText = '';
    const pages = [
        document.getElementById('home'),
        document.getElementById('projects'),
        document.getElementById('references'),
        document.getElementById('employers')
    ]

    // Choose the page to display
    for (page of pages)
    {
        if (this.id === `${page.id}-link`)
        {   
            page.style.opacity = 0;      
            if (!page.classList.contains('visible')) { page.classList.add('visible'); }
            if (page.classList.contains('hidden')) { page.classList.remove('hidden'); }
        }
        else
        {       
            page.style.opacity = 1;   
            if (!page.classList.contains('hidden')) { page.classList.add('hidden'); }
            if (page.classList.contains('visible')) { page.classList.remove('visible'); }

        }
        if (this.id === 'projects-link')
        {
            const title = document.getElementById('project-title');
            title.innerText = "Flow on a Grid";
        }
        if (this.id === 'employers-link')
        {
            const title = document.getElementById('project-title');
            title.innerText = '';
        }
    }
}