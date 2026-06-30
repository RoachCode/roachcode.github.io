import { createHexBackground } from './celticBox.js';
import { celticBackgroundData } from './config.js';
import { renderHomePage, renderAboutPage, renderContactPage } from './pages.js';

// 1. Grab DOM elements
const bgLayer = document.getElementById('background-layer');
const contentContainer = document.getElementById('content-container');
const navButtons = document.querySelectorAll('#side-tabs button');

// 2. Draw the static background ONCE
createHexBackground(celticBackgroundData, bgLayer);

// 3. The Tab Switching Logic
function loadTab(tabName) {
    // Wipe the container's contents
    contentContainer.replaceChildren(); 

    // Update the visual "active" state on the tabs
    navButtons.forEach(btn => {
        if (btn.getAttribute('data-target') === tabName) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // Route to the correct page builder
    switch (tabName) {
        case 'home':
            renderHomePage(contentContainer);
            break;
        case 'about':
            renderAboutPage(contentContainer);
            break;
        case 'contact':
            // Added a quick fallback for your third button so it doesn't crash!
            renderContactPage(contentContainer); 
            break;
        default:
            console.error("Tab not found:", tabName);
    }
}

// 4. Attach Event Listeners to Buttons
navButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        const targetTab = e.target.getAttribute('data-target');
        loadTab(targetTab);
    });
});

// 5. Initialize the default view on load
loadTab('home');