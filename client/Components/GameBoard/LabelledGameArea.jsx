import React, { useMemo } from 'react';
import classNames from 'classnames';

const LabelledGameArea = ({
    label,
    disableBackground = false,
    className,
    position = 'top left',
    children,
    style,
    onClick
}) => {
    const areaLabel = useMemo(() => {
        if (!label) {
            return null;
        }
        const pos = `${position.includes('bottom') ? 'bottom' : 'top'}-0 ${position.includes('right') ? 'right' : 'left'}-0`;
        const labelClassName = classNames(
            'absolute text-xs leading-tight px-1 py-0.5 bg-black/40 rounded-md z-20 pointer-events-none',
            pos
        );
        return <div className={labelClassName}>{label}</div>;
    }, [label, position]);

    const areaClassName = classNames('relative', className);
    return (
        <div className={areaClassName} onClick={onClick} style={style}>
            {areaLabel}
            {!disableBackground && (
                <div className='absolute border-2 border-default-100/55 bg-black/55 w-full h-full rounded-md' />
            )}
            {children}
        </div>
    );
};

export default LabelledGameArea;
