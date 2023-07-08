/**
 * Toggles between dark mode and light mode.
 * Changes the body.dataset.theme attribute between 'dark' and 'light'
 */
function toggleTheme()
{
    const checkbox = document.getElementById('theme-checkbox');
    const wheel = document.getElementById('gradient-wheel');
    const mainContainer = document.getElementById('main-container');

    if (checkbox.checked)
    {
        document.body.dataset.theme = 'dark';
        mainContainer.dataset.theme = document.body.dataset.theme;
        if (wheel.classList.contains('rotate-out')) { wheel.classList.remove('rotate-out') }        
        wheel.classList.add('rotate-in');
    }
    else
    {
        document.body.dataset.theme = 'light';
        mainContainer.dataset.theme = document.body.dataset.theme;
        if (wheel.classList.contains('rotate-in')) { wheel.classList.remove('rotate-in') }        
        wheel.classList.add('rotate-out');
    }
}

function copyEmailToClipboard() 
{
     // Copy the text inside the text field
    navigator.clipboard.writeText('roachcode@gmail.com');
  
    // Alert the copied text
    popUpAlert('Email address copied to clipboard.', 3000);
} 