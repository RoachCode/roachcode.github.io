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
    const stats = ['Strength', 'Dexterity', 'Constitution', 'Intelligence', 'Wisdom', 'Charisma'];

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
        
        const shape = `<circle cx="50" cy="50" r="45" fill="#00000000" stroke="var(--text-color)" stroke-width="2"/>`;
        const config = { radius: 45 }; 
        const node = createStatComponent(shape, 10, stat, angle); 
        
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
        translateY(calc(-50cqmin + 20cqmin)) 
        rotate(-${angle}deg)
    `;
        // 4. APPEND TO sheetArc
        sheetArc.appendChild(node);

        // ==========================================
        // 2. INNER RING (New smaller circles)
        // ==========================================
        // Decrease 'r' to make the circle itself smaller (e.g., from 45 to 20)
        const innerShape = `<circle cx="50" cy="50" r="22" fill="#00000000" stroke="var(--text-color)" stroke-width="1"/>`;
        
        // Pass whatever inner value/text you need here (using "+0" and an empty string as placeholders)
        const configSmall = { radius: 22 }; 
        const innerNode = createStatComponent(innerShape, "+0", "", angle, configSmall);
        
        innerNode.style.top = '50%';
        innerNode.style.left = '50%';
        innerNode.style.position = 'absolute';
        
        // Set a higher z-index so it sits on top of the central blue circle
        innerNode.style.zIndex = '5'; 
        
        // Push it outward by a smaller amount. 
        // The outer ring pushes by effectively -30cqmin. 
        // We will push this inner ring by -14cqmin to keep it inside.
        innerNode.style.transform = `
            translate(-50%, -50%) 
            rotate(${angle}deg) 
            translateY(-14cqmin) 
            rotate(-${angle}deg)
        `;
        
        sheetArc.appendChild(innerNode);
    });

    // 1. Create the element
    const circle = document.createElement('div');

    // 2. Define the styles
    const size = '40cqmin';
    Object.assign(circle.style, {
    width: size,
    height: size,
    borderRadius: '50%',
    backgroundColor: 'color-mix(in srgb, #365568, transparent 0%)', // Using your variable
    border: '1px solid #d5d1596d',            // Or another variable/color
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 3
    });

    // 3. Append it to the document body
    sheetArc.appendChild(circle);
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
const pageContent = document.getElementById('page-content');


  // Create the iframe
  const iframe = document.createElement('iframe');
  
  // Set attributes for the stream
  iframe.src = 'https://www.youtube.com/embed/Wo-iVbHpTZw?autoplay=1&mute=1';
  iframe.title = 'Battle Map Stream';
  iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
  iframe.allowFullscreen = true;
  
  // Use CSS for styling to ensure it fills the container
  iframe.style.width = '100%';
  iframe.style.height = '100%';
  iframe.style.border = 'none';
  iframe.style.display = 'block'; // Removes default inline spacing issues

  // Inject into the page
  pageContent.appendChild(iframe);
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

// NEW: We pass the 'angle' into the component so it knows its position in the orbit
// We can now pass a 'config' object so the math works for any circle size!
export function createStatComponent(svgInnerCode, startingNumber, label = '', angle = 0, config = {}) {
    const wrapper = document.createElement('div');
    wrapper.className = 'stat-node';

    // 1. Pull the radius (Defaults to 45 for your outer rings)
    const r = config.radius || 45;
    const strokeWidth = config.strokeWidth || 1;
    
    // 2. Separate the label font size from the input math!
    const labelFontSize = config.labelFontSize || 13; 
    const textGap = config.textGap || 5; 
    
    const outerEdge = r + (strokeWidth / 2);
    const isBottomHalf = angle > 90 && angle < 270;
    
    const topPathRadius = outerEdge + textGap;
    const bottomPathRadius = outerEdge + textGap + (labelFontSize * 0.85); 
    const pathRadius = isBottomHalf ? bottomPathRadius : topPathRadius;
    
    const startX = 50 - pathRadius;
    const endX = 50 + pathRadius;
    
    const pathData = isBottomHalf 
        ? `M ${startX} 50 A ${pathRadius} ${pathRadius} 0 0 0 ${endX} 50` 
        : `M ${startX} 50 A ${pathRadius} ${pathRadius} 0 0 1 ${endX} 50`;
        
    const textRotation = isBottomHalf ? angle - 180 : angle;
    const pathId = `curve-${label.replace(/\s+/g, '')}`;

    // 3. SVG Layer uses labelFontSize
    const svgLayer = `
        <svg class="node-art" viewBox="-20 -20 140 140" style="overflow: visible;">
            ${svgInnerCode}
            ${label ? `
            <g transform="rotate(${textRotation}, 50, 50)">
                <path id="${pathId}" d="${pathData}" fill="none" />
                <text fill="var(--text-color)" font-size="${labelFontSize}" font-weight="bold" letter-spacing="2">
                    <textPath href="#${pathId}" startOffset="50%" text-anchor="middle">${label}</textPath>
                </text>
            </g>
            ` : ''}
        </svg>
    `;

    // 4. Content Layer uses Proportional Math
    // The viewBox is 140 units. We map the radius (r) to the container width (100cqw).
    // This scales the font size to be exactly proportional to the circle drawn.
    const contentLayer = `
        <div class="node-content">
            <input type="text" class="stat-input" value="${startingNumber}" 
                   style="
                       font-size: calc(${r} / 140 * 100cqw); 
                       width: calc(${r * 1.5} / 140 * 100cqw);
                   " />
        </div>
    `;

    wrapper.innerHTML = svgLayer + contentLayer;
    return wrapper;
}