import React, { createContext, forwardRef, useContext, useEffect, useId, useMemo } from 'react';
import { useSyncExternalStore } from 'react';
import classNames from 'classnames';
import { raisedStyle } from './PileDepth';
import { useAdaptiveBoard } from './adaptiveContext';
import { Tooltip } from '@heroui/react';

// How areas show their label: 'full' writes the name and count on the area (the classic board, and the adaptive
// board on a large screen). 'inspect' (phone layouts) shows nothing on the area: the first tap on a stacked pile
// shows its name and count above the tap instead, and the next tap anywhere, or a moment, puts it away.
export const AreaLabelContext = createContext('full');

const inspectTime = 2500;

const nameOf = (label) => label.replace(/ \(\d+\)$/, '');

// Only one pile is inspected at a time
let inspecting = null;
let inspectTimer = null;
const listeners = new Set();
const setInspecting = (next) => {
    inspecting = next;
    clearTimeout(inspectTimer);
    if (next) {
        inspectTimer = setTimeout(() => setInspecting(null), inspectTime);
    }
    listeners.forEach((listener) => listener());
};
const subscribe = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
};
const useInspecting = () => useSyncExternalStore(subscribe, () => inspecting);

// A pile's name and count as a phone shows them when it is tapped. name: what to call it, when not its label.
// opens: a second tap opens the pile, which it says beneath.
export const InspectLabel = ({ label, count, name, opens = false }) => (
    <div className='flex flex-col items-center'>
        <div className='flex items-center gap-1.5 text-xs font-semibold'>
            <span>{name ?? label}</span>
            <span className='text-warning'>{count}</span>
        </div>
        {opens && (
            <span data-inspect-hint='' className='text-[10px] leading-tight text-default-400'>
                Tap again to open
            </span>
        )}
    </div>
);

// inspectable: a stacked pile whose count cannot be seen by looking at it, which on phones shows its name and count
// on a first tap. inspectSkip: a pile whose top card is to be used straight away is tapped through as usual.
// opens: a second tap opens the pile. slotLabel: the name drawn faintly behind the area (adaptive board) where it
// has no label, or a different one.
const LabelledGameArea = forwardRef(function LabelledGameArea(
    {
        label,
        slotLabel,
        count,
        inspectable = false,
        inspectSkip = false,
        opens = false,
        upright = false,
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
    const adaptive = useAdaptiveBoard();
    const inspectMode = labelStyle === 'inspect';
    const key = useId();
    const current = useInspecting();
    const shown = inspectMode && current?.key === key ? current : null;

    // The next tap anywhere else puts the label away
    useEffect(() => {
        if (!shown) {
            return;
        }
        const away = (event) => {
            if (!event.target.closest?.(`[data-inspect-key="${CSS.escape(key)}"]`)) {
                setInspecting(null);
            }
        };
        document.addEventListener('pointerdown', away, true);
        return () => document.removeEventListener('pointerdown', away, true);
    }, [shown, key]);
    useEffect(() => () => inspecting?.key === key && setInspecting(null), [key]);

    const onClickCapture =
        inspectMode && inspectable && label && !inspectSkip
            ? (event) => {
                  // React passes events up from portals (the pile's own sheet) too; only a tap on the pile counts
                  if (!event.currentTarget.contains(event.target)) {
                      return;
                  }
                  if (shown) {
                      setInspecting(null);
                      return;
                  }
                  event.preventDefault();
                  event.stopPropagation();
                  setInspecting({ key, label: nameOf(label), count: count ?? '' });
              }
            : undefined;

    const areaLabel = useMemo(() => {
        if (!label || inspectMode) {
            return null;
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
    }, [label, labelClickable, position, inspectMode]);

    const areaClassName = classNames('relative shift-smooth', className);
    // On the adaptive board an area's outline has the same corners as the cards in it, and its name lies faintly
    // behind it, where a card put there would go
    const background = !disableBackground && (
        <div
            className={classNames(
                'absolute w-full h-full',
                adaptive
                    ? 'flex items-center justify-center overflow-hidden rounded-[calc(var(--card-scale,1)*0.25rem)] border border-default-100/50 bg-black/45'
                    : 'border-2 border-default-100/55 bg-black/55 rounded-md'
            )}
        >
            {adaptive && (slotLabel || label) && (
                <span
                    className={classNames(
                        'select-none overflow-hidden whitespace-nowrap text-center text-[calc(var(--card-scale,1)*0.55rem)] font-semibold uppercase leading-none tracking-wider text-white/30',
                        upright
                            ? 'max-h-[90%] rotate-180 [writing-mode:vertical-rl]'
                            : 'max-w-[90%]'
                    )}
                >
                    {slotLabel ?? nameOf(label)}
                </span>
            )}
        </div>
    );
    const area = (
        <div
            ref={ref}
            className={areaClassName}
            onClick={onClick}
            onClickCapture={onClickCapture}
            style={style}
            data-inspect-key={inspectMode && inspectable ? key : undefined}
            title={inspectMode && label && !inspectable ? nameOf(label) : undefined}
            {...rest}
        >
            {background}
            {children}
            {areaLabel}
        </div>
    );
    if (!(inspectMode && inspectable)) {
        return area;
    }
    // Kept on the screen, flipping below the pile when there is no room above it
    return (
        <Tooltip
            isOpen={!!shown}
            content={
                shown ? (
                    <InspectLabel label={shown.label} count={shown.count} opens={opens} />
                ) : null
            }
            placement='top'
            showArrow
            shouldFlip
            classNames={{ content: 'hud-zoom bg-black/90 border border-default-300' }}
        >
            {area}
        </Tooltip>
    );
});

export default LabelledGameArea;
