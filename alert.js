function popUpAlert(inString, timeOut = 3000)
{
    const popUpContainer = document.createElement('div');
    popUpContainer.id = 'pop-up-container';

    const span = document.createElement('span');
    span.style.padding = '1em';
    const content = document.createTextNode(inString);
    span.appendChild(content);
    popUpContainer.appendChild(span);
    document.body.appendChild(popUpContainer);
    popUpContainer.classList.add('fade-out');
    popUpContainer.style.animation = `fadeout ${timeOut}ms forwards`; 

    setTimeout(function(){
        document.body.removeChild(popUpContainer);
    }, timeOut);
}