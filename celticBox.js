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

        const contentDiv = document.createElement("div");
        contentDiv.classList.add("hex-box-content");
        contentDiv.style.borderColor = options.color.pathColor;

        // These paddings clear the inner vertices of the border hexes plus a comfort buffer
        const innerPaddingX = options.dimensions.hexWidth * 1.2; 
        const innerPaddingY = options.dimensions.height * 1.65;

        // Match the absolute positioning grid of the SVG box
        contentDiv.style.left = (innerPaddingX) + "px";
        contentDiv.style.top = (innerPaddingY) + "px";
        contentDiv.style.width = (finalBoxWidth - (innerPaddingX * 2)) + "px";
        contentDiv.style.height = (finalBoxHeight - (innerPaddingY * 2)) + "px";
        contentDiv.style.color = options.color.contentColor || "#fff"; 
        contentDiv.innerText =
        ` Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...
        `;

        container.setAttribute("width", finalBoxWidth);
        container.setAttribute("height", finalBoxHeight);
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
    
    // FIX: Add left side bleed for backgrounds. Stepping back by 2 columns 
    // ensures we perfectly maintain the even/odd parity for alignment.
    const leftBleedCols = !isBorder ? 2 : 0;
    let col = -leftBleedCols;
    const maxCols = isBorder ? options.border.x : Infinity;

    // START loop at startX offset, factoring in the left bleed
    for (let x = startX - (leftBleedCols * options.dimensions.radius * 1.5); ; x += options.dimensions.radius * 1.5) {
        if (isBorder && col >= maxCols) break;
        
        // FIX: Add right side bleed buffer to ensure the right edge doesn't clip
        const rightBleedBuffer = !isBorder ? options.dimensions.hexWidth * 2 : 0;
        if (!isBorder && (x - startX) > options.size.x + options.dimensions.hexWidth + rightBleedBuffer) break;

        // INVERTED LOGIC: Even columns shift down, making odd columns step "up"
        const isEvenCol = (col % 2 === 0);
        const yOffset = isEvenCol ? options.dimensions.height / 2 : 0;
        
        let row = 0;
        
        // Give odd columns one extra row so the bottom edge zigzags downward
        const baseRows = isBorder ? options.border.y : Infinity;
        const currentMaxRows = isBorder ? (isEvenCol ? baseRows : baseRows + 1) : Infinity;

        // Prevent top clipping on backgrounds by starting the draw loop one full hex higher
        const bgTopBleed = !isBorder ? -options.dimensions.height : 0;

        // START loop at startY offset, factoring in the top bleed
        for (let y = startY + yOffset + bgTopBleed; ; y += options.dimensions.height) {
            if (isBorder && row >= currentMaxRows) break;
            
            // Bottom bleed buffer
            const bottomBleedBuffer = !isBorder ? options.dimensions.height * 2 : 0;
            if (!isBorder && (y - startY) > options.size.y + options.dimensions.height + bottomBleedBuffer) break;

            let shouldDrawHex = true;
            
            // If in border mode, only draw the perimeter
            if (isBorder) {
                const isLeftEdge = (col === 0);
                const isRightEdge = (col === maxCols - 1);
                const isTopEdge = (row === 0);
                
                // Check against the dynamically adjusted row count for this specific column
                const isBottomEdge = (row === currentMaxRows - 1);
                
                shouldDrawHex = isLeftEdge || isRightEdge || isTopEdge || isBottomEdge;
            }

            if (shouldDrawHex) {
                const rotation = Math.floor(Math.random() * 6) * 60;
                const transformString = `translate(${x}, ${y}) rotate(${rotation})`;
                
                const hexBgInstance = hexBorder.cloneNode(true);
                hexBgInstance.setAttribute("transform", transformString);
                bgLayer.appendChild(hexBgInstance);
                
                const hexPathInstance = completeHex.cloneNode(true);
                hexPathInstance.setAttribute("transform", transformString);
                pathLayer.appendChild(hexPathInstance);
            } else {
                // FILL THE INSIDE: 
                // This triggers for all non-edge hexes when isBorder is true
                const transformString = `translate(${x}, ${y})`;
                
                const interiorHex = document.createElementNS(options.svgNS, "polygon");
                interiorHex.setAttribute("points", points);
                interiorHex.style.fill = options.color.bgColor;
                
                // SVG anti-aliasing can cause hairline gaps between adjacent polygons. 
                // Adding a stroke matching the background color completely hides them.
                interiorHex.style.stroke = options.color.bgColor;
                interiorHex.setAttribute("stroke-width", options.dimensions.hexStrokeWidth);
                
                interiorHex.setAttribute("transform", transformString);
                bgLayer.appendChild(interiorHex);
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