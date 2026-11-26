import React from 'react';
import classNames from 'classnames';

export const zoom = '[zoom:var(--ui-scale,1)]';

export const Heading = ({ children, className, style, id }) => (
    <div
        id={id}
        style={style}
        className={classNames(
            'text-center font-[Cinzel,serif] font-extrabold uppercase tracking-[0.3em] text-amber-300 [text-shadow:0_2px_10px_#000]',
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
            'pointer-events-auto rounded-md border px-4 py-1.5 text-sm font-semibold uppercase tracking-wide disabled:cursor-not-allowed disabled:opacity-50',
            primary
                ? 'border-amber-400 bg-amber-400 text-black enabled:hover:bg-amber-300'
                : 'border-amber-400/70 bg-black/70 text-amber-100 enabled:hover:bg-amber-400/15'
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
            major ? 'bg-black/80' : 'bg-black/65'
        )}
        style={{
            backgroundImage:
                'radial-gradient(ellipse 65% 55% at 50% 50%, rgba(0,0,0,0.6), transparent 80%)'
        }}
    />
);
