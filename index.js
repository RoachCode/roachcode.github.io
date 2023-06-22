toggleTheme()
{
    document.body.dataset.isDarkTheme = !document.body.dataset.isDarkTheme;
    if (document.body.dataset.isDarkTheme)
    {
        document.body.setAttribute('class', 'dark');
    }
    else
    {
        document.body.setAttribute('class', 'light');
    }
}

init()
{
    const button = document.getElementById("toggle-theme-button");
    button.addEventListener('mouseup', toggleTheme());
}

