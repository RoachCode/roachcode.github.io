export default function createCelticBox(options = {}, ele) {
    console.log("Options received:", options);
    console.log("Element received:", ele);

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

    // Style and append
    tiledSvgBox.classList.add("hex-background");
    tiledSvgBox.style.left = options.boxPosition.x + "px";
    tiledSvgBox.style.top = options.boxPosition.y + "px";
    tiledSvgBox.setAttribute("width", options.boxWidth);
    tiledSvgBox.setAttribute("height", options.boxHeight);
    tiledSvgBox.style.backgroundColor = options.bgColor; 
    tiledSvgBox.appendChild(bgLayer);
    tiledSvgBox.appendChild(pathLayer);

    // Draw hex border
    const points = [
        `-${radius/2},-${height/2}`, `${radius/2},-${height/2}`, `${radius},0`,
        `${radius/2},${height/2}`, `-${radius/2},${height/2}`, `-${radius},0`
    ].join(" ");

    hexBorder.setAttribute("points", points);
    hexBorder.classList.add("hex-border");
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

    // Generate the grid over bounding area
    let col = 0;
    for (let x = 0; x <= options.boxWidth + width; x += radius * 1.5) {
        const yOffset = (col % 2 === 1) ? height / 2 : 0;
        
        for (let y = yOffset; y <= options.boxHeight + height; y += height) {

            if (options.borderThickness) {
                // Generously calculate boundaries so edges catch exactly 'n' hexes
                const thickX = (options.borderThickness - 0.1) * (radius * 1.5);
                const thickY = (options.borderThickness - 0.1) * height;

                const isBorderX = x < thickX || x > (options.boxWidth + width) - thickX;
                const isBorderY = y < thickY || y > (options.boxHeight + height) - thickY;

                // Skip drawing this specific hexagon if it falls in the center
                if (!isBorderX && !isBorderY) {
                    continue; 
                }
            }

            const rotation = Math.floor(Math.random() * 6) * 60;
            const transformString = `translate(${x}, ${y}) rotate(${rotation})`;
            
            const hexBgInstance = hexBorder.cloneNode(true);
            hexBgInstance.setAttribute("transform", transformString);
            bgLayer.appendChild(hexBgInstance);
            
            const hexPathInstance = completeHex.cloneNode(true);
            hexPathInstance.setAttribute("transform", transformString);
            pathLayer.appendChild(hexPathInstance);
        }
        col++;
    }

    ele.appendChild(tiledSvgBox);
}