import { computeAutoCardScale, remSize } from '../../cardScale';
import { computeHudScales, computeScreenScale, resolveHudSize } from '../../hud';
import { hidesNavbar } from '../../boardLayoutStore';
import {
    adaptiveInterfaceScale,
    cardRoom,
    classifyLayout,
    computeAdaptiveScales
} from './Adaptive/adaptiveScale';

// The scales a board draws at, from its settings and measure. Boards and the settings' previews all size through
// here, so a preview matches its board. cardFit: the classic board's settled fit.
export const classicScales = (hud, { container, viewport, rem = 16, cardFit }) =>
    computeHudScales({
        hud,
        cardFit: hud.auto ? (cardFit ?? computeAutoCardScale({ ...container, rem })) : 1,
        screen: computeScreenScale(viewport)
    });

// Cards are fitted as though the interface were normal, so the two sizes are independent (a larger interface
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

export const boardScales = (hud, measure) =>
    hud.board === 'adaptive' ? adaptiveScales(hud, measure) : classicScales(hud, measure);

// What the board in play was last measured at, for previewing other settings against it
let lastMeasure = null;
export const setBoardMeasure = (measure) => {
    lastMeasure = measure;
};
export const boardMeasure = () => lastMeasure;

const navbarHeight = 48;

// Away from a game, the board's room is estimated from the window: the whole of it where the adaptive board hides
// the navbar (a phone), below the navbar elsewhere, with nothing yet in play
export const estimateBoardMeasure = (hud, viewport) => {
    const rem = remSize();
    const fullScreen = hud.board === 'adaptive' && hidesNavbar(classifyLayout(viewport));
    const container = fullScreen
        ? viewport
        : { width: viewport.width, height: viewport.height - navbarHeight };
    return { container, viewport, rem };
};
