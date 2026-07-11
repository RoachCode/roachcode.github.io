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

        // 1. Intercept and kill the native auto-scroll icon immediately
        container.addEventListener('mousedown', (e) => {
            if (e.button === 1) { 
                e.preventDefault(); 
            }
        });

        // 2. Handle the actual map reset via auxclick
        container.addEventListener('auxclick', (e) => {
            if (e.button === 1) {
                e.preventDefault();
                
                // Reset the scale to 1 (100%)
                mapController.zoomAbs(0, 0, 1); 
                
                // Move the SVG back to its original origin
                mapController.moveTo(0, 0); 
            }
        });
        } catch (error) {
            console.error("Failed to attach map:", error);
        }
}

export function renderBattlePage(container) {
    // 1. Create the fallback screen
    const fallbackScreen = document.createElement('div');
    fallbackScreen.id = 'battle-fallback';
    
    // Styling the fallback to match a dark, seamless UI
    fallbackScreen.style.cssText = `
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        background-color: #16161d;
        color: var(--text-color);
    `;
    // You can replace this innerHTML with your own SVG design later
    fallbackScreen.innerHTML = `<h3>Awaiting Stream...</h3>`;

    // 2. Create the iframe
    const iframe = document.createElement('iframe');
    iframe.id = 'battle-iframe';
    iframe.src = 'https://vdo.ninja/?meshcast&view=b37ce914b7f9248bba9f2367790c42e25a109d5b19b295659d61bab06b51491e&autoplay&api=The_Ruby_Heart';
    iframe.title = 'Battle Map Stream';
    iframe.allow = 'autoplay; fullscreen;';
    iframe.allowFullscreen = true;
    
    // Initial State: Hide the iframe, show the fallback
    iframe.style.display = 'none';

    // 3. Handle VDO.Ninja Messages
    const handleStreamMessage = (event) => {
        if (event.origin !== 'https://vdo.ninja') return;

        const data = event.data;

        if (data && data.action) {
            console.log("VDO.Ninja Event:", data.action);

            if (data.action === 'new-stream-added') {
                // The stream is live! 
                iframe.style.display = 'block';
                fallbackScreen.style.display = 'none';
            } 
            else if (data.action === 'end-view-connection') {
                // The connection dropped or stopped
                iframe.style.display = 'none';
                fallbackScreen.style.display = 'flex'; 
            }
        }
    };
    window.addEventListener('message', handleStreamMessage);
    // 4. Inject into the page
    // Prefer the passed container, fallback to grabbing by ID
    const pageContent = document.getElementById('page-content');
    
    // Clear out existing content if this page is being re-rendered
    pageContent.innerHTML = ''; 
    
    pageContent.appendChild(fallbackScreen);
    pageContent.appendChild(iframe);

    return function destroyBattlePage() {
        // Remove the event listener from the window
        window.removeEventListener('message', handleStreamMessage);
        
        // Optional but recommended: sever the iframe's source to kill the WebRTC polling
        iframe.src = '';
        
        // Clear the container
        pageContent.innerHTML = '';
    };
}

export function renderGlossaryPage(container) {
  container.innerHTML = '';

  const glossaryData = [
    { items: ['Aria', 'Balthazar', 'Caelum', 'Darius', 'Elora', 'Faelan', 'Garrick', 'Hanna', 'Ignis', 'Jorun', 'Kael'] },
    { items: ['The Citadel', 'Whispering Woods', 'Sunken City', 'Dragon Peaks', 'Iron Keep', 'Shadow Rift'] },
    { items: ['Amulet of Time', 'Soul Blade', 'Ember Stone', 'Void Chalice', 'Sunken Crown', 'Crystal Tear', 'Moon Ring', 'Star Map'] },
    { items: ['The Order', 'Crimson Hand', 'Silver Vanguard', 'Night Walkers', 'Sun Cult'] }
  ];

  // --- HTML Construction ---
  const masterScene = document.createElement('div');
  masterScene.className = 'master-scene';

  const horizontalCarousel = document.createElement('div');
  horizontalCarousel.className = 'horizontal-carousel';

  const totalCategories = glossaryData.length;
  const thetaY = 360 / totalCategories;
  
  // Calculate horizontal radius so cylinders space out into a proper wheel
  const panelWidth = 250; 
  let radiusY = Math.round((panelWidth / 2) / Math.tan(Math.PI / totalCategories));
  
  // Ensure a minimum horizontal radius so they don't clip into each other
  radiusY = Math.max(radiusY, 200);

  const verticalCylinders = [];
  const verticalAngles = glossaryData.map(() => 0);
  const thetaXArray = [];

  glossaryData.forEach((data, index) => {
    const panel = document.createElement('div');
    panel.className = 'carousel-panel';
    panel.style.transform = `rotateY(${index * thetaY}deg) translateZ(${radiusY}px)`;

    const cylinder = document.createElement('div');
    cylinder.className = 'cylinder';

    const totalItems = data.items.length;
    const thetaX = 360 / totalItems;
    thetaXArray.push(thetaX);
    
    // Dynamic vertical radius based on item count
    const itemHeight = 50; 
    const radiusX = Math.round((itemHeight / 2) / Math.tan(Math.PI / totalItems));

    data.items.forEach((itemText, i) => {
      const itemEl = document.createElement('div');
      itemEl.className = 'item';
      itemEl.textContent = itemText;
      itemEl.style.transform = `rotateX(${i * thetaX}deg) translateZ(${radiusX}px)`;
      cylinder.appendChild(itemEl);
    });

    panel.appendChild(cylinder);
    horizontalCarousel.appendChild(panel);
    verticalCylinders.push(cylinder);
  });

  masterScene.appendChild(horizontalCarousel);
  container.appendChild(masterScene);

  // --- Centralized Touch & Scroll Logic ---
  let horizontalAngle = 0;
  let activeCategoryIndex = 0;
  
  let isDragging = false;
  let startX = 0;
  let startY = 0;
  let dragAxis = null; 
  let scrollTimeout;

  function updateActiveIndex(angleY) {
    let normalized = angleY % 360;
    if (normalized < 0) normalized += 360;
    activeCategoryIndex = Math.round((360 - normalized) % 360 / thetaY) % totalCategories;
  }

  function snap() {
    if (dragAxis === 'x' || dragAxis === null) {
      const snappedY = Math.round(horizontalAngle / thetaY) * thetaY;
      horizontalCarousel.style.transition = 'transform 0.5s cubic-bezier(0.25, 1.5, 0.5, 1)';
      horizontalAngle = snappedY;
      horizontalCarousel.style.transform = `rotateY(${horizontalAngle}deg)`;
      updateActiveIndex(horizontalAngle);
    }
    
    if (dragAxis === 'y' || dragAxis === null) {
      const cyl = verticalCylinders[activeCategoryIndex];
      const tX = thetaXArray[activeCategoryIndex];
      const snappedX = Math.round(verticalAngles[activeCategoryIndex] / tX) * tX;
      
      cyl.style.transition = 'transform 0.4s cubic-bezier(0.25, 1.5, 0.5, 1)';
      verticalAngles[activeCategoryIndex] = snappedX;
      cyl.style.transform = `rotateX(${snappedX}deg)`;
    }
    dragAxis = null;
  }

  // Desktop Wheel
  masterScene.addEventListener('wheel', (e) => {
    e.preventDefault();
    horizontalCarousel.style.transition = 'none';
    verticalCylinders[activeCategoryIndex].style.transition = 'none';

    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
      horizontalAngle -= e.deltaX * 0.2;
      horizontalCarousel.style.transform = `rotateY(${horizontalAngle}deg)`;
      dragAxis = 'x';
    } else {
      verticalAngles[activeCategoryIndex] -= e.deltaY * 0.2;
      verticalCylinders[activeCategoryIndex].style.transform = `rotateX(${verticalAngles[activeCategoryIndex]}deg)`;
      dragAxis = 'y';
    }

    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(snap, 150);
  }, { passive: false });

  // Mobile Touch
  masterScene.addEventListener('touchstart', (e) => {
    isDragging = true;
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    dragAxis = null;
    
    horizontalCarousel.style.transition = 'none';
    verticalCylinders[activeCategoryIndex].style.transition = 'none';
    clearTimeout(scrollTimeout);
  }, { passive: false });

  masterScene.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const deltaX = currentX - startX;
    const deltaY = currentY - startY;

    if (!dragAxis) {
      if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
        dragAxis = Math.abs(deltaX) > Math.abs(deltaY) ? 'x' : 'y';
      } else {
        return; 
      }
    }

    if (dragAxis === 'x') {
      horizontalAngle += deltaX * 0.5;
      horizontalCarousel.style.transform = `rotateY(${horizontalAngle}deg)`;
      startX = currentX;
    } else {
      verticalAngles[activeCategoryIndex] += deltaY * 0.5;
      verticalCylinders[activeCategoryIndex].style.transform = `rotateX(${verticalAngles[activeCategoryIndex]}deg)`;
      startY = currentY;
    }
  }, { passive: false });

  masterScene.addEventListener('touchend', () => {
    if (!isDragging) return;
    isDragging = false;
    snap(); 
  });
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