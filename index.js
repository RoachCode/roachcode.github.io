import { createCelticBox } from './celticBox.js'

const celticBackgroundData = {
    color: {
        bgColor: "#1a1a1a",
        hexColor: "#1f1f1f",
        pathColor: "#423a47",
        eraserColor: "#1a1a1a",
        contentColor: "#ff00d4"
    },
    position: {x: 0, y: 0},
    border: false,
    size: {x: window.innerWidth, y: window.innerHeight},
    dimensions: {
       hexWidth: 80,
       totalLineWidth: 80 / 7,
       lineGapWidth: 80 / 10,
       hexStrokeWidth: 80 / 80,
       radius: 80 / 2,
       height: 80 * (Math.sqrt(3) / 2)
    },
    svgNS: "http://www.w3.org/2000/svg"
};

const celticTextboxData = {
    color: {
        bgColor: "#161616e9",
        hexColor: "#dcdacc00",
        pathColor: "#084617",
        eraserColor: "#084617",
        contentColor: "#bfbdb2"
    },
    position: {x: 0, y: 0},
    border: true,
    size: {x: window.innerWidth * 0.8, y: window.innerHeight * 0.8},
    dimensions: {
       hexWidth: 8,
       totalLineWidth: 8 / 7,
       lineGapWidth: 8 / 30,
       hexStrokeWidth: 8 / 80,
       radius: 8 / 2,
       height: 8 * (Math.sqrt(3) / 2)
    },
    svgNS: "http://www.w3.org/2000/svg"
};

const body = document.querySelector('body');
createCelticBox(celticBackgroundData, body);
createCelticBox(celticTextboxData, body);