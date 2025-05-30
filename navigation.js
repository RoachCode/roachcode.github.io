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
    navigator.clipboard.writeText('brad.aldridge.work@gmail.com');
    popUpAlert('Email address copied to clipboard.', 3000);
}

function pageHandler()
{
    document.getElementById('project-title').innerText = '';
    const pages = [
        document.getElementById('home'),
        document.getElementById('projects'),
        document.getElementById('references')
    ]

    // Choose the page to display
    for (page of pages)
    {
        if (this.id === `${page.id}-link`)
        {   
            page.style.opacity = 0;      
            makeVisible(page);
        }
        else
        {       
            page.style.opacity = 1;   
            makeHidden(page);
        }
        // Create titles
        if (this.id === 'projects-link')
        {
            const title = document.getElementById('project-title');
            title.innerText = "Flow on an Angle Grid";
        }
    }
    const burgerCheckbox = document.getElementById('burger-checkbox');
    burgerCheckbox.checked = false;    
}