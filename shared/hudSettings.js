export const boardLayouts = ['classic', 'adaptive'];
export const promptSides = ['left', 'right'];
export const hudToggles = ['auto', 'animations', 'overlays'];

export const overlayTimerLimits = { min: 1, max: 10 };
export const isOverlayTimer = (value) =>
    Number.isInteger(value) && value >= overlayTimerLimits.min && value <= overlayTimerLimits.max;
