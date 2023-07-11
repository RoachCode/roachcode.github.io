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
        p1.innerText = 'Hello! My name is';

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

        const title = document.getElementById('project-title');
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
        this simpler approximation uses a predefined grid of velocities that are multiplied with the current velocity of each particle.
        Having control of the flow field allows flexibility in how this can be used - randomly placed pulses with textures applied to the particles \
        can be used for floating/falling objects, or a static emitter can form a stream for water or lightning.\
        `;

        const p2 = document.createElement('p');
        p2.classList.add('p2', 'fine-print', 'image-footer');
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
        Then, this cylinder had to be bent together at the end, creating a torus, to give a final image that can loop in any 2D direction.\
        `;

        const gifContainer2 = document.createElement('div');
        gifContainer2.setAttribute('id', 'noise-gif-container');

        const p4 = document.createElement('p');
        p4.classList.add('p4', 'fine-print', 'image-footer');
        p4.innerText = 
        `\
        This image shows Simplex noise looping over the X and Y axis. It's worth noting that one of the dimensions can be substituted\
        for time, allowing permutation of the noise - but if you're creating tileable noise, you'll run out of dimensions quickly if your noise engine\
        can't support 5+ dimensions.\
        `;

        const p5 = document.createElement('p');
        p5.classList.add('p5');
        p5.innerText = 
        `\
        The following image uses the same Simplex noise width an extra modifier added for the time dimensions. \
        As you can see it doesn't loop cleanly - for now my workaround is to reverse the animation after some time. \
        Currently the engine only supports up to 4D noise. The colour values here are clamped to give sharper edges.
        `;

        const gifContainer3 = document.createElement('div');
        gifContainer3.setAttribute('id', 'noise-time-container');

        const p6 = document.createElement('p');
        p6.classList.add('p6');
        p6.innerText = 
        `\
        Here's the noise in action:
        `;

        const gifContainer4 = document.createElement('div');
        gifContainer4.setAttribute('id', 'game-scene-container');

        const p7 = document.createElement('p');
        p7.classList.add('p7', 'fine-print', 'image-footer');
        p7.innerText = 
        `\
        In this image you can see the tilemap scene and the noise overlays. This is being written using the SFML library.\
        `;
        
        const p8 = document.createElement('p');
        p8.classList.add('p8');
        p8.innerText =
        `\
        Moving on to something a little different.
        I've been working through a wonderful course called Ray Tracing in One Weekend by Peter Shirley (see References tab).\
        This is a very low level implementation - no textures or models are used, all objects in the scene are drawn using scattering and surface normals.\
        I've been adapting the architechture to work with SFML (OpenGL) and plan on adding caustics before moving on to different shapes, lighting, and speed improvements.
        `;

        const imageContainer1 = document.createElement('div');
        imageContainer1.setAttribute('id', 'ray-tracer-container');

        const p9 = document.createElement('p');
        p9.classList.add('p9', 'fine-print', 'image-footer');
        p9.innerText = 
        `\
        Here you can see a raytraced scene of randomly populated spheres with three types of scattering - lambertian (diffuse), \
        dialectric (glass), and reflective (metal).\
        `;

        const p10 = document.createElement('p');
        p10.classList.add('p10', 'fine-print');
        p10.innerText = '-end of page-'

        textContainer.append(gifContainer1, p1, p2, p3, gifContainer2, p4, p5, gifContainer3, p6, gifContainer4, p7, p8, imageContainer1, p9, p10);
        projectsContainer.append(textContainer);
        projectsContainer.classList.add('hidden');      
        mainContainer.append(projectsContainer);

        textContainer.addEventListener('scroll', () => 
        {
            if (!projectsContainer.classList.contains('hidden'))
            {
                const gif1HiddenValue = gifContainer1.offsetTop + gifContainer1.clientHeight;
                const gif2HiddenValue = gifContainer2.offsetTop + gifContainer2.clientHeight;
                const gif3HiddenValue = gifContainer3.offsetTop + gifContainer3.clientHeight;
                const gif4HiddenValue = gifContainer4.offsetTop + gifContainer4.clientHeight;
                const image1HiddenValue = imageContainer1.offsetTop + imageContainer1.clientHeight;
                if (textContainer.scrollTop < gif1HiddenValue) { title.innerText = "Graphics - Flow Vectors on a Grid"; }
                else if (textContainer.scrollTop < gif2HiddenValue) { title.innerText = "Graphics - Tileable Simplex (Perlin) Noise"; }
                else if (textContainer.scrollTop < gif3HiddenValue) { title.innerText = "Graphics - Tileable Simplex Over Time"; }
                else if (textContainer.scrollTop < gif4HiddenValue) { title.innerText = "Graphics - Scene with Noise"; }
                else if (textContainer.scrollTop < image1HiddenValue) { title.innerText = "Graphics - Raytracer"; }
            }
        });
    };
    const buildReferences = () => 
    {
        const referencesContainer = document.createElement('div');        
        referencesContainer.setAttribute('id', 'references');
        referencesContainer.dataset.theme = 'light';

        const textContainer = document.createElement('div');
        textContainer.setAttribute('id', 'text-container');

        const oneWeekendLink = document.createElement('a');
        oneWeekendLink.setAttribute('href', 'https://raytracing.github.io/');
        oneWeekendLink.dataset.theme = 'light';
        oneWeekendLink.innerText = 'Ray Tracing Series by Peter Shirley';
        oneWeekendLink.append(document.createElement('br'));

        const sfmlLink = document.createElement('a');
        sfmlLink.setAttribute('href', 'https://www.sfml-dev.org/');
        sfmlLink.dataset.theme = 'light';
        sfmlLink.innerText = 'SFML - Simple and Fast Multimedia Library';
        sfmlLink.append(document.createElement('br'));

        const simplexLink = document.createElement('a');
        simplexLink.setAttribute('href', 'https://github.com/deerel/OpenSimplexNoise');
        simplexLink.dataset.theme = 'light';
        simplexLink.innerText = 'C++ Port of OpenSimplexNoise by Rickard Lundberg';
        simplexLink.append(document.createElement('br'));

        textContainer.append(oneWeekendLink, sfmlLink, simplexLink);
        referencesContainer.append(textContainer);
        referencesContainer.classList.add('hidden');
        mainContainer.append(referencesContainer);
    };
    const buildEmployers = () => 
    {
        const employersContainer = document.createElement('div');
        employersContainer.setAttribute('id', 'employers');
        employersContainer.dataset.theme = 'light';

        const title = document.getElementById('project-title');
        title.innerText = 'Welcome to the employer portal';

        const textContainer = document.createElement('div');
        textContainer.setAttribute('id', 'text-container');
        textContainer.dataset.theme = 'light';

        var a1 = document.createElement('a');
        a1.classList.add('a1');
        a1.href = 'resume.pdf';
        a1.download = 'resume.pdf';

        a1.dataset.theme = 'light';
        a1.innerText = 'Click to download resume (pdf)'
        a1.append(document.createElement('br'));


        employersContainer.classList.add('hidden');
        employersContainer.style.opacity = 0;
        textContainer.append(a1);
        employersContainer.append(textContainer)
        mainContainer.append(title, employersContainer);
    };


    buildProjects();
    buildReferences();
    buildEmployers();
    buildHome();

    document.getElementById('project-title').innerText = '';
    mainContainer.style.opacity = 1;
}
