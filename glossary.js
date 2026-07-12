import { mountResponsiveTextBox } from './celticBox.js';
import { celticTextboxData } from './config.js';

// --- Extracted Helper Functions ---

function calculateVisibility(state, dom) {
    dom.panelsArray.forEach((panel, i) => {
        let worldAngle = (i * state.thetaY + state.horizontalAngle) % 360;
        if (worldAngle < 0) worldAngle += 360;
        
        let diff = Math.min(worldAngle, 360 - worldAngle); 
        const titleEl = panel.querySelector('.panel-title');
        const itemEls = panel.querySelectorAll('.item');

        const panelOpacity = (180 - diff) / 180;
        titleEl.style.opacity = panelOpacity;

        const currentAngle = state.verticalAngles[i];
        const activeItemIndex = Math.round(-currentAngle / state.thetaX);
        const VISIBLE_RANGE = 5;

        itemEls.forEach((item, itemIndex) => {
            const distance = Math.abs(itemIndex - activeItemIndex);

            if (distance > VISIBLE_RANGE) {
                item.style.visibility = 'hidden';
                item.style.opacity = 0;
            } else {
                item.style.visibility = 'visible';
                item.style.opacity = panelOpacity;
            }
        });
    });
}

function updateActiveIndex(state) {
    let normalized = state.horizontalAngle % 360;
    if (normalized < 0) normalized += 360;
    state.activeCategoryIndex = Math.round((360 - normalized) % 360 / state.thetaY) % state.totalCategories;
    return state.activeCategoryIndex;
}

function snapCarousel(state, dom) {
    if (state.dragAxis === 'x' || state.dragAxis === null) {
        const snappedY = Math.round(state.horizontalAngle / state.thetaY) * state.thetaY;
        dom.horizontalCarousel.style.transition = 'transform 0.5s cubic-bezier(0.25, 1.5, 0.5, 1)';
        state.horizontalAngle = snappedY;
        dom.horizontalCarousel.style.transform = `rotateY(${state.horizontalAngle}deg)`;
        updateActiveIndex(state);
    }
    
    if (state.dragAxis === 'y' || state.dragAxis === null) {
        const cyl = dom.verticalCylinders[state.activeCategoryIndex];
        const tX = state.thetaXArray[state.activeCategoryIndex];
        const bounds = state.verticalBounds[state.activeCategoryIndex];
        
        let snappedX = Math.round(state.verticalAngles[state.activeCategoryIndex] / tX) * tX;
        snappedX = Math.max(bounds.min, Math.min(bounds.max, snappedX));
        
        cyl.style.transition = 'transform 0.4s cubic-bezier(0.25, 1.5, 0.5, 1)';
        state.verticalAngles[state.activeCategoryIndex] = snappedX;
        cyl.style.transform = `rotateX(${snappedX}deg)`;
    }
    
    state.dragAxis = null;
    requestAnimationFrame(() => calculateVisibility(state, dom));
}

function handleResize(entries, state, dom) {
    for (let entry of entries) {
        const width = entry.contentRect.width;
        const safeTextWidth = width * 0.85;
        const radiusXCalc = Math.max(60, Math.min(80, width * 0.22));
        
        const radTheta = (state.thetaX / 2) * (Math.PI / 180);
        const itemHeight = 2 * radiusXCalc * Math.tan(radTheta);
        
        const maxFontSizeByWidth = safeTextWidth / (state.maxChars * 0.6);
        const maxFontSizeByHeight = itemHeight * 0.75;
        const finalFontSize = Math.max(12, Math.min(maxFontSizeByWidth, maxFontSizeByHeight));

        dom.masterScene.style.setProperty('--dynamic-font-size', `${finalFontSize}px`);
        dom.masterScene.style.setProperty('--item-height', `${itemHeight}px`);
        dom.masterScene.style.setProperty('--radius-x', `${radiusXCalc}px`);

        const dynamicPanelWidth = width * 0.75; 
        let newRadiusY = Math.round((dynamicPanelWidth / 2) / Math.tan(Math.PI / state.totalCategories));
        newRadiusY = Math.max(newRadiusY, width * 0.4); 

        dom.panelsArray.forEach((panel, index) => {
            panel.style.transform = `rotateY(${index * state.thetaY}deg) translateZ(${newRadiusY}px)`;
        });
        
        requestAnimationFrame(() => calculateVisibility(state, dom));
    }
}

// --- Extracted Event Handlers ---

function handleWheelEvent(e, state, dom) {
    e.preventDefault();
    dom.horizontalCarousel.style.transition = 'none';
    dom.verticalCylinders[state.activeCategoryIndex].style.transition = 'none';

    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        state.horizontalAngle -= e.deltaX * 0.2;
        dom.horizontalCarousel.style.transform = `rotateY(${state.horizontalAngle}deg)`;
        state.dragAxis = 'x';
    } else {
        const bounds = state.verticalBounds[state.activeCategoryIndex];
        let newAngle = state.verticalAngles[state.activeCategoryIndex] - e.deltaY * 0.2;
        state.verticalAngles[state.activeCategoryIndex] = Math.max(bounds.min - 15, Math.min(bounds.max + 15, newAngle));
        dom.verticalCylinders[state.activeCategoryIndex].style.transform = `rotateX(${state.verticalAngles[state.activeCategoryIndex]}deg)`;
        state.dragAxis = 'y';
    }

    calculateVisibility(state, dom);
    clearTimeout(state.scrollTimeout);
    state.scrollTimeout = setTimeout(() => snapCarousel(state, dom), 150);
}

function handleTouchStartEvent(e, state, dom) {
    state.isDragging = true;
    state.hasDragged = false;
    state.startX = e.touches[0].clientX;
    state.startY = e.touches[0].clientY;
    state.dragAxis = null;
    
    dom.horizontalCarousel.style.transition = 'none';
    dom.verticalCylinders[state.activeCategoryIndex].style.transition = 'none';
    clearTimeout(state.scrollTimeout);
}

function handleTouchMoveEvent(e, state, dom) {
    if (!state.isDragging) return;
    
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const deltaX = currentX - state.startX;
    const deltaY = currentY - state.startY;

    if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
        state.hasDragged = true;
    }

    if (!state.dragAxis) {
        if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
            state.dragAxis = Math.abs(deltaX) > Math.abs(deltaY) ? 'x' : 'y';
        } else {
            return; 
        }
    }

    if (state.dragAxis === 'x') {
        state.horizontalAngle += deltaX * 0.5;
        dom.horizontalCarousel.style.transform = `rotateY(${state.horizontalAngle}deg)`;
        state.startX = currentX;
        calculateVisibility(state, dom); 
    } else {
        const bounds = state.verticalBounds[state.activeCategoryIndex];
        let newAngle = state.verticalAngles[state.activeCategoryIndex] - deltaY * 0.5;
        state.verticalAngles[state.activeCategoryIndex] = Math.max(bounds.min - 15, Math.min(bounds.max + 15, newAngle));
        dom.verticalCylinders[state.activeCategoryIndex].style.transform = `rotateX(${state.verticalAngles[state.activeCategoryIndex]}deg)`;
        state.startY = currentY;
        calculateVisibility(state, dom);
    }
}

function handleTouchEndEvent(state, dom) {
    if (!state.isDragging) return;
    state.isDragging = false;
    snapCarousel(state, dom); 
}

function handleItemClick(i, index, itemText, state) {
    if (state.hasDragged) return; 

    if (state.activeCategoryIndex === index) {
        const currentAngle = state.verticalAngles[index];
        const activeItemIndex = Math.round(-currentAngle / state.thetaX);
        
        if (i === activeItemIndex) {
            console.log(`Active item clicked: ${itemText}`);
        }
    }
}

// --- Main Render Function ---

export function renderGlossaryPage(container) {
    container.innerHTML = '';
    
    // --- Data Setup ---
    const PADDING_COUNT = 5;
    const rawGlossaryData = [
        { title: 'Characters', items: ['Aria', 'Balthazar', 'Caelum', 'Darius', 'Elora', 'Faelan', 'Garrick', 'Hanna', 'Ignis', 'Jorun', 'Kael'] },
        { title: 'Locations', items: ['The Citadel', 'Whispering Woods', 'Sunken City', 'Dragon Peaks', 'Iron Keep', 'Shadow Rift'] },
        { title: 'Artifacts', items: ['Amulet of Time', 'Soul Blade', 'Ember Stone', 'Void Chalice', 'Sunken Crown', 'Crystal Tear', 'Moon Ring', 'Star Map', 'Amulet of Time', 'Soul Blade', 'Ember Stone', 'Void Chalice', 'Sunken Crown', 'Crystal Tear', 'Moon Ring', 'Star Map'] },
        { title: 'Factions', items: ['The Order', 'Crimson Hand', 'Silver Vanguard', 'Night Walkers', 'Sun Cult'] }
    ];

    const maxChars = Math.max(...rawGlossaryData.flatMap(d => d.items.map(text => text.length)));
    const glossaryData = rawGlossaryData.map(data => {
        const pad = Array(PADDING_COUNT).fill('');
        return {
            title: data.title,
            originalItems: data.items,
            items: [...pad, ...data.items, ...pad] 
        };
    });

    // --- State Object ---
    const state = {
        horizontalAngle: 0,
        activeCategoryIndex: 0,
        isDragging: false,
        hasDragged: false,
        startX: 0,
        startY: 0,
        dragAxis: null,
        scrollTimeout: null,
        totalCategories: glossaryData.length,
        thetaY: 360 / glossaryData.length,
        thetaX: 24,
        maxChars: maxChars,
        verticalAngles: glossaryData.map(() => -(PADDING_COUNT * 24)),
        verticalBounds: [],
        thetaXArray: []
    };

    // --- DOM Object ---
    const dom = {
        masterScene: document.createElement('div'),
        horizontalCarousel: document.createElement('div'),
        panelsArray: [],
        verticalCylinders: []
    };

    const glossaryContent = document.createElement('div');
    glossaryContent.className = 'glossary-content';
    dom.masterScene.className = 'master-scene';
    dom.horizontalCarousel.className = 'horizontal-carousel';

    // --- DOM Construction ---
    glossaryData.forEach((data, index) => {
        const panel = document.createElement('div');
        panel.className = 'carousel-panel';

        const title = document.createElement('div');
        title.className = 'panel-title';
        title.textContent = data.title;
        panel.appendChild(title);

        const cylinder = document.createElement('div');
        cylinder.className = 'cylinder';

        state.thetaXArray.push(state.thetaX);

        const startBound = -(PADDING_COUNT * state.thetaX);
        const endBound = -((PADDING_COUNT + data.originalItems.length - 1) * state.thetaX);
        state.verticalBounds.push({ max: startBound, min: endBound });

        data.items.forEach((itemText, i) => {
            const itemEl = document.createElement('div');
            itemEl.className = 'item';
            itemEl.textContent = itemText;
            
            itemEl.style.fontSize = 'var(--dynamic-font-size)';
            itemEl.style.height = 'var(--item-height)';
            itemEl.style.position = 'absolute';
            itemEl.style.top = '50%';
            itemEl.style.left = '0';
            itemEl.style.width = '100%';
            itemEl.style.marginTop = 'calc(var(--item-height) / -2)';
            itemEl.style.boxSizing = 'border-box';
            itemEl.style.backfaceVisibility = 'hidden';
            itemEl.style.transform = `rotateX(${i * state.thetaX}deg) translateZ(var(--radius-x))`;
            
            itemEl.addEventListener('click', () => handleItemClick(i, index, itemText, state));
            
            cylinder.appendChild(itemEl);
        });

        cylinder.style.transform = `rotateX(${state.verticalAngles[index]}deg)`;
        panel.appendChild(cylinder);
        dom.horizontalCarousel.appendChild(panel);
        
        dom.verticalCylinders.push(cylinder);
        dom.panelsArray.push(panel);
    });

    dom.masterScene.appendChild(dom.horizontalCarousel);
    glossaryContent.appendChild(dom.masterScene);

    const bottomDiv = document.createElement('div');
    bottomDiv.className = 'panel-bottom';
    const testText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...';
    mountResponsiveTextBox(celticTextboxData, bottomDiv, testText);
    glossaryContent.appendChild(bottomDiv);

    container.appendChild(glossaryContent);

    // --- Initialization & Observers ---
    calculateVisibility(state, dom);

    const resizeObserver = new ResizeObserver((entries) => handleResize(entries, state, dom));
    resizeObserver.observe(container);

    // --- Event Listeners (Bound with State/DOM) ---
    const onWheel = (e) => handleWheelEvent(e, state, dom);
    const onTouchStart = (e) => handleTouchStartEvent(e, state, dom);
    const onTouchMove = (e) => handleTouchMoveEvent(e, state, dom);
    const onTouchEnd = () => handleTouchEndEvent(state, dom);

    dom.masterScene.addEventListener('wheel', onWheel, { passive: false });
    dom.masterScene.addEventListener('touchstart', onTouchStart, { passive: false });
    dom.masterScene.addEventListener('touchmove', onTouchMove, { passive: false });
    dom.masterScene.addEventListener('touchend', onTouchEnd);

    // --- Cleanup Return ---
    return function destroyGlossaryPage() {
        resizeObserver.disconnect();
        
        dom.masterScene.removeEventListener('wheel', onWheel);
        dom.masterScene.removeEventListener('touchstart', onTouchStart);
        dom.masterScene.removeEventListener('touchmove', onTouchMove);
        dom.masterScene.removeEventListener('touchend', onTouchEnd);
        
        clearTimeout(state.scrollTimeout);
        container.innerHTML = '';
    };
}