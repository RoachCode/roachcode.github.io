function buildHome()
{
    // Creates main container in light mode
    const mainContainer = document.getElementById('main-container');
    const homeContainer = document.createElement('div');
    homeContainer.setAttribute('id', 'home');
    homeContainer.dataset.theme = 'light';

    // Creates background image
    const rayTracerContainer = document.createElement('div');
    rayTracerContainer.setAttribute("id", "ray-tracer-screenshot-container");

    // Creates subrect container
    const textContainer = document.createElement('div');
    textContainer.setAttribute('id', 'text-container');

    // Adds home screen text
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

    // Appends all
    textContainer.append(p1, h1, p2, h2);
    homeContainer.append(rayTracerContainer, textContainer);
    mainContainer.append(homeContainer);
};

function buildProjects()
{
    // Handles creation and style of elements.
    // This is styled automatically so that changes are easy
    // And scalable, and nothing breaks the DOM.
    class Project
    {
        constructor(imageId, pText, fText)
        {
            this.elementArray = [];

            const paragraphCount = pText.pText.length;
            for (let i = 0; i < paragraphCount; ++i)
            {
                this.paragraph = document.createElement('p');
                this.paragraph.innerText = pText.pText[i];
                this.elementArray.push(this.paragraph);                
            }

            const imageCount = imageId.imageId.length;
            for (let i = 0; i < imageCount; ++i)
            {
                this.image = document.createElement('div');
                this.image.setAttribute('id', imageId.imageId[i]);
                this.image.style.width = '90%';
                this.image.style.height = '50vh';
                this.image.style.backgroundSize = 'cover';
                this.image.style.placeSelf = 'center';
                this.elementArray.push(this.image);
            }

            const footerCount = fText.fText.length;
            for (let i = 0; i < footerCount; ++i)
            {
                this.footer = document.createElement('p');
                this.footer.classList.add('fine-print', 'image-footer');
                this.footer.innerText = fText.fText[i];
                this.elementArray.push(this.footer);
            }
        }
        getElements()
        {
            return this.elementArray;
        }
    }

    // Set defaults
    const mainContainer = document.getElementById('main-container');
    const title = document.getElementById('project-title');
    title.innerText = "Flow on an Angle Grid";
    const projectsContainer = document.createElement('div');
    projectsContainer.setAttribute('id', 'projects');
    projectsContainer.dataset.theme = 'light';
    const textContainer = document.createElement('div');
    textContainer.setAttribute('id', 'text-container');

    // Build projects
    const flowProject = new Project
    (
        {imageId: ['flow-visualizer-gif-container']},
        {pText: [
        `\
        I've been working on a flow simulator to incorporate into 2D games. While a true fluid simulation would take into account density, viscosity etc., \
        this simpler approximation uses a predefined grid of velocities that are multiplied with the current velocity of each particle.
        Having control of the flow field allows flexibility in how this can be used - randomly placed pulses with textures applied to the particles \
        can be used for floating/falling objects, or a static emitter can form a stream for water or lightning.\
        `
        ]},
        {fText: [
        `\
        This image shows a vector field overlayed with a particle emitter. The compass needles show the direction of the flow.\
        The angles of the needles are calculated from a Simplex noise image (similar to classic Perlin noise) to give its pseudo-random gradient.\
        `
        ]}
    );

    const noiseProject = new Project
    (
        {imageId: ['noise-gif-container']},
        {pText:[
        `\
        The following image uses the same Simplex noise algorithm but at a much more fine-grained scale. \
        The values that created the angles in the previous image are represented here as a gradient between black and white.\
        Creating a static image is fairly easy - 2D noise is needed, and you can use simple coordinates as the inputs for the noise.\
        Looping the noise was a bit more difficult, ultimately needing 4D noise.
        The noise that would make up the image had to be mapped to a cylinder first, so that the X coordinate would be circular (end up back where it started)\
        Then, this cylinder had to be bent together at the end, creating a torus, to give a final image that can loop in any 2D direction.\
        `
        ]},
        {fText: [
        `\
        This image shows Simplex noise looping over the X and Y axis. It's worth noting that one of the dimensions can be substituted\
        for time, allowing permutation of the noise - but if you're creating tileable noise, you'll run out of dimensions quickly if your noise engine\
        can't support 5+ dimensions.\
        `
        ]}
    );

    const noiseTimeProject = new Project
    (
        {imageId: ['noise-time-container']},
        {pText: [
        `\
        The following image uses the same Simplex noise width an extra modifier added for the time dimensions. \
        As you can see it doesn't loop cleanly - for now my workaround is to reverse the animation after some time. \
        Currently the engine only supports up to 4D noise. The colour values here are clamped to give sharper edges.
        `, 
        `Here's the noise in action:
        `
        ]},
        {fText: []}
    );
    
    const gameSceneProject = new Project
    (
        {imageId: ['game-scene-container']},
        {pText: [' ']},
        {fText: [
        `\
        In this image you can see the tilemap scene and the noise overlays. This is being written using the SFML library.\
        `
        ]}
    );

    const shaderProject = new Project
    (
        {imageId: ['shader-container']},
        {pText: [
            `\
            Here I've added a point light source and a normal map to the tilemap. This makes a marked difference in the perceived quality of the graphics.
            `
        ]},
        {fText: [
            `\
            Characters in a snake formation with a light source attached, showing reflection of light off of surface normals.
            `
        ]}
    )

    const rayTracerProject = new Project
    (
        {imageId: ['ray-tracer-container']},
        {pText: [
        `\
        Moving on to something a little different.
        I've been working through a wonderful course called Ray Tracing in One Weekend by Peter Shirley (see References tab).\
        This is a very low level implementation - no textures or models are used, all objects in the scene are drawn using scattering and surface normals.\
        I've been adapting the architechture to work with SFML (OpenGL) and plan on adding caustics before moving on to different shapes, lighting, and speed improvements.
        `
        ]},
        {fText: [
        `\
        Here you can see a raytraced scene of randomly populated spheres with three types of scattering - lambertian (diffuse), \
        dialectric (glass), and reflective (metal).\
        `
        ]}
    );
    
    // Adds end of page text, since the scrollbar is hidden.
    const pEnd = document.createElement('p');
    pEnd.classList.add('end', 'fine-print');
    pEnd.innerText = '-end of page-'

    // Appends all elements to textContainer
    textContainer.append(
        ...flowProject.getElements(),
        ...noiseProject.getElements(),
        ...noiseTimeProject.getElements(),
        ...gameSceneProject.getElements(),
        ...shaderProject.getElements(),
        ...rayTracerProject.getElements(),
        pEnd
    );

    // Assign grid row start style to each element in container
    for(var i = 0; i < textContainer.childElementCount; i++)
    {
        textContainer.children[i].style.gridRowStartCount = Number(i) + 1;
    }

    // Append to parent containers
    projectsContainer.append(textContainer);
    projectsContainer.classList.add('hidden');      
    mainContainer.append(projectsContainer);

    // Create mini-map of projects page
    const minimapContainer = document.createElement('div');
    minimapContainer.setAttribute('id', 'minimap-container');

    // Create a duplicate of the main container
    const minimap = document.createElement('div');
    minimap.setAttribute('id', 'minimap');
    minimap.innerHTML = textContainer.innerHTML;

    const resizeScrollBar = () =>
    {
        minimap.style.width = `${mainContainer.clientWidth}px`;
        minimap.style.height = `${mainContainer.clientHeight}px`;

        // Define computed CSS styles for use here and now
        function vh(percent)
        {
            var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
            return (percent * h) / 100;
        }
        function vw(percent)
        {
            var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
            return (percent * w) / 100;
        }
        function vmin(percent)
        {
            return Math.min(vh(percent), vw(percent));
        }
    
        // Define ratio of original container to minimap div and transform scale, position
        const scaleWidth = vmin(6) / mainContainer.clientWidth;
        const scaleHeight = vh(89) / textContainer.lastElementChild.offsetTop;
        // offset by the original width minus the new width, divided by two.
        const offsetX = (mainContainer.clientWidth - vmin(6)) / 2;
        // offset by the original height minus the ratio of the new height to the last element height, divided by two.
        const offsetY = (mainContainer.clientHeight / 2) - ((vh(89) * scaleHeight) / 2);
        minimap.style.transform = `translate(-${offsetX}px, -${offsetY}px) scale(${scaleWidth}, ${scaleHeight})`;
    }
    resizeScrollBar();
    // Append containers
    minimapContainer.append(minimap);
    projectsContainer.append(minimapContainer);

    // Resizes the scrollbar dynamically
    window.addEventListener('resize', resizeScrollBar);
    // Event listener that changes the title based on scroll position
    // TODO: make this generic and scalable
    textContainer.addEventListener('scroll', () => 
    {
        if (!projectsContainer.classList.contains('hidden'))
        {
            const img1HiddenValue = flowProject.image.offsetTop + flowProject.image.clientHeight;
            const img2HiddenValue = noiseProject.image.offsetTop + noiseProject.image.clientHeight;
            const img3HiddenValue = noiseTimeProject.image.offsetTop + noiseTimeProject.image.clientHeight;
            const img4HiddenValue = gameSceneProject.image.offsetTop + gameSceneProject.image.clientHeight;
            const img5HiddenValue = shaderProject.image.offsetTop + shaderProject.image.clientHeight;
            const img6HiddenValue = rayTracerProject.image.offsetTop + rayTracerProject.image.clientHeight;
            if      (textContainer.scrollTop < img1HiddenValue) { title.innerText = "Flow on an Angle Grid"; }
            else if (textContainer.scrollTop < img2HiddenValue) { title.innerText = "Tileable Simplex Noise"; }
            else if (textContainer.scrollTop < img3HiddenValue) { title.innerText = "Simplex Over Time"; }
            else if (textContainer.scrollTop < img4HiddenValue) { title.innerText = "Scene with Noise"; }
            else if (textContainer.scrollTop < img5HiddenValue) { title.innerText = "Scene with Light and Normals"; }
            else if (textContainer.scrollTop < img6HiddenValue) { title.innerText = "Raytracer with Spheres"; }
        }
    });
};

function buildReferences() 
{
    // Create containers
    const mainContainer = document.getElementById('main-container');
    const referencesContainer = document.createElement('div');        
    referencesContainer.setAttribute('id', 'references');
    referencesContainer.dataset.theme = 'light';
    const textContainer = document.createElement('div');
    textContainer.setAttribute('id', 'text-container');

    // Links to Ray Tracing in One Weekend
    const oneWeekendLink = document.createElement('a');
    oneWeekendLink.setAttribute('href', 'https://raytracing.github.io/');
    oneWeekendLink.dataset.theme = 'light';
    oneWeekendLink.innerText = 'Ray Tracing Series by Peter Shirley';
    oneWeekendLink.append(document.createElement('br'));

    // Links to Simple Fast Multimedia Library
    const sfmlLink = document.createElement('a');
    sfmlLink.setAttribute('href', 'https://www.sfml-dev.org/');
    sfmlLink.dataset.theme = 'light';
    sfmlLink.innerText = 'SFML - Simple and Fast Multimedia Library';
    sfmlLink.append(document.createElement('br'));

    // Links to C++ port of Open Simplex
    const simplexLink = document.createElement('a');
    simplexLink.setAttribute('href', 'https://github.com/deerel/OpenSimplexNoise');
    simplexLink.dataset.theme = 'light';
    simplexLink.innerText = 'C++ Port of OpenSimplexNoise by Rickard Lundberg';
    simplexLink.append(document.createElement('br'));

    // Append all to parents
    textContainer.append(oneWeekendLink, sfmlLink, simplexLink);
    referencesContainer.append(textContainer);
    referencesContainer.classList.add('hidden');
    mainContainer.append(referencesContainer);
};

function buildEmployers()
{
    // Build containers
    const mainContainer = document.getElementById('main-container');
    const employersContainer = document.createElement('div');
    employersContainer.setAttribute('id', 'employers');
    employersContainer.dataset.theme = 'light';
    employersContainer.classList.add('hidden');
    employersContainer.style.opacity = 0;

    const textContainer = document.createElement('div');
    textContainer.setAttribute('id', 'text-container');
    textContainer.dataset.theme = 'light';

    // Add title
    const title = document.getElementById('project-title');
    title.innerText = 'Welcome to the employer portal';

    // Add resume link
    var a1 = document.createElement('a');
    a1.classList.add('a1');
    //a1.href = 'resume.pdf';
    //a1.download = 'resume.pdf';
    a1.dataset.theme = 'light';
    a1.innerText = 'Click to download resume (pdf) [Currently Disabled]'
    a1.append(document.createElement('br'));

    // Append all
    textContainer.append(a1);
    employersContainer.append(textContainer)
    mainContainer.append(employersContainer);
};

function buildPages()
{
    // Sets homepage to visible
    const mainContainer = document.getElementById('main-container');
    mainContainer.style.opacity = 0;

    // Builds all pages and hides them
    buildProjects();
    buildReferences();
    buildEmployers();
    buildHome();

    // Reset all and wait for user selection
    document.getElementById('project-title').innerText = '';
    mainContainer.style.opacity = 1;
}

//export { buildPages };