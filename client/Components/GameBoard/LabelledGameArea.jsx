import React, { createContext, forwardRef, useContext, useMemo } from 'react';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBan,
    faClockRotateLeft,
    faFlag,
    faHand,
    faLayerGroup,
    faMask,
    faRecycle,
    faScroll,
    faSkull
} from '@fortawesome/free-solid-svg-icons';
import { raisedStyle } from './PileDepth';

// How areas show their label: 'full' writes the name and count; 'caption' (for piles drawn small) shows a plate
// along the bottom of the pile with an icon for what it is and its count, keeping the name as the tooltip
export const AreaLabelContext = createContext('full');

const captionIcons = {
    Draw: faLayerGroup,
    Discard: faRecycle,
    Dead: faSkull,
    Plots: faScroll,
    'Used Plots': faClockRotateLeft,
    Shadows: faMask,
    'Out of Game': faBan,
    Hand: faHand,
    Agenda: faFlag
};

const nameOf = (label) => label.replace(/ \(\d+\)$/, '');

const LabelledGameArea = forwardRef(function LabelledGameArea(
    {
        label,
        count,
        disableBackground = false,
        className,
        position = 'top left',
        children,
        style,
        onClick,
        labelClickable = false,
        ...rest
    },
    ref
) {
    const labelStyle = useContext(AreaLabelContext);
    const captioned = labelStyle === 'caption' && count !== undefined;

    const areaLabel = useMemo(() => {
        if (!label) {
            return null;
        }
        if (captioned) {
            const icon = captionIcons[nameOf(label)];
            return (
                <div
                    className='absolute inset-x-0 bottom-0 z-[210] flex h-[1.1rem] items-center justify-center gap-1 rounded-b-md border-t border-white/10 bg-black/80 text-[11px] font-bold leading-none pointer-events-none'
                    style={raisedStyle}
                >
                    {icon && (
                        <FontAwesomeIcon icon={icon} className='text-[9px] text-default-400' />
                    )}
                    <span>{count}</span>
                </div>
            );
        }
        const pos = `${position.includes('bottom') ? 'bottom' : 'top'}-0 ${position.includes('right') ? 'right' : 'left'}-0`;
        const labelClassName = classNames(
            'absolute text-xs z-[210] leading-tight px-1 py-0.5 bg-black/40 rounded-md shift-smooth',
            labelClickable ? 'cursor-pointer hover:bg-black/70' : 'pointer-events-none',
            pos
        );
        return (
            <div className={labelClassName} style={raisedStyle}>
                {label}
            </div>
        );
    }, [label, labelClickable, position, captioned, count]);

    const areaClassName = classNames('relative shift-smooth', className);
    return (
        <div
            ref={ref}
            className={areaClassName}
            onClick={onClick}
            style={style}
            title={captioned ? nameOf(label) : undefined}
            {...rest}
        >
            {!disableBackground && (
                <div className='absolute border-2 border-default-100/55 bg-black/55 w-full h-full rounded-md' />
            )}
            {children}
            {areaLabel}
        </div>
    );
});

export default LabelledGameArea;
