export default function createCelticBox(options = {}, ele) {
    // Define hex
    const width = options.hexWidth;
    const totalLineWidth = width / 7; 
    const lineGapWidth = width / 10;
    const hexStrokeWidth = width / 80;
    const radius = width / 2;                  
    const height = width * (Math.sqrt(3) / 2);

    // Create svg layers
    const svgNS = "http://www.w3.org/2000/svg";
    const tiledSvgBox = document.createElementNS(svgNS, "svg");
    const bgLayer = document.createElementNS(svgNS, "g");
    const pathLayer = document.createElementNS(svgNS, "g");
    const completeHex = document.createElementNS(svgNS, "g");
    const hexBorder = document.createElementNS(svgNS, "polygon");

    // Check for border mode
    const isBorder = !!options.border;
    let finalBoxWidth = options.boxWidth;
    let finalBoxHeight = options.boxHeight;

    // To prevent clipping, offset the start of the grid by half a hex
    const startX = radius;
    const startY = height / 2;

    if (isBorder) {
        // Exactly calculate SVG dimensions to perfectly wrap the shifted border grid
        if (options.border.x % 2 === 0 && options.border.x > 1) { options.border.x -= 1; }
        finalBoxWidth = (options.border.x - 1) * (radius * 1.5) + width;
        finalBoxHeight = (options.border.y - 1) * height + (height * 2);

        // Exactly calculate SVG dimensions to perfectly wrap the shifted border grid
        if (options.border.x % 2 === 0 && options.border.x > 1) { options.border.x -= 1; }
        finalBoxWidth = (options.border.x - 1) * (radius * 1.5) + width;
        finalBoxHeight = (options.border.y - 1) * height + (height * 2);
        const contentDiv = document.createElement("div");
        contentDiv.classList.add("hex-box-content");
        contentDiv.style.borderColor = options.pathColor;

        // These paddings clear the inner vertices of the border hexes plus a comfort buffer
        const innerPaddingX = width * 1.2; 
        const innerPaddingY = height * 1.65;

        // Match the absolute positioning grid of the SVG box
        contentDiv.style.left = (options.boxPosition.x + innerPaddingX) + "px";
        contentDiv.style.top = (options.boxPosition.y + innerPaddingY) + "px";
        contentDiv.style.width = (finalBoxWidth - (innerPaddingX * 2)) + "px";
        contentDiv.style.height = (finalBoxHeight - (innerPaddingY * 2)) + "px";
        contentDiv.style.color = options.contentColor || "#fff"; 
        contentDiv.innerText =
        ` A classic, literary serif font inspired by traditional books. It looks professional and feels right at home in a fantasy setting
        `;

        ele.appendChild(contentDiv);
    }
    else{
        tiledSvgBox.classList.add("page-background");
    }

    // Style and append
    tiledSvgBox.classList.add("hex-background");
    tiledSvgBox.style.left = options.boxPosition.x + "px";
    tiledSvgBox.style.top = options.boxPosition.y + "px";
    tiledSvgBox.style.position = "absolute"; 
    tiledSvgBox.setAttribute("width", finalBoxWidth);
    tiledSvgBox.setAttribute("height", finalBoxHeight);
    tiledSvgBox.appendChild(bgLayer);
    tiledSvgBox.appendChild(pathLayer);
    if (!isBorder) { tiledSvgBox.style.border = "none"; }

    // Draw hex border
    const points = [
        `-${radius/2},-${height/2}`, `${radius/2},-${height/2}`, `${radius},0`,
        `${radius/2},${height/2}`, `-${radius/2},${height/2}`, `-${radius},0`
    ].join(" ");

    hexBorder.setAttribute("points", points);
    hexBorder.classList.add("hex-border");
    hexBorder.style.fill = options.bgColor;
    hexBorder.style.stroke = options.hexColor;
    hexBorder.setAttribute("stroke-width", hexStrokeWidth);

    // Define the key anchor points
    const eX = radius * 0.75;
    const eY = height / 4;
    const topY = height / 2;
    const center = { x: 0, y: 0 };  

    const topMiddle = { x: 0, y: -topY };
    const topLeft = { x: -eX, y: -eY };
    const topRight = { x: eX, y: -eY };
    const bottomLeft = { x: -eX, y: eY };
    const bottomRight = { x: eX, y: eY };
    const bottomMiddle = { x: 0, y: topY };

    // Creates double lines using anchor points
    function createDoubleLine(start, end) {
        const dString = `M ${start.x} ${start.y} Q ${center.x} ${center.y} ${end.x} ${end.y}`;

        const baseLine = document.createElementNS(svgNS, "path");
        baseLine.setAttribute("d", dString);
        baseLine.classList.add("path-base");
        baseLine.style.stroke = options.pathColor;
        baseLine.setAttribute("stroke-width", totalLineWidth);
        
        const eraserLine = document.createElementNS(svgNS, "path");
        eraserLine.setAttribute("d", dString);
        eraserLine.classList.add("path-eraser");
        eraserLine.style.stroke = options.bgColor;
        if (isBorder) { eraserLine.style.stroke = options.pathColor; }
        eraserLine.setAttribute("stroke-width", lineGapWidth);

        const group = document.createElementNS(svgNS, "g");  
        group.appendChild(baseLine);
        group.appendChild(eraserLine);
        return group;
    }

    // Draw celtic knot pattern
    completeHex.appendChild(createDoubleLine(topMiddle, bottomRight));
    completeHex.appendChild(createDoubleLine(topLeft, bottomLeft)); 
    completeHex.appendChild(createDoubleLine(topRight, bottomMiddle));

   // Generate the grid over bounding area OR as a hollow border
    
    // FIX: Add left side bleed for backgrounds. Stepping back by 2 columns 
    // ensures we perfectly maintain the even/odd parity for alignment.
    const leftBleedCols = !isBorder ? 2 : 0;
    let col = -leftBleedCols;
    const maxCols = isBorder ? options.border.x : Infinity;

    // START loop at startX offset, factoring in the left bleed
    for (let x = startX - (leftBleedCols * radius * 1.5); ; x += radius * 1.5) {
        if (isBorder && col >= maxCols) break;
        
        // FIX: Add right side bleed buffer to ensure the right edge doesn't clip
        const rightBleedBuffer = !isBorder ? width * 2 : 0;
        if (!isBorder && (x - startX) > options.boxWidth + width + rightBleedBuffer) break;

        // INVERTED LOGIC: Even columns shift down, making odd columns step "up"
        const isEvenCol = (col % 2 === 0);
        const yOffset = isEvenCol ? height / 2 : 0;
        
        let row = 0;
        
        // Give odd columns one extra row so the bottom edge zigzags downward
        const baseRows = isBorder ? options.border.y : Infinity;
        const currentMaxRows = isBorder ? (isEvenCol ? baseRows : baseRows + 1) : Infinity;

        // Prevent top clipping on backgrounds by starting the draw loop one full hex higher
        const bgTopBleed = !isBorder ? -height : 0;

        // START loop at startY offset, factoring in the top bleed
        for (let y = startY + yOffset + bgTopBleed; ; y += height) {
            if (isBorder && row >= currentMaxRows) break;
            
            // Bottom bleed buffer
            const bottomBleedBuffer = !isBorder ? height * 2 : 0;
            if (!isBorder && (y - startY) > options.boxHeight + height + bottomBleedBuffer) break;

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
                
                const interiorHex = document.createElementNS(svgNS, "polygon");
                interiorHex.setAttribute("points", points);
                interiorHex.style.fill = options.bgColor;
                
                // SVG anti-aliasing can cause hairline gaps between adjacent polygons. 
                // Adding a stroke matching the background color completely hides them.
                interiorHex.style.stroke = options.bgColor;
                interiorHex.setAttribute("stroke-width", hexStrokeWidth);
                
                interiorHex.setAttribute("transform", transformString);
                bgLayer.appendChild(interiorHex);
            }
            row++;
        }
        col++;
    }

    ele.appendChild(tiledSvgBox);
}