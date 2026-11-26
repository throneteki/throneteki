import React, { useLayoutEffect, useRef, useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames';
import { createPortal } from 'react-dom';

import { motionOff } from '../../flip';
import { useDragMove } from './useDragMove';
import { dropPanel, raisePanel } from './panelStack';
import PlayerAvatar from './Adaptive/PlayerAvatar';

const enterDuration = 240;
const exitDuration = 180;

// The panel grows out of the pile it belongs to and shrinks back into it
const fromAnchor = (panel, anchor) => {
    if (!anchor) {
        return { translate: '0px 0px', scale: 0.9 };
    }

    const panelRect = panel.getBoundingClientRect();
    const anchorRect = anchor.getBoundingClientRect();
    const dx = anchorRect.left + anchorRect.width / 2 - (panelRect.left + panelRect.width / 2);
    const dy = anchorRect.top + anchorRect.height / 2 - (panelRect.top + panelRect.height / 2);
    return {
        translate: `${dx}px ${dy}px`,
        scale: 0.15,
        transformOrigin: `${panelRect.left + panelRect.width / 2}px ${panelRect.top + panelRect.height / 2}px`
    };
};

const PanelBody = ({
    open,
    onExited,
    name,
    side,
    id = side,
    title,
    pileTitle,
    playerName,
    look = 'classic',
    onCloseClick,
    anchorRef,
    anchorOffset = 10,
    children,
    className
}) => {
    const animation = useRef(null);
    const { panelRef, handleRef } = useDragMove({
        storageKey: `${name}-${id}`,
        getDefaultPosition: (panel) => {
            if (anchorRef?.current) {
                const anchorRect = anchorRef.current.getBoundingClientRect();
                return {
                    x: anchorRect.x + anchorRect.width / 2 - panel.offsetWidth / 2,
                    y:
                        side === 'top'
                            ? anchorRect.y + anchorRect.height + anchorOffset
                            : anchorRect.y - panel.offsetHeight - anchorOffset
                };
            }

            return {
                x: window.innerWidth / 2 - panel.offsetWidth / 2,
                y: window.innerHeight / 2 - panel.offsetHeight / 2
            };
        }
    });

    // The panel last opened or used is drawn above the others
    useLayoutEffect(() => {
        const panel = panelRef.current;
        if (!panel) {
            return;
        }
        const raise = () => raisePanel(panel);
        panel.addEventListener('pointerdown', raise, true);
        return () => {
            panel.removeEventListener('pointerdown', raise, true);
            dropPanel(panel);
        };
    }, [panelRef]);

    useLayoutEffect(() => {
        const panel = panelRef.current;
        if (panel && open) {
            raisePanel(panel);
        }
        animation.current?.cancel();
        if (!panel || motionOff()) {
            if (!open) {
                onExited();
            }
            return;
        }

        const away = fromAnchor(panel, anchorRef?.current);
        const hidden = { opacity: 0, ...away };
        const shown = {
            opacity: 1,
            translate: '0px 0px',
            scale: 1,
            transformOrigin: away.transformOrigin
        };
        panel.style.pointerEvents = open ? '' : 'none';
        animation.current = panel.animate(open ? [hidden, shown] : [shown, hidden], {
            duration: open ? enterDuration : exitDuration,
            easing: open ? 'cubic-bezier(0.2, 0.8, 0.3, 1)' : 'ease-in',
            fill: 'forwards'
        });
        if (!open) {
            animation.current.onfinish = onExited;
        }
    }, [open, onExited, anchorRef, panelRef]);

    const board = look === 'board';
    const wrapperClass = classNames(
        className,
        'max-h-screen max-w-screen fixed top-0 left-0 flex flex-col overflow-hidden',
        board
            ? 'rounded-md border border-amber-400/40 bg-zinc-950/90 shadow-[0_10px_30px_rgba(0,0,0,0.7)]'
            : 'min-w-60 border border-gold-line bg-[#0c0d11]/95 shadow-[0_18px_40px_rgba(0,0,0,0.6)]'
    );

    return createPortal(
        <div ref={panelRef} data-popup='' data-popup-look={look} className={wrapperClass}>
            {board ? (
                // The adaptive board's look: whose pile it is by avatar, its name as the board's labels are
                <div
                    ref={handleRef}
                    className='hud-zoom flex cursor-grab touch-none select-none items-center gap-2 border-b border-white/[0.060] bg-black/80 px-2 py-1.5'
                    onClick={(event) => event.stopPropagation()}
                >
                    {playerName && <PlayerAvatar name={playerName} className='h-5 w-5 shrink-0' />}
                    <span className='min-w-0 flex-1 truncate text-xs font-semibold uppercase tracking-wide text-amber-100'>
                        {playerName
                            ? `${playerName} · ${pileTitle ?? title}`
                            : (pileTitle ?? title)}
                    </span>
                    <button
                        type='button'
                        aria-label='Close'
                        data-no-drag
                        className='tap-target shrink-0 rounded px-1 text-ink-faint hover:text-white'
                        onClick={onCloseClick}
                    >
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                </div>
            ) : (
                <div
                    ref={handleRef}
                    className='hud-zoom flex h-auto cursor-grab touch-none select-none items-center gap-2 border-b border-gold-line py-1 pl-3 pr-1 active:cursor-grabbing'
                    onClick={(event) => event.stopPropagation()}
                >
                    <span className='min-w-0 flex-1 break-words font-display text-sm font-semibold text-gold'>
                        {title}
                    </span>
                    <button
                        type='button'
                        aria-label='Close'
                        data-no-drag
                        className='tap-target relative flex size-7 items-center justify-center text-ink-dim hover:text-ink'
                        onClick={onCloseClick}
                    >
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                </div>
            )}
            {children}
        </div>,
        document.body
    );
};

// Stays mounted while it shrinks away, so a panel closes as smoothly as it opens
const MovablePanel = ({ open = true, ...props }) => {
    const [mounted, setMounted] = useState(open);
    if (open && !mounted) {
        setMounted(true);
    }

    const openRef = useRef(open);
    openRef.current = open;
    const onExited = React.useCallback(() => {
        if (!openRef.current) {
            setMounted(false);
        }
    }, []);

    return mounted ? <PanelBody open={open} onExited={onExited} {...props} /> : null;
};

export default MovablePanel;
