import React, { memo, useState, useCallback, useContext, useEffect, useMemo, useRef } from 'react';
import classNames from 'classnames';
import { useDraggable } from '@dnd-kit/core';
import CardCounters from './CardCounters';
import SquishableCardPanel from './SquishableCardPanel';
import CardTiledList from './CardTiledList';
import MovablePanel from './MovablePanel';

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
import { useIsCarried } from './dragStore';
import { useRenderCount } from '../../perf';

// Opening one card menu closes any other that is open.
const cardMenus = new EventTarget();
let nextMenuId = 0;

const defaultMenu = [{ hideable: true, command: 'click', text: 'Select Card' }];
const noDrag = {};

const CardView = ({
    card,
    className,
    disableHover,
    hideTokens,
    menu = defaultMenu,
    onClick,
    orientation = 'vertical',
    source,
    style,
    wrapped = true,
    flip = false,
    flipFrom,
    shell = false,
    forceFaceup = false,
    cardStackIndex = 200,
    drag = noDrag
}) => {
    useRenderCount('Card');
    const { attributes, listeners, setNodeRef, isDragging } = drag;
    const isCarried = useIsCarried(card?.uuid);
    const [showUnderneath, setShowUnderneath] = useState(false);
    const cardRef = useRef(null);

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

    const isAllowedMenuSource = useCallback(
        () => ['play area', 'agenda', 'revealed plots'].includes(source),
        [source]
    );

    const handleMenuItemClick = useCallback(
        (menuItem) => {
            if (onMenuItemClick) {
                onMenuItemClick(card, menuItem);
                setShowMenu(!showMenu);
            }
        },
        [card, onMenuItemClick, showMenu]
    );

    const getMenu = useCallback(() => {
        const retMenu = [...menu] || [];

        if (card.menu) {
            retMenu.push(...card.menu);
        }

        return retMenu;
    }, [card.menu, menu]);

    const shouldShowMenu = useCallback(
        () =>
            getMenu().some((item) => item.command !== 'click' && !item.disabled) &&
            isAllowedMenuSource(),
        [getMenu, isAllowedMenuSource]
    );

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
                title='Cards underneath'
                className='pointer-events-auto absolute bottom-1 right-1 z-[230] card-text [--badge-size:calc(var(--ui-scale,1)*1.5rem)] min-w-[var(--badge-size)] h-[var(--badge-size)] px-1 text-white bg-black/80 font-bold text-center rounded-md border-1'
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
        if (!hasUnderneathPopup || !showUnderneath) {
            return null;
        }

        // Facedown cards the viewer may see (their own) arrive with a code; show those face up here.
        const cards = card.childCards.map((child) =>
            child.code ? { ...child, facedown: false } : child
        );

        return (
            <MovablePanel
                id={card.uuid}
                anchorRef={cardRef}
                title={`Underneath ${card.name || 'card'}`}
                name='underneath'
                onCloseClick={() => setShowUnderneath(false)}
                side='bottom'
            >
                <div
                    className='flex flex-col box-content border-1 border-default-200 bg-black/75 rounded-b-md overflow-hidden'
                    onClick={(event) => event.stopPropagation()}
                >
                    <CardTiledList
                        cards={cards}
                        numColumns={Math.min(cards.length, 5)}
                        numRows={1.2}
                        onCardClick={onClick}
                        onMenuItemClick={onMenuItemClick}
                        source='underneath'
                    />
                </div>
            </MovablePanel>
        );
    };

    const getCardOrder = () => {
        if (!card.order) {
            return null;
        }

        return (
            <div className='absolute top-0 left-0 z-[230] flex items-center justify-center card-text [--badge-size:calc(var(--ui-scale,1)*1.5rem)] min-w-[calc(var(--badge-size)*0.8)] h-[var(--badge-size)] px-0.5 text-white bg-black/90 font-bold rounded-br-md rounded-tl-[inherit]'>
                {card.order}
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

    // Need to get classes in priority, as tailwind is not consistent in CSS priority
    const getHighlightClass = () => {
        if (card.selected) {
            return 'shadow-[0_0_0_3px] shadow-sky-400';
        }
        if (card.selectable) {
            return 'shadow-[0_0_3px_3px] shadow-green-400';
        }
        if (card.inChallenge) {
            return 'shadow-[0_0_1px_2px] shadow-red-500';
        }
        if (card.inDanger) {
            return 'shadow-[0_0_1px_2px] shadow-red-900';
        }
        if (card.saved) {
            return 'shadow-[0_0_1px_2px] shadow-green-500';
        }
        if (card.isContributing) {
            return 'shadow-[0_0_1px_2px] shadow-orange-200';
        }
        if (card.stealth || card.assault) {
            return 'shadow-[0_0_1px_2px] shadow-orange-800';
        }
        if (card.controlled) {
            return 'shadow-[0_0_1px_2px] shadow-yellow-300';
        }
        if (card.new) {
            return 'shadow-[0_0_1px_2px] shadow-blue-100';
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
        isDisabled: !!disableHover || isDragging || showMenu,
        touchDelay: 250
    });

    // Handles the rotating of knelt or horizontally placed vertical cards (eg. dead pile)
    const isRotated =
        !!card && ((card.type !== 'plot' && orientation === 'horizontal') || card.kneeled);

    const getCard = () => {
        if (!card) {
            return <div />;
        }

        const isInteractive = card.selectable || card.canPlay;
        const cardClassName = classNames(
            'relative overflow-hidden pointer-events-auto touch-none transition-[transform,box-shadow,filter]',
            cardBoxClass(isRotated ? 'rotated' : orientation),
            getHighlightClass(),
            {
                'brightness-[.75] saturate-[.5]':
                    card.unselectable ||
                    (card.canPlay === false && !card.selected && !card.selectable),
                'cursor-grabbing': isDragging,
                'cursor-grab': !isDragging && !!listeners,
                'cursor-pointer': !isDragging && !listeners && isInteractive,
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
                    ref={setNodeRef}
                    data-card-surface=''
                    className={cardClassName}
                    onClick={handleClick}
                    style={{ zIndex: cardStackIndex-- }}
                >
                    {card.name && <span className='absolute left-0 top-0'>{card.name}</span>}
                    <CardFace code={imageCode} />
                    {isFaceup && getAlertStatus()}
                </div>
                {!hideTokens && <CardCounters counters={getCountersForCard(card)} />}
                {showMenu && (
                    <div className='contents pointer-events-auto'>
                        <CardMenu menu={getMenu()} onMenuItemClick={handleMenuItemClick} />
                    </div>
                )}
                {getCardOrder()}
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
    const { card, orientation, source } = props;
    const key = `card-${card.uuid}-${source}`;
    const drag = useDraggable({
        id: useUniqueId(key),
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
