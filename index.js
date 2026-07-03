// index.js
import { mountResponsiveBackground } from './celticBox.js';
import { celticBackgroundData } from './config.js';
import { renderCharacterPage, renderMapPage, renderBattlePage, renderGlossaryPage } from './pages.js';

// 1. Grab DOM elements
const bgLayer = document.getElementById('background-layer');
// FIX: Target the new page-content container instead of the whole wrapper
const pageContent = document.getElementById('page-content');
const navButtons = document.querySelectorAll('#sheet-nav-right button');

// 2. Draw the static background ONCE
mountResponsiveBackground(celticBackgroundData, bgLayer);

// 3. The Tab Switching Logic
function loadTab(tabName) {
    // Wipe the container's contents safely (sheetNav is preserved in JS memory)
    pageContent.replaceChildren(); 

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
        case 'character':
            // FIX: Pass the real navigation node into the home page grid setup
            renderCharacterPage(pageContent);
            break;
        case 'map':
            renderMapPage(pageContent);
            // FIX: Append the navigation to the app wrapper flex layout so it stays visible
        case 'battle':
            renderBattlePage(pageContent);
        case 'glossary':
            renderGlossaryPage(pageContent); 

            break;
        default:
            break;
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
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
        .then(registration => console.log('Service Worker registered'))
        .catch(error => console.error('Service Worker failed', error));
    });
}

loadTab('character');