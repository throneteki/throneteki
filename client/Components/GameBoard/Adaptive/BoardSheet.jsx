import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { SheetContext } from '../PopupContainer';
import { defaultLayout, sheetKeyOf, sheetStore, useSheetState } from './sheetStore';

const plotSources = ['plot deck', 'revealed plots'];
const ignoreEvent = { preventDefault: () => {}, stopPropagation: () => {} };
// As long as the sheet takes to slide away (SheetHost)
const slideTime = 220;

// A pile's part in its player's sheet (SheetHost): while open it asks to be shown, and draws its cards into the
// sheet's body. The sheet draws the frame, so going from pile to pile only changes what is inside it.
const BoardSheet = ({
    open,
    id,
    side,
    name,
    title: fullTitle,
    pileTitle,
    playerName,
    onCloseClick,
    prompting,
    children
}) => {
    const sheetId = `${name}:${id ?? side}`;
    const key = sheetKeyOf({ playerName, side });
    const title = pileTitle ?? fullTitle;
    const closeRef = useRef(onCloseClick);
    closeRef.current = onCloseClick;
    const details = { side, name, title, playerName, prompting };
    const detailsRef = useRef(details);
    detailsRef.current = details;
    const { sheets, contentNodes, layouts } = useSheetState();
    const active = sheets[key];
    const contentNode = contentNodes[key];
    const layout = layouts[key] ?? defaultLayout;

    useLayoutEffect(() => {
        if (!open) {
            return;
        }
        // Shown once each time it opens; what it says about itself is kept up to date below
        sheetStore.show({
            id: sheetId,
            key,
            ...detailsRef.current,
            close: () => closeRef.current?.(ignoreEvent)
        });
        return () => sheetStore.hide(sheetId);
    }, [open, sheetId, key]);

    useLayoutEffect(() => {
        if (open) {
            sheetStore.update(sheetId, { side, name, title, playerName, prompting });
        }
    }, [open, sheetId, side, name, title, playerName, prompting]);

    // Closed, the cards stay in the sheet while it slides away, unless another pile has taken it over
    const shownNow = open && active?.id === sheetId;
    const wasShown = useRef(false);
    const lingerTimer = useRef(null);
    const [lingering, setLingering] = useState(false);
    useLayoutEffect(() => {
        if (shownNow) {
            wasShown.current = true;
            clearTimeout(lingerTimer.current);
            setLingering(false);
        } else if (wasShown.current && !open) {
            wasShown.current = false;
            setLingering(true);
            lingerTimer.current = setTimeout(() => setLingering(false), slideTime);
        }
    }, [shownNow, open]);
    useEffect(() => () => clearTimeout(lingerTimer.current), []);

    const plots = plotSources.includes(name);
    const context = useMemo(() => ({ ...layout, plots }), [layout, plots]);

    if (!contentNode || !(shownNow || (lingering && !active))) {
        return null;
    }
    return createPortal(
        <SheetContext.Provider value={context}>{children}</SheetContext.Provider>,
        contentNode
    );
};

export default BoardSheet;
