export const celticBackgroundData = {
    color: {
        bgColor: "var(--main-background)",
        hexColor: "#ffffff05",
        pathColor: "var(--background-path-color)",
        eraserColor: "var(--background-eraser-color)",
        contentColor: "#ff00d4" /* There should be nothing here */
    },
    position: {x: 0, y: 0},
    border: false,
    size: {x: window.innerWidth, y: window.innerHeight},
    dimensions: {
       hexWidth: 33,
       totalLineWidth: 33 / 7,
       lineGapWidth: 33 / 20,
       hexStrokeWidth: 33 / 80,
       radius: 33 / 2,
       height: 33 * (Math.sqrt(3) / 2)
    },
    svgNS: "http://www.w3.org/2000/svg"
};

export const celticTextboxData = {
    color: {
        bgColor: "#000000",
        hexColor: "#dcdacc00",
        pathColor: "var(--celtic-border)",
        eraserColor: "var(--celtic-border)",
        contentColor: "var(--text-color)"
    },
    position: {x: 0, y: 0},
    border: true,
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