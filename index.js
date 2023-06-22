function toggleTheme()
{
    if (document.body.dataset.theme === 'dark')
    {
        document.body.dataset.theme = 'light';
    }
    else
    {
        document.body.dataset.theme = 'dark'
    }
}

function init()
{
    document.body.dataset.theme = 'light';
    const button = document.getElementById('toggle-theme-button');
    button.addEventListener('mouseup', toggleTheme());
}

