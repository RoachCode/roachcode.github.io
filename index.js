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
    document.getElementById('toggle-theme-button').addEventListener('mouseup', toggleTheme());
}

