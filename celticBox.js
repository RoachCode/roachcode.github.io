// --- SHARED HELPER FUNCTIONS ---

// Creates double lines using anchor points
function createDoubleLine(start, center, end, options) {
    const dString = `M ${start.x} ${start.y} Q ${center.x} ${center.y} ${end.x} ${end.y}`;

    const baseLine = document.createElementNS(options.svgNS, "path");
    baseLine.setAttribute("d", dString);
    baseLine.classList.add("path-base");
    baseLine.style.stroke = options.color.pathColor;
    baseLine.setAttribute("stroke-width", options.dimensions.totalLineWidth);
    
    const eraserLine = document.createElementNS(options.svgNS, "path");
    eraserLine.setAttribute("d", dString);
    eraserLine.classList.add("path-eraser");
    eraserLine.style.stroke = options.color.eraserColor;
    eraserLine.setAttribute("stroke-width", options.dimensions.lineGapWidth);

    const group = document.createElementNS(options.svgNS, "g");  
    group.appendChild(baseLine);
    group.appendChild(eraserLine);
    return group;
}

// Generates the base templates for the hexagon polygon and internal paths
function createHexTemplates(options) {
    const hexBorder = document.createElementNS(options.svgNS, "polygon");
    const completeHex = document.createElementNS(options.svgNS, "g");

    const points = [
        `-${options.dimensions.radius/2},-${options.dimensions.height/2}`, `${options.dimensions.radius/2},-${options.dimensions.height/2}`, `${options.dimensions.radius},0`,
        `${options.dimensions.radius/2},${options.dimensions.height/2}`, `-${options.dimensions.radius/2},${options.dimensions.height/2}`, `-${options.dimensions.radius},0`
    ].join(" ");

    hexBorder.setAttribute("points", points);
    hexBorder.classList.add("hex-border");
    hexBorder.style.fill = options.color.bgColor;
    hexBorder.style.stroke = options.color.hexColor;
    hexBorder.setAttribute("stroke-width", options.dimensions.hexStrokeWidth);

    const eX = options.dimensions.radius * 0.75;
    const eY = options.dimensions.height / 4;
    const topY = options.dimensions.height / 2;
    const center = { x: 0, y: 0 };  

    const topMiddle = { x: 0, y: -topY };
    const topLeft = { x: -eX, y: -eY };
    const topRight = { x: eX, y: -eY };
    const bottomLeft = { x: -eX, y: eY };
    const bottomRight = { x: eX, y: eY };
    const bottomMiddle = { x: 0, y: topY };

    completeHex.appendChild(createDoubleLine(topMiddle, center, bottomRight, options));
    completeHex.appendChild(createDoubleLine(topLeft, center, bottomLeft, options)); 
    completeHex.appendChild(createDoubleLine(topRight, center, bottomMiddle, options));

    return { hexBorder, completeHex };
}

// Clones, rotates, and appends a hexagon to the SVG layers
function placeHexagon(x, y, elements) {
    const rotation = Math.floor(Math.random() * 6) * 60;
    const transformString = `translate(${x}, ${y}) rotate(${rotation})`;
    
    const hexBgInstance = elements.hexBorder.cloneNode(true);
    hexBgInstance.setAttribute("transform", transformString);
    elements.bgLayer.appendChild(hexBgInstance);
    
    const hexPathInstance = elements.completeHex.cloneNode(true);
    hexPathInstance.setAttribute("transform", transformString);
    elements.pathLayer.appendChild(hexPathInstance);
}

// Generates the solid background rectangle for border mode
function createInteriorRect(options, startX, startY, borderX, borderY) {
    const bgRect = document.createElementNS(options.svgNS, "rect");
    
    const rectWidth = (borderX - 1) * (options.dimensions.radius * 1.5);
    const rectHeight = (borderY - 1) * options.dimensions.height + (options.dimensions.height / 2);

    bgRect.setAttribute("x", startX);
    bgRect.setAttribute("y", startY);
    bgRect.setAttribute("width", rectWidth);
    bgRect.setAttribute("height", rectHeight);
    
    bgRect.style.fill = options.color.bgColor;
    //bgRect.style.stroke = options.color.bgColor;
    //bgRect.setAttribute("stroke-width", options.dimensions.hexStrokeWidth);

    return bgRect;
}

// Determines if a specific grid coordinate is on the outer edge
function isPerimeterHex(col, row, maxCols, maxRows) {
    return col === 0 || col === maxCols - 1 || row === 0 || row === maxRows - 1;
}

// --- MAIN EXPORT: TEXT BOX MODE ---
export function createHexTextBox(options = {}, ele, textContent = "") {
    const container = document.createElement("div");
    container.classList.add("textbox-wrapper");
    
    // --- 1. HORIZONTAL MATH: Perfect Width Scaling ---
    const targetHexWidth = options.dimensions.hexWidth;
    const targetRadius = options.dimensions.radius;
    
    // Estimate how many columns fit based on original options
    let borderX = Math.round((ele.clientWidth - targetHexWidth) / (targetRadius * 1.5)) + 1;
    borderX = Math.max(1, borderX);
    if (borderX % 2 === 0 && borderX > 1) borderX -= 1; // Keep symmetrical
    
    // REVERSE MATH: Find exact hex width so the grid matches clientWidth perfectly
    // Equation derived from: clientWidth = (borderX - 1) * (newHexWidth * 0.75) + newHexWidth
    const newHexWidth = ele.clientWidth / (0.75 * borderX + 0.25);
    const scaleFactor = newHexWidth / targetHexWidth;

    // Create a localized copy of options so we don't permanently alter the global config
    const scaledOptions = {
        ...options,
        dimensions: {
            hexWidth: newHexWidth,
            totalLineWidth: options.dimensions.totalLineWidth * scaleFactor,
            lineGapWidth: options.dimensions.lineGapWidth * scaleFactor,
            hexStrokeWidth: options.dimensions.hexStrokeWidth * scaleFactor,
            radius: newHexWidth / 2,
            height: newHexWidth * (Math.sqrt(3) / 2)
        }
    };

    // --- 2. VERTICAL MATH: Standard Fit ---
    let borderY = Math.round((ele.clientHeight - (scaledOptions.dimensions.height * 2)) / scaledOptions.dimensions.height) + 1;
    borderY = Math.max(1, borderY);

    // finalBoxWidth is now mathematically identical to ele.clientWidth
    const finalBoxWidth = ele.clientWidth; 
    const finalBoxHeight = (borderY - 1) * scaledOptions.dimensions.height + (scaledOptions.dimensions.height * 2);

    // --- 3. SVG & CONTAINER SETUP (Rubber Band Mode) ---
    const tiledSvgBox = document.createElementNS(scaledOptions.svgNS, "svg");
    const bgLayer = document.createElementNS(scaledOptions.svgNS, "g");
    const pathLayer = document.createElementNS(scaledOptions.svgNS, "g");

    tiledSvgBox.classList.add("hex-background"); 
    tiledSvgBox.appendChild(bgLayer);
    tiledSvgBox.appendChild(pathLayer);

    // Tell wrapper to fill parent exactly
    container.style.width = "100%";
    container.style.height = "100%";
    
    // Tell SVG to stretch its internal coordinates to fit the wrapper
    tiledSvgBox.setAttribute("width", "100%");
    tiledSvgBox.setAttribute("height", "100%");
    tiledSvgBox.setAttribute("viewBox", `0 0 ${finalBoxWidth} ${finalBoxHeight}`);
    tiledSvgBox.setAttribute("preserveAspectRatio", "none"); // Allows the Y-axis to squash

    // --- 4. CONTENT HTML SETUP ---
    // We must squash the Y-padding by the same ratio the background squashed, 
    // ensuring the text box perfectly avoids the border no matter what.
    const squashRatioY = ele.clientHeight / finalBoxHeight;
    const actualPaddingX = scaledOptions.dimensions.hexWidth * 1.2; 
    const actualPaddingY = (scaledOptions.dimensions.height * 1.65) * squashRatioY;
    
    const contentDiv = document.createElement("div");
    contentDiv.classList.add("hex-box-content");
    contentDiv.style.borderColor = scaledOptions.color.pathColor;
    
    // Use CSS calc to handle padding dynamically
    contentDiv.style.width = `calc(100% - ${actualPaddingX * 2}px)`;
    contentDiv.style.height = `calc(100% - ${actualPaddingY * 2}px)`;
    contentDiv.style.color = scaledOptions.color.contentColor || "var(--text-color)"; 
    contentDiv.innerHTML = textContent;

    // --- 5. DRAW ELEMENTS ---
    // Use our new scaledOptions for all templates and rendering
    const { hexBorder, completeHex } = createHexTemplates(scaledOptions);
    const svgElements = { bgLayer, pathLayer, hexBorder, completeHex };

    const startX = scaledOptions.dimensions.radius;
    const startY = scaledOptions.dimensions.height / 2;

    // Interior solid rect
    bgLayer.appendChild(createInteriorRect(scaledOptions, startX, startY, borderX, borderY));

    let col = 0;

    for (let x = startX; col < borderX; x += scaledOptions.dimensions.radius * 1.5) {
        
        const isEvenCol = (col % 2 === 0);
        const yOffset = isEvenCol ? scaledOptions.dimensions.height / 2 : 0;
        const currentMaxRows = isEvenCol ? borderY : borderY + 1;
        
        let row = 0;
        
        for (let y = startY + yOffset; row < currentMaxRows; y += scaledOptions.dimensions.height) {
            
            // Only draw if on the perimeter
            if (isPerimeterHex(col, row, borderX, currentMaxRows)) {
                placeHexagon(x, y, svgElements);
            }
            row++;
        }
        col++;
    }

    container.appendChild(contentDiv);
    container.appendChild(tiledSvgBox);
    ele.appendChild(container);
}
export function mountResponsiveTextBox(options, container, textContent = "") {
    let resizeTimer;
    
    const observer = new ResizeObserver(() => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            // 1. Wipe the old text box
            container.replaceChildren(); 
            
            // 2. Draw the new one with the exact same text
            createHexTextBox(options, container, textContent);
        }, 50); // Text boxes are smaller, so we can redraw a bit faster
    });

    observer.observe(container);
    return observer;
}

// --- MAIN EXPORT: BACKGROUND MODE ---
export function createHexBackground(options = {}, ele) {
    const tiledSvgBox = document.createElementNS(options.svgNS, "svg");
    const bgLayer = document.createElementNS(options.svgNS, "g");
    const pathLayer = document.createElementNS(options.svgNS, "g");

    tiledSvgBox.classList.add("hex-background", "page-background");
    tiledSvgBox.setAttribute("width", ele.clientWidth);
    tiledSvgBox.setAttribute("height", ele.clientHeight);
    tiledSvgBox.style.border = "none";
    tiledSvgBox.appendChild(bgLayer);
    tiledSvgBox.appendChild(pathLayer);

    const { hexBorder, completeHex } = createHexTemplates(options);
    const svgElements = { bgLayer, pathLayer, hexBorder, completeHex };

    const startX = options.dimensions.radius;
    const startY = options.dimensions.height / 2;
    
    // Background Bleeds
    const leftBleedCols = 2;
    const rightBleedBuffer = options.dimensions.hexWidth * 2;
    const bottomBleedBuffer = options.dimensions.height * 2;
    const bgTopBleed = -options.dimensions.height;

    let col = -leftBleedCols;

    for (let x = startX - (leftBleedCols * options.dimensions.radius * 1.5); x <= ele.clientWidth + options.dimensions.hexWidth + rightBleedBuffer; x += options.dimensions.radius * 1.5) {
        
        const isEvenCol = (col % 2 === 0);
        const yOffset = isEvenCol ? options.dimensions.height / 2 : 0;
        
        for (let y = startY + yOffset + bgTopBleed; y <= ele.clientHeight + options.dimensions.height + bottomBleedBuffer; y += options.dimensions.height) {
            // Unconditional rendering for backgrounds
            placeHexagon(x, y, svgElements);
        }
        col++;
    }

    ele.appendChild(tiledSvgBox);
}
export function mountResponsiveBackground(options, container) {
    let resizeTimer;
    
    const observer = new ResizeObserver(() => {
        // Debounce: wait 100ms after the resizing stops before drawing
        // This prevents massive lag from redrawing hundreds of SVGs instantly
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            // 1. Wipe the old background
            container.replaceChildren(); 
            
            // 2. Draw the new one
            createHexBackground(options, container);
        }, 100); 
    });

    // Start watching the container
    observer.observe(container);
    
    // Return the observer in case you need to disconnect it later
    return observer;
}

