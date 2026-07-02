// pages.js
import { mountResponsiveBackground, mountResponsiveTextBox } from './celticBox.js';
import { celticTextboxData } from './config.js';

export function renderCharacterPage(container) {
    const characterSheet = document.createElement('div');
    characterSheet.id = 'character-sheet';

    const sections = [
        { id: 'sheet-header' },
        { id: 'sheet-stats' },
        { id: 'sheet-skills' },
        { id: 'sheet-combat' },
        { id: 'sheet-features' }
    ];

    sections.forEach(sec => {
        const div = document.createElement('div');
        div.id = sec.id;
        div.className = 'sheet-section'; 
        characterSheet.appendChild(div);
    });

    // The entire page gets dropped into pageContent. No nav hacking required.
    container.appendChild(characterSheet);
}

export function renderMapPage(container) {
    const text = "testy mctest";
    mountResponsiveTextBox(celticTextboxData, container, text);
}

export function renderGlossaryPage(container) {

}