import React, {
    createContext,
    forwardRef,
    useCallback,
    useContext,
    useEffect,
    useId,
    useLayoutEffect,
    useMemo,
    useRef,
    useState
} from 'react';
import { createPortal } from 'react-dom';
import { useSyncExternalStore } from 'react';
import classNames from 'classnames';
import { raisedStyle } from './PileDepth';

// How areas show their label: 'full' on the area; 'inspect' (phones) only on a first tap on a stacked pile
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
            <span data-inspect-hint='' className='text-[10px] leading-tight text-ink-dim'>
                Tap again to open
            </span>
        )}
    </div>
);

const edgeGap = 8;

// The inspected pile's name, above it, or below it when there is no room above, and kept on the screen
const InspectTip = ({ anchor, children }) => {
    const tipRef = useRef(null);
    const [place, setPlace] = useState(null);

    useLayoutEffect(() => {
        const area = anchor.current?.getBoundingClientRect();
        const tip = tipRef.current?.getBoundingClientRect();
        if (!area || !tip) {
            return;
        }
        const below = area.top - tip.height - edgeGap < 0;
        const centre = area.left + area.width / 2;
        const left = Math.min(
            Math.max(centre - tip.width / 2, edgeGap),
            window.innerWidth - tip.width - edgeGap
        );
        setPlace({ left, top: below ? area.bottom + 6 : area.top - tip.height - 6 });
    }, [anchor]);

    return createPortal(
        <div
            ref={tipRef}
            role='tooltip'
            className='hud-zoom pointer-events-none fixed z-[400] whitespace-nowrap border border-gold-line bg-panel/95 px-2 py-1 text-ink'
            style={place ? { left: place.left, top: place.top } : { left: 0, top: 0, opacity: 0 }}
        >
            {children}
        </div>,
        document.body
    );
};

// An area's outline. It has the same corners as the cards in it, and its name lies faintly behind it, where a card put there would go.
export const AreaBackground = ({ name, upright = false, className }) => {
    return (
        <div
            className={classNames(
                'absolute h-full w-full',
                'flex items-center justify-center overflow-hidden rounded-[calc(var(--card-scale,1)*0.25rem)] border border-white/5 bg-black/45',
                className
            )}
        >
            {name && (
                <span
                    className={classNames(
                        'select-none overflow-hidden whitespace-nowrap text-center text-[calc(var(--card-scale,1)*0.55rem)] font-semibold leading-none text-white/30',
                        upright
                            ? 'max-h-[90%] rotate-180 [writing-mode:vertical-rl]'
                            : 'max-w-[90%]'
                    )}
                >
                    {name}
                </span>
            )}
        </div>
    );
};

// inspectable: a stacked pile shown by a first tap on phones. inspectSkip: tapped through as usual (its top card is
// to be used). opens: a second tap opens the pile. slotLabel: the faint name behind the area, if not its label.
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
            labelClickable ? 'cursor-pointer hover:bg-panel/90' : 'pointer-events-none',
            pos
        );
        return (
            <div data-area-label='' className={labelClassName} style={raisedStyle}>
                {label}
            </div>
        );
    }, [label, labelClickable, position, inspectMode]);

    const areaRef = useRef(null);
    const setAreaRef = useCallback(
        (node) => {
            areaRef.current = node;
            if (typeof ref === 'function') {
                ref(node);
            } else if (ref) {
                ref.current = node;
            }
        },
        [ref]
    );

    const areaClassName = classNames('relative shift-smooth', className);
    const background = !disableBackground && (
        <AreaBackground name={slotLabel ?? (label && nameOf(label))} upright={upright} />
    );
    const area = (
        <div
            ref={setAreaRef}
            className={areaClassName}
            onClick={onClick}
            onClickCapture={onClickCapture}
            style={style}
            data-labelled-area=''
            data-board-surface=''
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
    return (
        <>
            {area}
            {shown && (
                <InspectTip anchor={areaRef}>
                    <InspectLabel label={shown.label} count={shown.count} opens={opens} />
                </InspectTip>
            )}
        </>
    );
});

export default LabelledGameArea;
