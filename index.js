/**
 * This function runs immediately on the DOM loading.
 * Initializes values and attaches listeners.
 */
window.onload = () =>
{
    // Attach event listeners
    document.getElementById('theme-toggle').addEventListener('mouseup', toggleTheme);
    document.getElementById('em-logo').addEventListener('mouseup', copyEmailToClipboard);
    document.getElementById('nav-list-vertical').addEventListener('mouseup', () =>
    {
        // Closes the sidenav on selection
        const burgerCheckbox = document.getElementById('burger-checkbox');
        burgerCheckbox.checked = false;
    });
    document.addEventListener('wheel', (ev) =>
    {
        // allows scroll-y fallthrough from parent
        const container = document.getElementById('text-container');
        container.scrollTop += ev.deltaY;
    });
    
    const links = document.getElementsByTagName('a');
    for (clickable of links)
    {
        if (clickable.getAttribute('href') === '#')
        {
            clickable.addEventListener('mouseup', pageHandler);
        }
    }
    buildPages();
}

function buildPages()
{
    const mainContainer = document.getElementById('main-container');
    const buildHome = () => 
    {
        const homeContainer = document.createElement('div');
        homeContainer.setAttribute('id', 'home');
        homeContainer.dataset.theme = 'light';

        const rayTracerContainer = document.createElement('div');
        rayTracerContainer.setAttribute("id", "ray-tracer-screenshot-container");

        const textContainer = document.createElement('div');
        textContainer.setAttribute('id', 'text-container');

        const p1 = document.createElement('p');
        p1.classList.add('fine-print');
        p1.dataset.theme = 'light';
        p1.innerText = 'My name is';

        const h1 = document.createElement('h3');
        h1.dataset.theme = 'light';
        h1.innerText = 'Bradley Aldridge';

        const p2 = document.createElement('p');
        p2.classList.add('fine-print');
        p2.classList.add('alt');
        p2.dataset.theme = 'light';
        p2.innerText = 'and I write';

        const h2 = document.createElement('h2');
        h2.dataset.theme = 'light';
        h2.innerText = 'software.';

        textContainer.append(p1, h1, p2, h2);
        homeContainer.append(rayTracerContainer, textContainer);
        mainContainer.append(homeContainer);
    };

    const buildProjects = () => 
    {
        const projectsContainer = document.createElement('div');
        projectsContainer.setAttribute('id', 'projects');
        projectsContainer.dataset.theme = 'light';

        const gifContainer = document.createElement('div');
        gifContainer.setAttribute('id', 'flow-visualizer-gif-container');

        const textContainer = document.createElement('div');
        textContainer.setAttribute('id', 'text-container');

        const p1 = document.createElement('p');
        p1.dataset.theme = 'light';
        p1.innerText = 
        `\
        This image shows a vector field overlayed with a particle emitter. The compass needles show the direction of the flow.\
        The angles of the needles are calculated from a simplex noise image (similar to classic Perlin noise) to give its pseudo-random gradient.\
        `
        textContainer.append(gifContainer, p1);
        projectsContainer.append(textContainer);
        projectsContainer.classList.add('hidden'); 
        projectsContainer.style.opacity = 0;      
        mainContainer.append(projectsContainer);
    };
    const buildReferences = () => 
    {
        const referencesContainer = document.createElement('div');        
        referencesContainer.setAttribute('id', 'references');
        referencesContainer.dataset.theme = 'light';

        referencesContainer.classList.add('hidden');
        referencesContainer.style.opacity = 0;
        mainContainer.append(referencesContainer);
    };
    const buildEmployers = () => 
    {
        const employersContainer = document.createElement('div');
        employersContainer.setAttribute('id', 'employers');
        employersContainer.dataset.theme = 'light';

        employersContainer.classList.add('hidden');
        employersContainer.style.opacity = 0;
        mainContainer.append(employersContainer);
    };

    buildHome();
    buildProjects();
    buildReferences();
    buildEmployers();
}