import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import classNames from 'classnames';
import { cardHoverStore, useCardHover } from './cardHoverStore';

const isTouchLike = (state) => state.type === 'touch';

const CardHoverable = ({ touchDelay = 0, className, children, code, notes, isDisabled }) => {
    const owner = useRef({}).current;
    const holdTimeout = useRef(null);
    const touchActive = useCardHover(isTouchLike);

    const wrapperClassName = useMemo(
        () =>
            classNames(className, {
                'select-none': touchActive // Disables text selection on touch/pen devices, but not desktop
            }),
        [className, touchActive]
    );

    const show = useCallback(
        (type) => cardHoverStore.show(owner, { type, code, notes }),
        [owner, code, notes]
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

    return (
        <span
            className={wrapperClassName || null}
            onPointerMove={(e) => {
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
            }}
            onPointerEnter={(e) => {
                if (isDisabled) {
                    return;
                }
                if (['touch', 'pen'].includes(e.pointerType)) {
                    e.preventDefault();
                    e.stopPropagation();

                    holdTimeout.current = setTimeout(() => show('touch'), touchDelay);
                } else {
                    show('mouse');
                }
            }}
            onPointerLeave={() => {
                if (isDisabled) {
                    return;
                }
                clear();
            }}
        >
            {children}
        </span>
    );
};

export default CardHoverable;
