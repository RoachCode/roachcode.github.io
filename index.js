// Define constants. Bounding is the area it's drawn over and width defines all other values.
const boundingW = window.innerWidth;
const boundingH = window.innerHeight;

const width = 200;
const totalLineWidth = width / 7; 
const lineGapWidth = width / 10;
const hexStrokeWidth = width / 80;
const radius = width / 2;                  
const height = width * (Math.sqrt(3) / 2);

// Create svg layers
const svgNS = "http://www.w3.org/2000/svg";
const svg = document.createElementNS(svgNS, "svg");
const bgLayer = document.createElementNS(svgNS, "g");
const pathLayer = document.createElementNS(svgNS, "g");
const hexGroup = document.createElementNS(svgNS, "g");
const hexBorder = document.createElementNS(svgNS, "polygon");

// Style and append
svg.classList.add("hex-background");
svg.appendChild(bgLayer);
svg.appendChild(pathLayer);

// Draw hex border
const points = [
    `-${radius/2},-${height/2}`, `${radius/2},-${height/2}`, `${radius},0`,
    `${radius/2},${height/2}`, `-${radius/2},${height/2}`, `-${radius},0`
].join(" ");

hexBorder.setAttribute("points", points);
hexBorder.classList.add("hex-border");
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
    baseLine.setAttribute("stroke-width", totalLineWidth);
    
    const eraserLine = document.createElementNS(svgNS, "path");
    eraserLine.setAttribute("d", dString);
    eraserLine.classList.add("path-eraser");
    eraserLine.setAttribute("stroke-width", lineGapWidth);

    const group = document.createElementNS(svgNS, "g");    
    group.appendChild(baseLine);
    group.appendChild(eraserLine);
    return group;
}

// Draw celtic knot pattern
hexGroup.appendChild(createDoubleLine(topMiddle, bottomRight));
hexGroup.appendChild(createDoubleLine(topLeft, bottomLeft)); 
hexGroup.appendChild(createDoubleLine(topRight, bottomMiddle));

// Generate the grid over bounding area
let col = 0;
for (let x = 0; x <= boundingW + width; x += radius * 1.5) {
    const yOffset = (col % 2 === 1) ? height / 2 : 0;
    
    for (let y = yOffset; y <= boundingH + height; y += height) {
        const rotation = Math.floor(Math.random() * 6) * 60;
        const transformString = `translate(${x}, ${y}) rotate(${rotation})`;
        
        const hexBgInstance = hexBorder.cloneNode(true);
        hexBgInstance.setAttribute("transform", transformString);
        bgLayer.appendChild(hexBgInstance);
        
        const hexPathInstance = hexGroup.cloneNode(true);
        hexPathInstance.setAttribute("transform", transformString);
        pathLayer.appendChild(hexPathInstance);
    }
    col++;
}

document.body.appendChild(svg);