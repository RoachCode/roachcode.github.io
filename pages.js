// pages.js
import { createHexTextBox } from './celticBox.js';
import { celticTextboxData } from './config.js';

export function renderCharacterPage(container, sheetNav) {
    // Create the massive main container
    const sheetWrapper = document.createElement('div');
    sheetWrapper.id = 'character-sheet';

    // Define the structural areas of our character sheet (EXCLUDING the navigation element)
    const sections = [
        { id: 'sheet-header' },
        { id: 'sheet-stats' },
        { id: 'sheet-skills' },
        { id: 'sheet-combat' },
        { id: 'sheet-features' }
    ];

    // Generate and append each core section to the grid
    sections.forEach(sec => {
        const div = document.createElement('div');
        div.id = sec.id;
        div.className = 'sheet-section'; 
        sheetWrapper.appendChild(div);
    });

    // FIX: Injection point. Toss the living navigation element directly into the grid wrapper.
    if (sheetNav) {
        sheetWrapper.appendChild(sheetNav);
    }

    // Append the whole sheet to your main content container
    container.appendChild(sheetWrapper);
}

export function renderMapPage(container) {
    
    createHexTextBox(celticTextboxData, container, text);
}

export function renderGlossaryPage(container) {
    // Create the massive main container
    const sheetWrapper = document.createElement('div');
    sheetWrapper.id = 'character-sheet';

    // FIX: Injection point. Toss the living navigation element directly into the grid wrapper.
    if (sheetNav) {
        sheetWrapper.appendChild(sheetNav);
    }

    // Append the whole sheet to your main content container
    container.appendChild(sheetWrapper);
}