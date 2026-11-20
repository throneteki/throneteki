import { computeAutoCardScale } from '../../cardScale';
import { computeHudScales, computeScreenScale, resolveHudSize } from '../../hud';
import { hidesNavbar } from '../../boardLayoutStore';
import {
    adaptiveInterfaceScale,
    classifyLayout,
    computeAdaptiveScales
} from './Adaptive/adaptiveScale';

// The scales a board draws at, from its settings and what it was measured at: the board area (container), the
// window (viewport), the root font size (rem) and, on the adaptive board, its layout mode and what is in play
// (content). The boards and the settings' previews all size through here, so a preview matches its board.
// cardFit: the classic board's fit when it has already settled on one.
export const classicScales = (hud, { container, viewport, rem = 16, cardFit }) =>
    computeHudScales({
        hud,
        cardFit: hud.auto ? (cardFit ?? computeAutoCardScale({ ...container, rem })) : 1,
        screen: computeScreenScale(viewport)
    });

export const adaptiveScales = (hud, { container, viewport, rem = 16, mode, content }) => {
    const layout = mode ?? classifyLayout(container);
    const interfaceScale = computeHudScales({
        hud,
        screen: adaptiveInterfaceScale(layout, viewport)
    }).interface;
    const fitted = computeAdaptiveScales({
        mode: layout,
        ...container,
        rem,
        widestRow: content?.widestRow ?? 0,
        stripExtra: content?.stripExtra ?? 0,
        cardsSize: resolveHudSize('cards', hud.cards),
        auto: hud.auto !== false,
        interfaceScale
    });
    return { cards: fitted.card, pile: fitted.pile, hand: fitted.hand, interface: interfaceScale };
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
    const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
    const fullScreen = hud.board === 'adaptive' && hidesNavbar(classifyLayout(viewport));
    const container = fullScreen
        ? viewport
        : { width: viewport.width, height: viewport.height - navbarHeight };
    return { container, viewport, rem };
};
