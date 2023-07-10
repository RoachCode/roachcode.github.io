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

    const links = document.getElementsByTagName('a');
    for (clickable of links)
    {
        if (clickable.getAttribute('href') === '#')
        {
            clickable.addEventListener('mouseup', pageHandler);
        }
    }

    buildPages(); 

    document.addEventListener('wheel', (ev) =>
    {
        // allows scroll-y fallthrough from parent
        const container = document.getElementById('text-container');
        container.scrollTop += ev.deltaY;
    });
}

function buildPages()
{
    const mainContainer = document.getElementById('main-container');
    mainContainer.style.opacity = 0;
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
        const title = document.createElement('div');
        title.setAttribute('id', 'project-title')
        title.innerText = "Graphics - Flow Vectors on a Grid";

        const projectsContainer = document.createElement('div');
        projectsContainer.setAttribute('id', 'projects');
        projectsContainer.dataset.theme = 'light';

        const gifContainer1 = document.createElement('div');
        gifContainer1.setAttribute('id', 'flow-visualizer-gif-container');

        const textContainer = document.createElement('div');
        textContainer.setAttribute('id', 'text-container');


        const p1 = document.createElement('p');
        p1.classList.add('p1');
        p1.innerText = 
        `\
        I've been working on a flow simulator to incorporate into 2D games. While a true fluid simulation would take into account density, viscosity etc., \
        This simpler approximation uses a predefined grid of velocities that are multiplied with the current velocity of each particle.
        Having control of the flow field allows flexibility in how this can be used - randomly placed pulses with textures applied to the particles \
        can be used for floating/falling objects, or a static emitter can form a stream for water or lightning.\
        `;

        const p2 = document.createElement('p');
        p2.classList.add('p2', 'fine-print', 'image-footer');
        p2.dataset.theme = 'light';
        p2.innerText = 
        `\
        This image shows a vector field overlayed with a particle emitter. The compass needles show the direction of the flow.\
        The angles of the needles are calculated from a Simplex noise image (similar to classic Perlin noise) to give its pseudo-random gradient.\
        `;

        const p3 = document.createElement('p');
        p3.classList.add('p3');
        p3.innerText = 
        `\
        The following image uses the same Simplex noise algorithm but at a much more fine-grained scale. \
        The values that created the angles in the previous image are represented here as a gradient between black and white.\
        Creating a static image is fairly easy - 2D noise is needed, and you can use simple coordinates as the inputs for the noise.\
        Looping the noise was a bit more difficult, ultimately needing 4D noise.
        The noise that would make up the image had to be mapped to a cylinder first, so that the X coordinate would be circular (end up back where it started)/
        Then, this cylinder had to be bent together at the end, creating a torus, to give a final image that can loop in any 2D direction.
        `;

        const gifContainer2 = document.createElement('div');
        gifContainer2.setAttribute('id', 'noise-gif-container');

        textContainer.append(gifContainer1, p1, p2, p3, gifContainer2);
        projectsContainer.append(title, textContainer);
        projectsContainer.classList.add('hidden');      
        mainContainer.append(projectsContainer);
    };
    const buildReferences = () => 
    {
        const referencesContainer = document.createElement('div');        
        referencesContainer.setAttribute('id', 'references');
        referencesContainer.dataset.theme = 'light';

        referencesContainer.classList.add('hidden');
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


    buildProjects();
    buildReferences();
    buildEmployers();
    buildHome();    

    mainContainer.style.opacity = 1;
}
