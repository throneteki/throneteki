import React, { useContext, useMemo } from 'react';
import classNames from 'classnames';
import { CardHoverContext } from './CardHoverContext';

const CardHoverable = ({ className, children, code }) => {
    const { type, setType, setCode } = useContext(CardHoverContext);

    const wrapperClassName = useMemo(
        () =>
            classNames('w-full h-full', className, {
                'select-none': ['touch', 'pen'].includes(type) // Disables text selection on touch/pen devices, but not desktop
            }),
        [className, type]
    );

    return (
        <div
            className={wrapperClassName}
            onPointerMove={(e) => {
                if (['touch', 'pen'].includes(e.pointerType)) {
                    e.preventDefault();
                    e.stopPropagation();
                }
            }}
            onPointerEnter={(e) => {
                if (['touch', 'pen'].includes(e.pointerType)) {
                    e.preventDefault();
                    e.stopPropagation();
                    setType('touch');
                } else {
                    setType('mouse');
                }
                setCode(code);
            }}
            onPointerLeave={() => {
                setType(null);
                setCode(null);
            }}
            onContextMenu={(e) => {
                if (['touch', 'pen'].includes(e.nativeEvent.pointerType)) {
                    e.preventDefault();
                }
            }}
        >
            {children}
        </div>
    );
};

export default CardHoverable;
