function popUpAlert(inString, timeOut = 2000)
{
    const popUpContainer = document.createElement('div');
    popUpContainer.id = 'pop-up-container';

    const content = document.createTextNode(inString);
    popUpContainer.appendChild(content);
    popUpContainer.style.padding = '1vh';
    popUpContainer.style.paddingBottom = '0.8vh';
    document.body.appendChild(popUpContainer);
    popUpContainer.classList.add('fade-out');
    popUpContainer.style.animation = `fadeout 2000ms forwards ${timeOut}ms`; 

    setTimeout(function()
    {
        document.body.removeChild(popUpContainer);
    }, 2000 + Number(timeOut));
}