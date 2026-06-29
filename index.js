import createCelticBox from './celticBox.js'

const backgroundOptions = {
    boxPosition: {x: 0, y: 0},
    boxWidth: window.innerWidth,
    boxHeight: window.innerHeight,
    hexWidth: 80,
    pathColor: "#423a47",
    bgColor: "#1a1a1a",
    hexColor: "#1f1f1f"
};

const textBoxOptions = {
    boxPosition: {x: 0, y: 0},
    hexWidth: 8,
    pathColor: "#ffea9e6a",
    bgColor: "#161616e9",
    hexColor: "#dcdacc00",
    contentColor: "#dcdacc",
    border: {x: 155, y: 49}
};

createCelticBox(backgroundOptions, document.querySelector('body'));
createCelticBox(textBoxOptions, document.querySelector('body'));