// pages.js
import { createHexTextBox } from './celticBox.js';
import { celticTextboxData } from './config.js';

export function renderHomePage(container) {
    // Create the massive main container
    const sheetWrapper = document.createElement('div');
    sheetWrapper.id = 'character-sheet';

    // Define the specific areas of our character sheet
    const sections = [
        { id: 'sheet-header', text: 'Character Name & Class' },
        { id: 'sheet-stats', text: 'Attributes (STR, DEX, etc.)' },
        { id: 'sheet-skills', text: 'Skills & Proficiencies' },
        { id: 'sheet-combat', text: 'HP, AC, & Attacks' },
        { id: 'sheet-features', text: 'Traits & Inventory' }
    ];

    // Generate and append each section to the grid
    sections.forEach(sec => {
        const div = document.createElement('div');
        div.id = sec.id;
        div.className = 'sheet-section'; // Shared class for basic styling
        
        // Placeholder content
        const title = document.createElement('h2');
        title.textContent = sec.text;
        div.appendChild(title);
        
        sheetWrapper.appendChild(div);
    });

    // Append the whole sheet to your main content container
    container.appendChild(sheetWrapper);
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