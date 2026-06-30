// index.js
import { createHexBackground } from './celticBox.js';
import { celticBackgroundData } from './config.js';
import { renderHomePage, renderAboutPage } from './pages.js';

// 1. Grab DOM elements
const bgLayer = document.getElementById('background-layer');
const contentContainer = document.getElementById('content-container');
const navButtons = document.querySelectorAll('#tab-buttons button');

// 2. Draw the static background ONCE
createHexBackground(celticBackgroundData, bgLayer);

// 3. The Tab Switching Logic
function loadTab(tabName) {
    // Fast, modern way to completely wipe the container's contents
    contentContainer.replaceChildren(); 

    // Route to the correct page builder
    switch (tabName) {
        case 'home':
            renderHomePage(contentContainer);
            break;
        case 'about':
            renderAboutPage(contentContainer);
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