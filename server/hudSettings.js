import { hudToggles } from '../shared/hudSettings.js';

const sizePattern = /^(?:small|normal|large|\d{1,2}(?:\.\d{1,2})?)$/;

// The board settings a player may save, in their profile or for one game
export function sanitizeHud(hud) {
    if (!hud || typeof hud !== 'object') {
        return undefined;
    }

    let result = {};
    for (const key of ['cards', 'interface']) {
        if (typeof hud[key] === 'string' && sizePattern.test(hud[key])) {
            result[key] = hud[key];
        }
    }

    for (const key of hudToggles) {
        if (typeof hud[key] === 'boolean') {
            result[key] = hud[key];
        }
    }

    return Object.keys(result).length > 0 ? result : undefined;
}
