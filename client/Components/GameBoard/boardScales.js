import { remSize } from '../../cardScale';
import { computeHudScales, resolveHudSize } from '../../hud';
import { hidesNavbar } from '../../boardLayoutStore';
import {
    adaptiveInterfaceScale,
    cardRoom,
    classifyLayout,
    computeAdaptiveScales
} from './Adaptive/adaptiveScale';

// The scales the board draws at, from its settings and measure. The board and the settings' previews both size
// through here, so a preview matches the board. Cards are fitted as though the interface were normal, so the two sizes are independent (a larger interface
// scrolls). fits: whether the rows fit without scrolling. overflow: which size is to blame (the cards if they would
// not fit beside a normal interface, else the interface).
export const adaptiveScales = (hud, { container, viewport, rem = 16, mode, content }) => {
    const layout = mode ?? classifyLayout(container);
    const screen = adaptiveInterfaceScale(layout, viewport);
    const interfaceAt = (size) =>
        computeHudScales({ hud: { ...hud, interface: size }, screen }).interface;
    const interfaceScale = interfaceAt(hud.interface);
    const options = {
        mode: layout,
        ...container,
        rem,
        widestRow: content?.widestRow ?? 0,
        stripExtra: content?.stripExtra ?? 0,
        cardsSize: resolveHudSize('cards', hud.cards),
        auto: hud.auto !== false
    };
    const normalInterface = interfaceAt('normal');
    const fitted = computeAdaptiveScales({ ...options, interfaceScale: normalInterface });
    const fits = fitted.card <= cardRoom({ ...options, interfaceScale });
    const cardsTooLarge = fitted.card > cardRoom({ ...options, interfaceScale: normalInterface });
    return {
        cards: fitted.card,
        pile: fitted.pile,
        hand: fitted.hand,
        interface: interfaceScale,
        fits,
        overflow: fits ? null : cardsTooLarge ? 'cards' : 'interface'
    };
};

// The settings' sliders' ranges
export const sliderRanges = { cards: { min: 0.5, max: 3 }, interface: { min: 0.6, max: 2 } };

// A fixed size (auto off, the sizing every board fits now replaced) as fitted sizes that draw the same on this board
// and screen: each size divided by the fit it would otherwise be scaled by
export const fitSizedHud = (hud, measure) => {
    if (hud.auto !== false) {
        return hud;
    }
    const fixed = adaptiveScales(hud, measure);
    const fit = adaptiveScales({ ...hud, auto: true, cards: '1', interface: '1' }, measure);
    const sizeOf = (kind) => {
        const { min, max } = sliderRanges[kind];
        const size = Math.min(max, Math.max(min, fixed[kind] / fit[kind]));
        return String(Math.round(size * 100) / 100);
    };
    return { ...hud, auto: true, cards: sizeOf('cards'), interface: sizeOf('interface') };
};

const navbarHeight = 48;

// Away from a game, the board's room is estimated from the window: the whole of it where the board hides
// the navbar (a phone), below the navbar elsewhere, with nothing yet in play
export const estimateBoardMeasure = (viewport) => {
    const rem = remSize();
    const fullScreen = hidesNavbar(classifyLayout(viewport));
    const container = fullScreen
        ? viewport
        : { width: viewport.width, height: viewport.height - navbarHeight };
    return { container, viewport, rem };
};
