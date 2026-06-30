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




export function createCelticBox(options = {}, ele) {

    // Create svg layers
    const container = document.createElement("div");
    container.classList.add("textbox-wrapper");
    const tiledSvgBox = document.createElementNS(options.svgNS, "svg");
    const bgLayer = document.createElementNS(options.svgNS, "g");
    const pathLayer = document.createElementNS(options.svgNS, "g");
    const completeHex = document.createElementNS(options.svgNS, "g");
    const hexBorder = document.createElementNS(options.svgNS, "polygon");

    // Check for border mode
    const isBorder = !!options.border;
    let finalBoxWidth = options.size.x;
    let finalBoxHeight = options.size.y;

    // To prevent clipping, offset the start of the grid by half a hex
    const startX = options.dimensions.radius;
    const startY = options.dimensions.height / 2;

    if (isBorder) {
        // Reverse-engineer the hexagon count based on the requested size
        let borderX = Math.round((options.size.x - options.dimensions.hexWidth) / (options.dimensions.radius * 1.5)) + 1;
        let borderY = Math.round((options.size.y - (options.dimensions.height * 2)) / options.dimensions.height) + 1;

        // Ensure we have at least 1 hexagon in both directions
        borderX = Math.max(1, borderX);
        borderY = Math.max(1, borderY);

        // Enforce your rule about odd numbers of hexagons for the X axis
        if (borderX % 2 === 0 && borderX > 1) { 
            borderX -= 1; 
        }

        options.border = {
            x: borderX,
            y: borderY
        };

        // Exactly calculate SVG dimensions to perfectly wrap the newly calculated border grid
        finalBoxWidth = (borderX - 1) * (options.dimensions.radius * 1.5) + options.dimensions.hexWidth;
        finalBoxHeight = (borderY - 1) * options.dimensions.height + (options.dimensions.height * 2);
        console.log("finalBoxWidth: " + finalBoxWidth);
        console.log("finalBoxHeight: " + finalBoxHeight);

        const contentDiv = document.createElement("div");
        contentDiv.classList.add("hex-box-content");
        contentDiv.style.borderColor = options.color.pathColor;

        // These paddings clear the inner vertices of the border hexes plus a comfort buffer
        const innerPaddingX = options.dimensions.hexWidth * 1.2; 
        const innerPaddingY = options.dimensions.height * 1.65;

        // Match the absolute positioning grid of the SVG box
        //contentDiv.style.left = (innerPaddingX) + "px";
        //contentDiv.style.top = (innerPaddingY) + "px";
        contentDiv.style.width = (finalBoxWidth - (innerPaddingX * 2)) + "px";
        contentDiv.style.height = (finalBoxHeight - (innerPaddingY * 2)) + "px";
        contentDiv.style.color = options.color.contentColor || "#fff"; 
        contentDiv.innerText =
        ` Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...
        `;

        container.style.width = finalBoxWidth + "px";
        container.style.height = finalBoxHeight + "px";
        container.appendChild(contentDiv);

    }
    else {
        tiledSvgBox.classList.add("page-background");
    }

    // Style and append
    tiledSvgBox.classList.add("hex-background"); 
    tiledSvgBox.setAttribute("width", finalBoxWidth);
    tiledSvgBox.setAttribute("height", finalBoxHeight);

    tiledSvgBox.appendChild(bgLayer);
    tiledSvgBox.appendChild(pathLayer);
    if (!isBorder) { tiledSvgBox.style.border = "none"; }

    // Draw hex border
    const points = [
        `-${options.dimensions.radius/2},-${options.dimensions.height/2}`, `${options.dimensions.radius/2},-${options.dimensions.height/2}`, `${options.dimensions.radius},0`,
        `${options.dimensions.radius/2},${options.dimensions.height/2}`, `-${options.dimensions.radius/2},${options.dimensions.height/2}`, `-${options.dimensions.radius},0`
    ].join(" ");

    hexBorder.setAttribute("points", points);
    hexBorder.classList.add("hex-border");
    hexBorder.style.fill = options.color.bgColor;
    hexBorder.style.stroke = options.color.hexColor;
    hexBorder.setAttribute("stroke-width", options.dimensions.hexStrokeWidth);

    // Define the key anchor points
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



    // Draw celtic knot pattern
    completeHex.appendChild(createDoubleLine(topMiddle, center, bottomRight, options));
    completeHex.appendChild(createDoubleLine(topLeft, center, bottomLeft, options)); 
    completeHex.appendChild(createDoubleLine(topRight, center, bottomMiddle, options));
// Generate the grid over bounding area OR as a hollow border
    
    if (isBorder) {
        bgLayer.appendChild(createInteriorRect(options, startX, startY));
    }

    // --- Grid Setup & Bleed Calculations ---
    const leftBleedCols = !isBorder ? 2 : 0;
    const rightBleedBuffer = !isBorder ? options.dimensions.hexWidth * 2 : 0;
    const bottomBleedBuffer = !isBorder ? options.dimensions.height * 2 : 0;
    const bgTopBleed = !isBorder ? -options.dimensions.height : 0;
    
    const maxCols = isBorder ? options.border.x : Infinity;
    const baseRows = isBorder ? options.border.y : Infinity;

    // Package DOM elements to pass into the helper cleanly
    const svgElements = { bgLayer, pathLayer, hexBorder, completeHex };

    let col = -leftBleedCols;

    // --- Main Draw Loop ---
    for (let x = startX - (leftBleedCols * options.dimensions.radius * 1.5); ; x += options.dimensions.radius * 1.5) {
        if (isBorder && col >= maxCols) break;
        if (!isBorder && (x - startX) > options.size.x + options.dimensions.hexWidth + rightBleedBuffer) break;

        const isEvenCol = (col % 2 === 0);
        const yOffset = isEvenCol ? options.dimensions.height / 2 : 0;
        const currentMaxRows = isBorder ? (isEvenCol ? baseRows : baseRows + 1) : Infinity;
        
        let row = 0;
        
        for (let y = startY + yOffset + bgTopBleed; ; y += options.dimensions.height) {
            if (isBorder && row >= currentMaxRows) break;
            if (!isBorder && (y - startY) > options.size.y + options.dimensions.height + bottomBleedBuffer) break;

            // If it's not a border, always draw. If it is a border, check if it's on the edge.
            const shouldDrawHex = !isBorder || isPerimeterHex(col, row, maxCols, currentMaxRows);

            if (shouldDrawHex) {
                placeHexagon(x, y, svgElements);
            }
            
            row++;
        }
        col++;
    }

    if (isBorder) {
        container.appendChild(tiledSvgBox);
        ele.appendChild(container);
    } else {
        ele.appendChild(tiledSvgBox);
    }
    
}

// HELPER: Generates the solid background rectangle for border mode
function createInteriorRect(options, startX, startY) {
    const bgRect = document.createElementNS(options.svgNS, "rect");
    
    // Calculate dimensions to span the border centers
    const rectWidth = (options.border.x - 1) * (options.dimensions.radius * 1.5);
    const rectHeight = (options.border.y - 1) * options.dimensions.height + (options.dimensions.height / 2);

    bgRect.setAttribute("x", startX);
    bgRect.setAttribute("y", startY);
    bgRect.setAttribute("width", rectWidth);
    bgRect.setAttribute("height", rectHeight);
    
    bgRect.style.fill = options.color.bgColor;
    bgRect.style.stroke = options.color.bgColor;
    bgRect.setAttribute("stroke-width", options.dimensions.hexStrokeWidth);

    return bgRect;
}

// HELPER: Determines if a specific grid coordinate is on the outer edge
function isPerimeterHex(col, row, maxCols, maxRows) {
    return col === 0 || col === maxCols - 1 || row === 0 || row === maxRows - 1;
}

// HELPER: Clones, rotates, and appends a hexagon to the SVG layers
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