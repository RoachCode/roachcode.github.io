export const celticBackgroundDataOld = {
    color: {
        bgColor: "var(--main-background)",
        hexColor: "#1f1f1f",
        pathColor: "var(--background-path-color)",
        eraserColor: "var(--main-background)",
        contentColor: "#ff00d4" /* There should be nothing here */
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

export const celticBackgroundData = {
    color: {
        bgColor: "var(--main-background)",
        hexColor: "#ffffff05",
        pathColor: "var(--background-path-color)",
        eraserColor: "#262205",
        contentColor: "#ff00d4" /* There should be nothing here */
    },
    position: {x: 0, y: 0},
    border: false,
    size: {x: window.innerWidth, y: window.innerHeight},
    dimensions: {
       hexWidth: 33,
       totalLineWidth: 33 / 7,
       lineGapWidth: 33 / 10,
       hexStrokeWidth: 33 / 80,
       radius: 33 / 2,
       height: 33 * (Math.sqrt(3) / 2)
    },
    svgNS: "http://www.w3.org/2000/svg"
};

export const celticTextboxData = {
    color: {
        bgColor: "#161616e9",
        hexColor: "#dcdacc00",
        pathColor: "var(--celtic-green)",
        eraserColor: "var(--celtic-green)",
        contentColor: "var(--text-color)"
    },
    position: {x: 0, y: 0},
    border: true,
    size: {
        x: window.innerWidth * 0.9, 
        y: window.innerHeight * 0.9
    },
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