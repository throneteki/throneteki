import React from 'react';

const gap = '0.5rem';

// A place in a row that opens and closes smoothly. It stays mounted while closed, so what is next to it slides
// across as it grows or shrinks, instead of jumping.
const AnimatedSlot = ({ open, children }) => (
    <div
        aria-hidden={!open}
        className='shift-smooth grid self-start'
        style={{
            gridTemplateColumns: open ? '1fr' : '0fr',
            marginLeft: open ? 0 : `-${gap}`,
            opacity: open ? 1 : 0,
            pointerEvents: open ? undefined : 'none'
        }}
    >
        <div className='min-w-0 overflow-clip' style={{ overflowClipMargin: '1.5rem' }}>
            {children}
        </div>
    </div>
);

export default AnimatedSlot;
