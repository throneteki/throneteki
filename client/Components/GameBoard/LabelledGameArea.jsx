import React, { useCallback } from 'react';
import classNames from 'classnames';

const LabelledGameArea = ({ label, className, position = 'top left', children }) => {
    const getLabel = useCallback(() => {
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
        <div className={areaClassName}>
            {getLabel()}
            {children}
        </div>
    );
};

export default LabelledGameArea;
