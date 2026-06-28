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
    boxPosition: {x: 200, y: 200},
    boxWidth: 500,
    boxHeight: 350,
    hexWidth: 25,
    pathColor: "#47285a",
    bgColor: "#000000",
    hexColor: "#ff0000",
    borderThickness: 2
};

createCelticBox(backgroundOptions, document.querySelector('body'));
//createCelticBox(textBoxOptions, document.querySelector('body'));