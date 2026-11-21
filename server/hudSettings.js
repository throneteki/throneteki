const boardLayouts = ['classic', 'adaptive'];
const promptSides = ['left', 'right'];
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

    if (boardLayouts.includes(hud.board)) {
        result.board = hud.board;
    }

    if (promptSides.includes(hud.promptSide)) {
        result.promptSide = hud.promptSide;
    }

    for (const key of ['auto', 'animations', 'overlays']) {
        if (typeof hud[key] === 'boolean') {
            result[key] = hud[key];
        }
    }

    if (Number.isInteger(hud.overlayTimer) && hud.overlayTimer >= 1 && hud.overlayTimer <= 10) {
        result.overlayTimer = hud.overlayTimer;
    }

    return Object.keys(result).length > 0 ? result : undefined;
}
