const sizeKinds = {
    cards: { presets: { small: 0.7, normal: 1, large: 1.4 }, min: 0.5, max: 5 },
    interface: { presets: { small: 0.85, normal: 1, large: 1.2 }, min: 0.6, max: 2 }
};

const hudKinds = Object.keys(sizeKinds);
const hudSizeNames = ['small', 'normal', 'large'];

const boardLayouts = ['classic', 'adaptive'];
const promptSides = ['left', 'right'];

// The board's overlays (the start, plots revealed, game over and the like) show unless turned off. Those that close by
// themselves do so after overlayTimer seconds. Both are left out of the settings until changed.
export const overlayTimerLimits = { min: 1, max: 10 };
export const defaultOverlayTimer = 3;
export const isOverlayTimer = (value) =>
    Number.isInteger(value) && value >= overlayTimerLimits.min && value <= overlayTimerLimits.max;
export const overlaySettingsOf = (hud) => ({
    enabled: hud?.overlays !== false,
    seconds: isOverlayTimer(hud?.overlayTimer) ? hud.overlayTimer : defaultOverlayTimer
});

// The prompt sits on the left unless the player chose the right
export const promptSideOf = (hud) => (hud?.promptSide === 'right' ? 'right' : 'left');

export const defaultHud = {
    cards: 'normal',
    interface: 'normal',
    auto: true,
    animations: true,
    board: 'classic'
};

const legacyCardSizes = {
    small: 0.6,
    normal: 1,
    large: 1.4,
    'x-large': 2,
    '2x-large': 3,
    '3x-large': 4,
    '4x-large': 5
};

const screenReference = { width: 1600, height: 950 };
const screenStep = 0.05;
const screenRange = { min: 0.8, max: 1.15 };
// On a usual desktop the interface is drawn a step below normal, and on a larger screen it grows half as fast as the
// screen does, up to screenRange.max
const screenBase = 0.9;
const screenGrowth = 0.5;

export const desktopInterfaceFit = (fit) =>
    screenBase * (fit >= 1 ? 1 + (fit - 1) * screenGrowth : fit);
const absoluteRange = { cards: { min: 0.3, max: 5 }, interface: { min: 0.5, max: 2.5 } };

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export const isHudSize = (kind, value) => {
    if (typeof value !== 'string' && typeof value !== 'number') {
        return false;
    }

    const text = String(value);
    return hudSizeNames.includes(text) || (/^\d{1,2}(\.\d{1,2})?$/.test(text) && Number(text) > 0);
};

export const resolveHudSize = (kind, setting) => {
    const { presets, min, max } = sizeKinds[kind];
    if (Object.hasOwn(presets, setting)) {
        return presets[setting];
    }

    const custom = Number(setting);
    return Number.isFinite(custom) && custom > 0 ? clamp(custom, min, max) : 1;
};

const sizeSettingFromScale = (kind, scale) => {
    const preset = hudSizeNames.find((name) => sizeKinds[kind].presets[name] === scale);
    return preset || String(scale);
};

export const normalizeHud = (settings) => {
    const hud = settings?.hud;
    if (hud && typeof hud === 'object') {
        const result = { ...defaultHud };
        if (isHudSize('cards', hud.cards)) {
            result.cards = String(hud.cards);
        }
        const interfaceSize = [hud.interface, hud.elements, hud.text].find(
            (size) => isHudSize('interface', size) && size !== 'normal'
        );
        if (interfaceSize) {
            result.interface = String(interfaceSize);
        }
        for (const key of ['auto', 'animations', 'overlays']) {
            if (typeof hud[key] === 'boolean') {
                result[key] = hud[key];
            }
        }
        if (isOverlayTimer(hud.overlayTimer)) {
            result.overlayTimer = hud.overlayTimer;
        }
        if (boardLayouts.includes(hud.board)) {
            result.board = hud.board;
        }
        if (promptSides.includes(hud.promptSide)) {
            result.promptSide = hud.promptSide;
        }
        return result;
    }

    const legacy = settings?.cardSize;
    if (legacy && legacy !== 'auto') {
        const scale = legacyCardSizes[legacy] ?? Number(legacy);
        if (Number.isFinite(scale) && scale > 0) {
            return { ...defaultHud, cards: sizeSettingFromScale('cards', scale), auto: false };
        }
    }

    return { ...defaultHud };
};

export const computeScreenScale = ({ width, height }) => {
    const fit = desktopInterfaceFit(
        Math.min(width / screenReference.width, height / screenReference.height)
    );
    return clamp(
        Math.round(Math.floor(fit / screenStep + 1e-9) * screenStep * 100) / 100,
        screenRange.min,
        screenRange.max
    );
};

export const computeHudScales = ({ hud, cardFit = 1, screen = 1 }) => {
    const scales = {};
    for (const kind of hudKinds) {
        const auto = hud.auto ? (kind === 'cards' ? cardFit : screen) : 1;
        const { min, max } = absoluteRange[kind];
        scales[kind] = clamp(resolveHudSize(kind, hud[kind]) * auto, min, max);
    }
    return scales;
};
