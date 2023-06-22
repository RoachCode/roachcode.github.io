function toggleTheme()
{
    const button = document.getElementById('toggle-theme-button');
    if (document.body.dataset.theme === 'dark')
    {
        document.body.dataset.theme = 'light';
        button.innerText = 'Enable Dark Mode';
    }
    else
    {
        document.body.dataset.theme = 'dark'
        button.innerText = 'Enable Light Mode';
    }
}

function init()
{
    document.body.dataset.theme = 'light';    
    button.innerText = 'Enable Dark Mode';
    document.getElementById('toggle-theme-button').addEventListener('mouseup', toggleTheme);
}

