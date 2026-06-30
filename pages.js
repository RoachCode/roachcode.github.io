// pages.js
import { createHexTextBox } from './celticBox.js';
import { celticTextboxData } from './config.js';

export function renderHomePage(container) {
    const text = `Welcome to the home page! Neque porro quisquam est...`;
    
    // You can call createHexTextBox multiple times here if a page needs multiple boxes
    createHexTextBox(celticTextboxData, container, text);
}

export function renderAboutPage(container) {
    const text = `This is the about page. It has different content.`;
    
    // Maybe the about page uses a different data config for a wider box!
    createHexTextBox(celticTextboxData, container, text);
}

export function renderContactPage(container) {
    const text = `This is the contact page. It has different content.`;
    
    // Maybe the about page uses a different data config for a wider box!
    createHexTextBox(celticTextboxData, container, text);
}