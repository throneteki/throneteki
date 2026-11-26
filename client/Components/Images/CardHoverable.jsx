import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import classNames from 'classnames';
import { cardHoverStore, useCardHover } from './cardHoverStore';

const isTouchLike = (state) => state.type === 'touch';

// Every card that can be previewed, by its element, so a finger moved over it can preview it
const previewable = new WeakMap();

// Once a held finger shows a card, moving it over another card shows that one instead, which makes thin cards
// (attachments tucked under a character) easy to look at. Moved off every card, the last one stays until the
// finger lifts. The finger is held by the card it pressed, so where it is is asked of the page.
let scrubbing = null;
const stopScrubbing = () => {
    if (!scrubbing) {
        return;
    }
    const { move, end, entry } = scrubbing;
    document.removeEventListener('touchmove', move, true);
    document.removeEventListener('touchend', end, true);
    document.removeEventListener('touchcancel', end, true);
    scrubbing = null;
    cardHoverStore.clear(entry.owner);
};
const startScrubbing = (entry) => {
    stopScrubbing();
    const move = (event) => {
        // A card being carried (manual mode) is not previewed
        if (document.documentElement.classList.contains('card-dragging')) {
            stopScrubbing();
            return;
        }
        const touch = event.touches?.[0];
        if (!touch) {
            return;
        }
        // The board stays put while the finger looks along it
        if (event.cancelable) {
            event.preventDefault();
        }
        const element = document
            .elementFromPoint(touch.clientX, touch.clientY)
            ?.closest('[data-previewable]');
        const next = element && previewable.get(element);
        if (next && next !== scrubbing.entry) {
            cardHoverStore.clear(scrubbing.entry.owner);
            scrubbing.entry = next;
            next.show.current('touch');
        }
    };
    const end = () => stopScrubbing();
    scrubbing = { move, end, entry };
    document.addEventListener('touchmove', move, { capture: true, passive: false });
    document.addEventListener('touchend', end, true);
    document.addEventListener('touchcancel', end, true);
};

export const useCardHoverHandlers = ({ touchDelay = 0, code, notes, isDisabled }) => {
    const owner = useRef({}).current;
    const holdTimeout = useRef(null);
    const touchActive = useCardHover(isTouchLike);

    const show = useCallback(
        (type) => cardHoverStore.show(owner, { type, code, notes }),
        [owner, code, notes]
    );
    const showRef = useRef(show);
    showRef.current = show;
    const entry = useMemo(() => ({ owner, show: showRef }), [owner, showRef]);
    const register = useCallback(
        (element) => {
            if (element) {
                previewable.set(element, entry);
            }
        },
        [entry]
    );

    const clear = useCallback(() => {
        cardHoverStore.clear(owner);
        clearTimeout(holdTimeout.current);
    }, [owner]);

    useEffect(() => {
        if (isDisabled) {
            clear();
        }

        // Clear if this component unmounts
        return () => {
            clear();
        };
    }, [isDisabled, clear]);

    const handlers = useMemo(
        () => ({
            ref: register,
            'data-previewable': isDisabled ? undefined : '',
            onPointerMove: (e) => {
                if (isDisabled) {
                    return;
                }
                if (['touch', 'pen'].includes(e.pointerType)) {
                    e.preventDefault();
                    e.stopPropagation();
                } else if (!cardHoverStore.getState().type) {
                    // If pointer is within element whilst disabled & then is re-enabled, this ensures we update on first pointer move
                    show('mouse');
                }
            },
            onPointerEnter: (e) => {
                if (isDisabled) {
                    return;
                }
                if (['touch', 'pen'].includes(e.pointerType)) {
                    e.preventDefault();
                    e.stopPropagation();

                    holdTimeout.current = setTimeout(() => {
                        show('touch');
                        startScrubbing(entry);
                    }, touchDelay);
                } else {
                    show('mouse');
                }
            },
            onPointerLeave: () => {
                if (isDisabled) {
                    return;
                }
                // While a finger looks along the cards, the preview is the finger's, not this card's
                if (scrubbing) {
                    clearTimeout(holdTimeout.current);
                    return;
                }
                clear();
            }
        }),
        [isDisabled, show, clear, touchDelay, register, entry]
    );

    return { handlers, touchActive };
};

const CardHoverable = ({ touchDelay = 0, className, children, code, notes, isDisabled }) => {
    const { handlers, touchActive } = useCardHoverHandlers({
        touchDelay,
        code,
        notes,
        isDisabled
    });

    const wrapperClassName = useMemo(
        () =>
            classNames(className, {
                'select-none': touchActive // Disables text selection on touch/pen devices, but not desktop
            }),
        [className, touchActive]
    );

    return (
        <span className={wrapperClassName || null} {...handlers}>
            {children}
        </span>
    );
};

export default CardHoverable;
