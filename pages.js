// pages.js
import { mountResponsiveBackground, mountResponsiveTextBox } from './celticBox.js';
import { celticTextboxData } from './config.js';
import { testLandmassSvg } from './mapData.js';
import panzoom from 'https://cdn.jsdelivr.net/npm/panzoom@9.4.3/+esm';

export function renderCharacterPage(container) {
    const characterSheet = document.createElement('div');
    characterSheet.id = 'character-sheet';

    const sections = [
        { id: 'sheet-header' }, { id: 'sheet-header2' },
        { id: 'sheet-header3' }, { id: 'sheet-stats' },
        { id: 'sheet-skills' }, { id: 'sheet-combat' },
        { id: 'sheet-features' }, { id: 'sheet-arc' }
    ];

    sections.forEach(sec => {
        const div = document.createElement('div');
        div.id = sec.id;
        div.className = 'sheet-section'; 
        characterSheet.appendChild(div);
    });

    // 1. Add characterSheet to the DOM FIRST
    container.appendChild(characterSheet);

    // 2. NOW we can query the DOM for #sheet-arc
    const sheetArc = document.getElementById('sheet-arc');
    
    // Define your stats array here
    const stats = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'];

    // 3. Perform calculations
    const rect = sheetArc.getBoundingClientRect();
    const aspectRatio = rect.width / rect.height;

    // We use a base radius relative to the container width (e.g., 30%)
    // If the box is wider than it is tall, we force the Y radius to shrink 
    // to keep the orbit circular rather than stretched.
    const radiusX = 30; 
    const radiusY = 30 * aspectRatio; 

    const centerX = 50; 
    const centerY = 50;

    stats.forEach((stat, i) => {
        // Calculate degrees: 0, 60, 120, 180, 240, 300
        // We don't need radians for CSS!
        const angle = i * (360 / stats.length); 
        
        const shape = `<circle cx="50" cy="50" r="45" fill="#00000000" stroke="var(--text-color)" stroke-width="4"/>`;
        const node = createStatComponent(shape, 10, stat); 
        
        // Pin every node to the exact dead-center of #sheet-arc
        node.style.top = '50%';
        node.style.left = '50%';
        
        // The Magic Formula:
        // 1. Center it (-50%, -50%)
        // 2. Rotate it to the correct angle
        // 3. Push it outward by a factor of its own size (e.g., 180%)
        // 4. Rotate it backward so the text/numbers stay upright
        node.style.transform = `
            translate(-50%, -50%) 
            rotate(${angle}deg) 
            translateY(calc(-50cqmin + 14cqmin)) 
            rotate(-${angle}deg)
        `;
        // 4. APPEND TO sheetArc
        sheetArc.appendChild(node);
    });
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
        mapSvg.setAttribute('class', 'map-fill');
        
        // 2. Create the <use> element for the border
        // IMPORTANT: You must use createElementNS for SVG elements
        const useElement = document.createElementNS("http://www.w3.org/2000/svg", "use");
        useElement.setAttributeNS("http://www.w3.org/1999/xlink", "href", "#map-data");
        useElement.setAttribute('class', 'map-border');

// 3. Append the <use> tag directly to mapSvg
// Since it's inside mapSvg, panzoom will move it automatically!
mapSvg.appendChild(useElement);

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

export function renderBattlePage(container) {

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

export function createStatComponent(svgInnerCode, startingNumber, label = '') {
    const wrapper = document.createElement('div');
    wrapper.className = 'stat-node';
    
    // 1. The SVG Background Layer
    const svgLayer = `
        <svg class="node-art" viewBox="0 0 100 100">
            ${svgInnerCode}
        </svg>
    `;

    // 2. The HTML Foreground Layer
    const contentLayer = `
        <div class="node-content">
            ${label ? `<span class="node-label">${label}</span>` : ''}
            <input type="text" class="stat-input" value="${startingNumber}" />
        </div>
    `;

    wrapper.innerHTML = svgLayer + contentLayer;
    return wrapper;
}