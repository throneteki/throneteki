import React, { useCallback, useContext, useEffect, useMemo, useRef } from 'react';
import classNames from 'classnames';
import { CardHoverContext } from './CardHoverContext';

const CardHoverable = ({ touchDelay = 0, className, children, code }) => {
    const { type, setType, setCode } = useContext(CardHoverContext);
    const holdTimeout = useRef(null);

    const wrapperClassName = useMemo(
        () =>
            classNames(className, {
                'select-none': ['touch', 'pen'].includes(type) // Disables text selection on touch/pen devices, but not desktop
            }),
        [className, type]
    );

    const clear = useCallback(() => {
        setType(null);
        setCode(null);
        clearTimeout(holdTimeout.current);
    }, [setCode, setType]);

    useEffect(() => {
        // Clear if this component unmounts
        return () => {
            clear();
        };
    }, [clear]);

    return (
        <span
            className={wrapperClassName || null}
            onPointerMove={(e) => {
                if (['touch', 'pen'].includes(e.pointerType)) {
                    e.preventDefault();
                    e.stopPropagation();
                } else if (!type) {
                    // If pointer is within element whilst disabled & then is re-enabled, this ensures we update on first pointer move
                    setType('mouse');
                    setCode(code);
                }
            }}
            onPointerEnter={(e) => {
                if (['touch', 'pen'].includes(e.pointerType)) {
                    e.preventDefault();
                    e.stopPropagation();

                    holdTimeout.current = setTimeout(() => {
                        setType('touch');
                        setCode(code);
                    }, touchDelay);
                } else {
                    setType('mouse');
                    setCode(code);
                }
            }}
            onPointerLeave={() => {
                clear();
            }}
        >
            {children}
        </span>
    );
};

export default CardHoverable;
