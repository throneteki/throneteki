import React, { useLayoutEffect, useRef, useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames';
import { createPortal } from 'react-dom';

import { motionOff } from '../../flip';
import { useDragMove } from './useDragMove';

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

    useLayoutEffect(() => {
        const panel = panelRef.current;
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

    const wrapperClass = classNames(
        className,
        'max-h-screen max-w-screen fixed top-0 left-0 flex flex-col border-primary bg-black/65 rounded-md overflow-hidden'
    );

    return createPortal(
        <div ref={panelRef} className={wrapperClass}>
            <div
                ref={handleRef}
                className='flex justify-end hud-zoom border-b-1 border-foreground border-transparent bg-primary p-1.5 text-center font-bold text-white opacity-100 h-auto touch-none cursor-grab select-none'
                onClick={(event) => event.stopPropagation()}
            >
                <span className='flex-1 text-center'>{title}</span>
                <span className='cursor-pointer' data-no-drag>
                    <a onClick={onCloseClick}>
                        <FontAwesomeIcon icon={faTimes} />
                    </a>
                </span>
            </div>
            {children}
        </div>,
        document.querySelector('[data-overlay-container="true"]')
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
