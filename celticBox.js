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


// --- MAIN EXPORT: BACKGROUND MODE ---

export function createHexBackground(options = {}, ele) {
    const tiledSvgBox = document.createElementNS(options.svgNS, "svg");
    const bgLayer = document.createElementNS(options.svgNS, "g");
    const pathLayer = document.createElementNS(options.svgNS, "g");

    tiledSvgBox.classList.add("hex-background", "page-background");
    tiledSvgBox.setAttribute("width", options.size.x);
    tiledSvgBox.setAttribute("height", options.size.y);
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

    for (let x = startX - (leftBleedCols * options.dimensions.radius * 1.5); x <= options.size.x + options.dimensions.hexWidth + rightBleedBuffer; x += options.dimensions.radius * 1.5) {
        
        const isEvenCol = (col % 2 === 0);
        const yOffset = isEvenCol ? options.dimensions.height / 2 : 0;
        
        for (let y = startY + yOffset + bgTopBleed; y <= options.size.y + options.dimensions.height + bottomBleedBuffer; y += options.dimensions.height) {
            // Unconditional rendering for backgrounds
            placeHexagon(x, y, svgElements);
        }
        col++;
    }

    ele.appendChild(tiledSvgBox);
}


// --- MAIN EXPORT: TEXT BOX MODE ---

export function createHexTextBox(options = {}, ele, textContent = "") {
    const container = document.createElement("div");
    container.classList.add("textbox-wrapper");
    
    const tiledSvgBox = document.createElementNS(options.svgNS, "svg");
    const bgLayer = document.createElementNS(options.svgNS, "g");
    const pathLayer = document.createElementNS(options.svgNS, "g");

    tiledSvgBox.classList.add("hex-background"); 
    tiledSvgBox.appendChild(bgLayer);
    tiledSvgBox.appendChild(pathLayer);

    // Calculate Grid Bounds
    let borderX = Math.round((options.size.x - options.dimensions.hexWidth) / (options.dimensions.radius * 1.5)) + 1;
    let borderY = Math.round((options.size.y - (options.dimensions.height * 2)) / options.dimensions.height) + 1;

    borderX = Math.max(1, borderX);
    borderY = Math.max(1, borderY);
    if (borderX % 2 === 0 && borderX > 1) borderX -= 1; 

    const finalBoxWidth = (borderX - 1) * (options.dimensions.radius * 1.5) + options.dimensions.hexWidth;
    const finalBoxHeight = (borderY - 1) * options.dimensions.height + (options.dimensions.height * 2);

    // Container & SVG Sizing
    container.style.width = finalBoxWidth + "px";
    container.style.height = finalBoxHeight + "px";
    tiledSvgBox.setAttribute("width", finalBoxWidth);
    tiledSvgBox.setAttribute("height", finalBoxHeight);

    // Setup Content HTML
    const innerPaddingX = options.dimensions.hexWidth * 1.2; 
    const innerPaddingY = options.dimensions.height * 1.65;
    
    const contentDiv = document.createElement("div");
    contentDiv.classList.add("hex-box-content");
    contentDiv.style.borderColor = options.color.pathColor;
    contentDiv.style.width = (finalBoxWidth - (innerPaddingX * 2)) + "px";
    contentDiv.style.height = (finalBoxHeight - (innerPaddingY * 2)) + "px";
    contentDiv.style.color = options.color.contentColor || "var(--text-color)"; 
    contentDiv.innerHTML = textContent;

    // Draw Elements
    const { hexBorder, completeHex } = createHexTemplates(options);
    const svgElements = { bgLayer, pathLayer, hexBorder, completeHex };

    const startX = options.dimensions.radius;
    const startY = options.dimensions.height / 2;

    // Interior solid rect
    bgLayer.appendChild(createInteriorRect(options, startX, startY, borderX, borderY));

    let col = 0;

    for (let x = startX; col < borderX; x += options.dimensions.radius * 1.5) {
        
        const isEvenCol = (col % 2 === 0);
        const yOffset = isEvenCol ? options.dimensions.height / 2 : 0;
        const currentMaxRows = isEvenCol ? borderY : borderY + 1;
        
        let row = 0;
        
        for (let y = startY + yOffset; row < currentMaxRows; y += options.dimensions.height) {
            
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