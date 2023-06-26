/**
 * Toggles between dark mode and light mode.
 * Changes the body.dataset.theme attribute between 'dark' and 'light'
 */
function toggleTheme()
{
    const checkbox = document.getElementById('theme-checkbox');

    if (checkbox.checked)
    {
        document.body.dataset.theme = 'dark';
    }
    else
    {
        document.body.dataset.theme = 'light';
    }
}

function copyEmailToClipboard() {
  
     // Copy the text inside the text field
    navigator.clipboard.writeText('roachcode@gmail.com');
  
    // Alert the copied text
    popUpAlert('Email address copied to clipboard.', 3000);
  } 