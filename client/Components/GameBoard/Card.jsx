import React, {
    memo,
    useState,
    useCallback,
    useContext,
    useEffect,
    useLayoutEffect,
    useMemo,
    useRef
} from 'react';
import classNames from 'classnames';
import { useDraggable } from '@dnd-kit/core';
import CardCounters from './CardCounters';
import SquishableCardPanel from './SquishableCardPanel';
import CardTiledList from './CardTiledList';
import Droppable from './Droppable';
import PopupContainer from './PopupContainer';

import { ItemTypes } from '../../constants';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { useUniqueId } from '@dnd-kit/utilities';
import { useCardHoverHandlers } from '../Images/CardHoverable';
import CardFace from '../Images/CardFace';
import { cardBoxClass } from '../../cardScale';
import { Tooltip } from '@heroui/react';
import { getActionRequirementReason, isNotableRequirement } from './actionRequirementReasons';
import { ManualModeContext } from './ManualModeContext';
import { useAdaptiveBoard } from './adaptiveContext';
import { useIsCarried, useIsUnderTarget } from './dragStore';
import { holdToDrag } from './HoldTouchSensor';
import { restingAngle } from '../../tableFeel';
import { motionOff, pulseCard } from '../../flip';
import { useRenderCount } from '../../perf';

const noDrag = {};

const CardView = ({
    card,
    className,
    disableHover,
    hideTokens,
    onClick,
    orientation = 'vertical',
    source,
    style,
    wrapped = true,
    flip = false,
    flipFrom,
    under = false,
    shell = false,
    forceFaceup = false,
    cardStackIndex = 200,
    drag = noDrag
}) => {
    useRenderCount('Card');
    const { attributes, listeners, setNodeRef, isDragging } = drag;
    const isCarried = useIsCarried(card?.uuid);
    const isUnderTarget = useIsUnderTarget(wrapped && source === 'play area' ? card?.uuid : null);
    const adaptive = useAdaptiveBoard();
    const [showUnderneath, setShowUnderneath] = useState(false);
    const cardRef = useRef(null);
    const [lastOrder, setLastOrder] = useState(card.order);
    if (card.order && card.order !== lastOrder) {
        setLastOrder(card.order);
    }

    // A card shown or hidden by tapping it turns over, rather than its face simply changing
    const wasForcedFaceup = useRef(forceFaceup);
    useLayoutEffect(() => {
        if (wasForcedFaceup.current === forceFaceup) {
            return;
        }
        wasForcedFaceup.current = forceFaceup;
        // The surface turns, not just the face, so the ring turns with it
        const surface = cardRef.current?.querySelector('[data-card-surface]');
        if (surface && !motionOff()) {
            surface.animate(
                [{ transform: 'perspective(700px) rotateY(90deg)' }, { transform: 'none' }],
                { duration: 180, easing: 'ease-out' }
            );
        }
    }, [forceFaceup]);
    const kneeled = !!card.kneeled;
    const wasKneeled = useRef(kneeled);
    useLayoutEffect(() => {
        if (wasKneeled.current !== kneeled) {
            wasKneeled.current = kneeled;
            pulseCard(cardRef.current);
        }
    }, [kneeled]);

    const dupeCards = useMemo(
        () => (card.dupes || []).map((dupe) => ({ ...dupe, facedown: card.facedown })),
        [card.dupes, card.facedown]
    );

    const hasUnderneathPopup = card.childCards?.length > 0 && card.type !== 'agenda';
    const hasSelectableUnderneath =
        hasUnderneathPopup && card.childCards.some((child) => child.selectable);

    useEffect(() => {
        if (hasSelectableUnderneath) {
            setShowUnderneath(true);
        }
    }, [hasSelectableUnderneath]);

    const shortNames = {
        count: 'x',
        stand: 'T',
        poison: 'O',
        gold: 'G',
        valarmorghulis: 'V',
        betrayal: 'B',
        vengeance: 'N',
        ear: 'E',
        venom: 'M',
        kiss: 'K',
        bell: 'L',
        blood: 'D',
        shadow: 'W',
        journey: 'J',
        prayer: 'R',
        tale: 'A',
        ghost: 'H'
    };

    const handleClick = useCallback(
        (event) => {
            event.preventDefault();
            event.stopPropagation();

            onClick && onClick(card);
        },
        [card, onClick]
    );

    const getCountersForCard = (card) => {
        const counters = [];
        if (card.power) {
            counters.push({ name: 'card-power', count: card.power, shortName: 'P' });
        }

        if (!card.facedown && source === 'play area') {
            if (card.type === 'character' && card.baseStrength !== card.strength) {
                counters.push({ name: 'strength', count: card.strength, shortName: 'S' });
            }

            if (card.dupes && card.dupes.length > 0) {
                counters.push({ name: 'dupe', count: card.dupes.length, shortName: 'D' });
            }

            for (const icon of card.iconsAdded || []) {
                counters.push({ name: 'challenge-icon', icon, count: 0, cancel: false });
            }

            for (const icon of card.iconsRemoved || []) {
                counters.push({ name: 'challenge-icon', icon, count: 0, cancel: true });
            }

            for (const item of card.factionStatus || []) {
                counters.push({
                    name: 'faction',
                    icon: item.faction,
                    count: 0,
                    cancel: item.status === 'lost'
                });
            }
        }

        for (const [key, token] of Object.entries(card.tokens || {})) {
            counters.push({ name: key, count: token, shortName: shortNames[key] });
        }

        for (const attachment of card.attachments || []) {
            let attachmentCounters = getCountersForCard(attachment).map((counter) =>
                Object.assign({ fade: true }, counter)
            );
            counters.push(...attachmentCounters);
        }

        return counters.filter((counter) => counter.count >= 0);
    };

    const getAttachments = () => {
        if (source !== 'play area') {
            return null;
        }

        return card.attachments.map((attachment) => {
            return (
                <Card
                    key={attachment.uuid}
                    cardStackIndex={cardStackIndex--}
                    source={source}
                    card={attachment}
                    className='card-attachment'
                    wrapped={false}
                    hideTokens
                    onClick={onClick}
                    flip={flip}
                />
            );
        });
    };

    const getDupes = () => {
        if (source !== 'play area') {
            return null;
        }

        return dupeCards.map((dupe) => {
            return (
                <Card
                    key={dupe.uuid}
                    className='card-duplicate'
                    source={source}
                    card={dupe}
                    wrapped={false}
                    onClick={onClick}
                    flip={flip}
                    facedown={forceFaceup ? false : card.facedown}
                    hideTokens
                />
            );
        });
    };

    const getUnderneath = () => {
        // TODO: Right now it is assumed that all cards in the childCards array
        // are being placed underneath the current card. In the future there may
        // be other types of cards in this array and it should be filtered.
        const underneathCards = card.childCards;
        if (!underneathCards || underneathCards.length === 0 || card.type === 'agenda') {
            return null;
        }

        const maxCards = 1 + (underneathCards.length - 1) / 6;
        return (
            // Using attachment class as to ensure underneath cards are visually shown underneath the stack
            // Attachments & card zIndex's consider these underneath cards to ensure this is rendered at bottom of attachment stack
            <div className='relative card-attachment' style={{ zIndex: cardStackIndex-- }}>
                <SquishableCardPanel
                    cards={underneathCards}
                    className='underneath'
                    maxCards={maxCards}
                    onCardClick={onClick}
                    source='underneath'
                />
            </div>
        );
    };

    const getUnderneathBadge = () => {
        if (!hasUnderneathPopup) {
            return null;
        }

        return (
            <button
                type='button'
                data-card-overlay=''
                data-sheet-opener=''
                title='Cards underneath'
                className='pointer-events-auto tap-target absolute bottom-1 right-1 z-[230] card-text [--badge-size:calc(var(--ui-scale,1)*1.5rem)] min-w-[var(--badge-size)] h-[var(--badge-size)] px-1 text-white bg-black/80 font-bold text-center rounded-md border-1'
                onClick={(event) => {
                    event.stopPropagation();
                    setShowUnderneath(!showUnderneath);
                }}
            >
                {card.childCards.length}
            </button>
        );
    };

    const getUnderneathPopup = () => {
        if (!hasUnderneathPopup) {
            return null;
        }

        // Facedown cards the viewer may see (their own) arrive with a code; show those face up here.
        const cards = card.childCards.map((child) =>
            child.code ? { ...child, facedown: false } : child
        );

        return (
            <PopupContainer
                id={card.uuid}
                open={!!showUnderneath}
                anchorRef={cardRef}
                title={`Underneath ${card.name || 'card'}`}
                name='underneath'
                onCloseClick={() => setShowUnderneath(false)}
                onOpen={() => setShowUnderneath(true)}
                side='bottom'
            >
                <div
                    data-pile-popup=''
                    className='flex flex-col box-content border-1 border-default-200 bg-black/75 rounded-b-md overflow-hidden'
                    onClick={(event) => event.stopPropagation()}
                >
                    <Droppable
                        source='underneath'
                        parentUuid={card.uuid}
                        popup
                        className='overflow-auto'
                    >
                        <CardTiledList
                            cards={cards}
                            numColumns={Math.min(cards.length, 5)}
                            numRows={1.2}
                            onCardClick={onClick}
                            source='underneath'
                            flip
                        />
                    </Droppable>
                </div>
            </PopupContainer>
        );
    };

    const getCardOrder = () => {
        const badgeClassName =
            'absolute top-0 left-0 z-[230] flex items-center justify-center card-text [--badge-size:calc(var(--ui-scale,1)*1.5rem)] min-w-[calc(var(--badge-size)*0.8)] h-[var(--badge-size)] px-0.5 text-white bg-black/90 font-bold rounded-br-md rounded-tl-[inherit]';
        if (!adaptive) {
            return card.order ? (
                <div data-card-overlay='' className={badgeClassName}>
                    {card.order}
                </div>
            ) : null;
        }

        // Always rendered so it can fade, keeping its last number while it fades out
        return (
            <div
                data-card-overlay=''
                aria-hidden={!card.order}
                className={classNames(badgeClassName, 'order-fade pointer-events-none', {
                    'opacity-0': !card.order
                })}
            >
                {card.order || lastOrder}
            </div>
        );
    };

    const getAlertStatus = () => {
        if (!card.alertStatus) {
            return null;
        }
        const iconClass = classNames('animate-pulse', {
            'text-warning': card.alertStatus.type === 'warning',
            'text-danger': card.alertStatus.type === 'error'
        });
        const content = <span className='select-none'>{card.alertStatus.message}</span>;
        return (
            <div className='absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[200]'>
                <Tooltip content={content} showArrow={true}>
                    <FontAwesomeIcon className={iconClass} icon={faExclamationCircle} />
                </Tooltip>
            </div>
        );
    };

    // One ring at a time, the most important first
    const getHighlightClass = () => {
        if (card.selected) {
            return 'ring-selected';
        }
        if (card.selectable) {
            return 'ring-selectable';
        }
        if (card.inChallenge) {
            return 'ring-participating';
        }
        if (card.inDanger) {
            return 'ring-danger';
        }
        if (card.saved) {
            return 'ring-saved';
        }
        if (card.isContributing) {
            return 'ring-contributing';
        }
        if (card.stealth || card.assault) {
            return 'ring-keyword';
        }
        if (card.controlled) {
            return 'ring-controlled';
        }
        if (card.new) {
            return 'ring-new';
        }
    };
    const isFaceup = forceFaceup || (!card.facedown && card.code);
    const availabilityNotes = useMemo(
        () =>
            isFaceup
                ? [
                      ...(card.unavailableActions || []).map((action) => ({
                          ...action,
                          label: 'Unavailable'
                      })),
                      ...(card.unavailableTriggers || []).map((trigger) => ({
                          ...trigger,
                          label: 'Did not resolve'
                      }))
                  ]
                      .filter((note) => isNotableRequirement(note.reason))
                      .map((note) => ({
                          ...note,
                          reason: getActionRequirementReason(note.reason)
                      }))
                : [],
        [isFaceup, card.unavailableActions, card.unavailableTriggers]
    );

    const { handlers: hoverHandlers, touchActive } = useCardHoverHandlers({
        code: card.code,
        notes: availabilityNotes,
        isDisabled: !!disableHover || isDragging,
        touchDelay: holdToDrag.hold
    });
    const previewRef = hoverHandlers.ref;
    const surfaceRef = useCallback(
        (element) => {
            setNodeRef?.(element);
            previewRef(element);
        },
        [setNodeRef, previewRef]
    );

    // Handles the rotating of knelt or horizontally placed vertical cards (eg. dead pile)
    const isRotated =
        !!card && ((card.type !== 'plot' && orientation === 'horizontal') || card.kneeled);

    const resting = restingAngle(card?.uuid, source) || undefined;

    const getCard = () => {
        if (!card) {
            return <div />;
        }

        const isInteractive = card.selectable || card.selected || card.canPlay;
        const cardClassName = classNames(
            'relative pointer-events-auto touch-manipulation card-turn',
            cardBoxClass(isRotated ? 'rotated' : orientation),
            getHighlightClass(),
            {
                'brightness-[.75] saturate-[.5]':
                    card.unselectable ||
                    (card.canPlay === false && !card.selected && !card.selectable),
                // A card that does something when clicked says so, even where it can also be dragged
                'cursor-grabbing': isDragging,
                'cursor-pointer': !isDragging && isInteractive,
                'cursor-grab': !isDragging && !!listeners && !isInteractive,
                'cursor-not-allowed':
                    !isDragging && !listeners && !isInteractive && card.unselectable,
                'select-none': touchActive
            }
        );
        const imageCode = isFaceup
            ? card.code
            : source === 'shadows'
              ? 'cardback_shadow'
              : 'cardback';
        const slotClassName = classNames(
            'relative pointer-events-none transition-[width,height,margin]',
            cardBoxClass(orientation === 'vertical' && card.kneeled ? 'kneeled' : orientation),
            className,
            { invisible: shell || isDragging || isCarried }
        );
        return (
            <div
                className={slotClassName}
                ref={cardRef}
                data-flip-slot={flip && wrapped ? '' : undefined}
                data-flip={flip && !wrapped ? card.uuid : undefined}
                data-flip-source={flip && !wrapped ? 'attached' : undefined}
                data-flip-z={flip && !wrapped ? cardStackIndex : undefined}
                data-flip-rot={flip && !wrapped ? (isRotated ? 90 : 0) : undefined}
            >
                <div
                    {...listeners}
                    {...attributes}
                    {...hoverHandlers}
                    ref={surfaceRef}
                    data-card-surface=''
                    data-pressed={card.pressed ? '' : undefined}
                    className={cardClassName}
                    onClick={handleClick}
                    style={{ zIndex: cardStackIndex--, rotate: resting }}
                >
                    <div data-card-body='' className='card-body'>
                        <CardFace
                            code={imageCode}
                            type={card.type}
                            orientation={card.type === 'plot' ? 'horizontal' : 'vertical'}
                        />
                        {isFaceup && getAlertStatus()}
                    </div>
                    {/* On the card's surface, so it pops and turns with the card when chosen */}
                    {getCardOrder()}
                </div>
                {!hideTokens && (
                    <CardCounters cardUuid={card.uuid} counters={getCountersForCard(card)} />
                )}
                {isUnderTarget && (
                    <div
                        data-card-overlay=''
                        className='under-target pointer-events-none absolute inset-0 z-[235] flex items-end justify-center'
                    >
                        <div className='absolute inset-0 rounded-md bg-success-500 opacity-50' />
                        <span className='relative mb-1 rounded-md bg-black/40 px-1 py-0.5 text-center text-xs leading-tight'>
                            Place underneath
                        </span>
                    </div>
                )}
                {getUnderneathBadge()}
                {getUnderneathPopup()}
            </div>
        );
    };

    const wrapperClass = classNames('inline-block select-none', {
        absolute: !!style?.left,
        relative: !style?.left
    });

    return wrapped ? (
        <div
            className={wrapperClass}
            style={style}
            data-flip={flip && !shell ? card.uuid : undefined}
            data-flip-from={flip ? flipFrom : undefined}
            data-flip-source={flip ? source : undefined}
            data-flip-under={flip && under ? (under === true ? '' : under) : undefined}
            data-flip-rot={flip ? (isRotated ? 90 : 0) : undefined}
        >
            {getDupes()}
            {getCard()}
            {getAttachments()}
            {getUnderneath()}
        </div>
    ) : (
        getCard()
    );
};

const DraggableCard = (props) => {
    const { card, orientation, source, dragDisabled } = props;
    const key = `card-${card.uuid}-${source}`;
    const drag = useDraggable({
        id: useUniqueId(key),
        disabled: !!dragDisabled,
        data: { type: ItemTypes.CARD, card, orientation, source, key }
    });

    return <CardView {...props} drag={drag} />;
};

const shallowEqualStyle = (a, b) => {
    if (a === b) {
        return true;
    }
    if (!a || !b) {
        return false;
    }
    const keys = Object.keys(a);
    return keys.length === Object.keys(b).length && keys.every((key) => Object.is(a[key], b[key]));
};

const propsEqual = (previous, next) => {
    const keys = Object.keys(previous);
    return (
        keys.length === Object.keys(next).length &&
        keys.every((key) =>
            key === 'style'
                ? shallowEqualStyle(previous.style, next.style)
                : Object.is(previous[key], next[key])
        )
    );
};

const Card = memo(function Card(props) {
    const manualMode = useContext(ManualModeContext);

    return manualMode ? <DraggableCard {...props} /> : <CardView {...props} />;
}, propsEqual);

export default Card;
