import React from 'react';
import classNames from 'classnames';

export const zoom = '[zoom:var(--ui-scale,1)]';

export const Heading = ({ children, className, style, id }) => (
    <div
        id={id}
        style={style}
        className={classNames(
            'text-center font-display font-semibold text-gold [text-shadow:0_2px_10px_#000]',
            zoom,
            className
        )}
    >
        {children}
    </div>
);

export const OverlayButton = ({ primary = false, disabled = false, onPress, children }) => (
    <button
        type='button'
        onClick={onPress}
        disabled={disabled}
        className={classNames(
            'pointer-events-auto rounded border border-action px-4 py-1.5 text-sm font-medium text-action-fg transition-colors disabled:cursor-not-allowed disabled:opacity-50',
            primary
                ? 'bg-action/25 enabled:hover:bg-action/35'
                : 'bg-panel/80 enabled:hover:bg-action-wash'
        )}
    >
        {children}
    </button>
);

// The board softened and darkened behind an overlay, most in the middle where its text is, so the board's detail
// does not show through the text. It blocks the board underneath.
export const OverlayBackdrop = ({ major = false }) => (
    <div
        className={classNames(
            'overlay-dim pointer-events-auto absolute inset-0 backdrop-blur-[3px]',
            major ? 'bg-panel/90' : 'bg-panel/90'
        )}
        style={{
            backgroundImage:
                'radial-gradient(ellipse 65% 55% at 50% 50%, rgba(0,0,0,0.6), transparent 80%)'
        }}
    />
);
