// pages.js
import { mountResponsiveBackground, mountResponsiveTextBox } from './celticBox.js';
import { celticTextboxData } from './config.js';
import { testLandmassSvg } from './mapData.js';
import panzoom from 'https://cdn.jsdelivr.net/npm/panzoom@9.4.3/+esm';

export function renderCharacterPage(container) {
    const characterSheet = document.createElement('div');
    characterSheet.id = 'character-sheet';

    const sections = [
        { id: 'sheet-header' },
        { id: 'sheet-stats' },
        { id: 'sheet-skills' },
        { id: 'sheet-combat' },
        { id: 'sheet-features' }
    ];

    sections.forEach(sec => {
        const div = document.createElement('div');
        div.id = sec.id;
        div.className = 'sheet-section'; 
        characterSheet.appendChild(div);
    });

    // The entire page gets dropped into pageContent. No nav hacking required.
    container.appendChild(characterSheet);
}

export async function renderMapPage(container) {
    // 1. Kick off the UI builder (it does its thing in the background)
    mountResponsiveTextBox(celticTextboxData, container, "");

    try {
        const targetArea = await waitForElement('.hex-box-content', container);
        targetArea.innerHTML = testLandmassSvg;

        // 2. Grab the actual SVG element inside your wrapper
        const mapSvg = targetArea.querySelector("svg");
        mapSvg.style.width = "100%";
        mapSvg.style.height = "100%";
        
        // 3. INITIALIZE PANZOOM
        // This single line adds mouse drag, mouse wheel, and mobile pinch-to-zoom
        const mapController = panzoom(mapSvg, {

        });

        mapContainer.addEventListener('mousedown', (e) => {
            // e.button === 1 is the middle mouse wheel click
            if (e.button === 1) { 
                e.preventDefault(); // Stops the annoying auto-scroll icon from appearing

                // Reset the scale to 1 (100%) relative to the top-left corner (0,0)
                mapController.zoomAbs(0, 0, 1); 
                
                // Move the map back to its original 0,0 position
                mapController.moveTo(0, 0); 
            }
        });

    } catch (error) {
        console.error("Failed to attach map:", error);
    }
}

export function renderGlossaryPage(container) {

}

// A helpful little tool that waits for an element to exist
function waitForElement(selector, parent = document) {
    return new Promise(resolve => {
        // If it's already there, return it immediately
        const existingElement = parent.querySelector(selector);
        if (existingElement) {
            return resolve(existingElement);
        }

        // Otherwise, set up an observer to watch for changes in the DOM
        const observer = new MutationObserver((mutations) => {
            const foundElement = parent.querySelector(selector);
            if (foundElement) {
                observer.disconnect(); // Stop watching once we find it
                resolve(foundElement);
            }
        });

        // Start watching the parent container for new children
        observer.observe(parent, { childList: true, subtree: true });
    });
}