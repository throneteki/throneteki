import React, { createContext, forwardRef, useContext, useMemo } from 'react';
import classNames from 'classnames';
import { raisedStyle } from './PileDepth';

// How areas show their label: 'full' writes the name and count; 'count' (for piles drawn small) shows only the
// count, in a badge, keeping the name as the tooltip
export const AreaLabelContext = createContext('full');

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
    const countOnly = labelStyle === 'count' && count !== undefined;

    const areaLabel = useMemo(() => {
        if (!label) {
            return null;
        }
        if (countOnly) {
            return (
                <div
                    className='absolute bottom-0 right-0 z-[210] min-w-[1.25rem] px-1 text-center text-tiny font-bold leading-tight bg-black/75 border border-default-200 rounded-full pointer-events-none translate-x-1/4 translate-y-1/4'
                    style={raisedStyle}
                >
                    {count}
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
    }, [label, labelClickable, position, countOnly, count]);

    const areaClassName = classNames('relative shift-smooth', className);
    return (
        <div
            ref={ref}
            className={areaClassName}
            onClick={onClick}
            style={style}
            title={countOnly ? label : undefined}
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
