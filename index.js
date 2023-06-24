
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

function init()
{
    // Attach event listeners
    document.getElementById('theme-toggle').addEventListener('mouseup', toggleTheme);

    const intro = document.getElementById('introduction');
    intro.innerText = 'Hello';
}
