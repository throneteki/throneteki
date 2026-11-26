import { holdFlip } from '../../flip';

const rescaleHold = 400;
let rescaleTimer = null;
const properties = { cards: ['--card-scale'], interface: ['--ui-scale', '--text-scale'] };

// Sent on the window when the board's scales change, for parts that measure themselves in cards
export const boardRescaleEvent = 'boardrescale';

// Sets the board's scale variables on the page. Resizing the board is not a card moving: nothing should glide or
// animate because of it
export const applyScaleProperties = (values) => {
    const root = document.documentElement;
    let changed = false;
    for (const [property, value] of Object.entries(values)) {
        const text = String(value);
        changed ||= root.style.getPropertyValue(property) !== text;
        root.style.setProperty(property, text);
    }
    if (changed) {
        holdFlip(rescaleHold);
        root.dataset.rescaling = '';
        clearTimeout(rescaleTimer);
        rescaleTimer = setTimeout(() => delete root.dataset.rescaling, rescaleHold);
        window.dispatchEvent(new Event(boardRescaleEvent));
    }
};

export const removeScaleProperties = (names) => {
    for (const property of names) {
        document.documentElement.style.removeProperty(property);
    }
};

export const interfaceScaleProperties = (scale) =>
    Object.fromEntries(properties.interface.map((property) => [property, scale]));
