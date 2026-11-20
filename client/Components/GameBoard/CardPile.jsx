import React, {
    useState,
    useEffect,
    useLayoutEffect,
    useCallback,
    useContext,
    useMemo,
    useRef
} from 'react';
import classNames from 'classnames';
import { useRenderCount } from '../../perf';

import Card from './Card';
import CardTiledList from './CardTiledList';
import Droppable from './Droppable';
import PopupContainer, { PopupHostContext } from './PopupContainer';
import { sheetStore } from './Adaptive/sheetStore';
import PileDepth, { pileRise, raisedStackStyle } from './PileDepth';
import LabelledGameArea from './LabelledGameArea';

import { Button } from '@heroui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { cardBoxClass } from '../../cardScale';
import { registerPile } from '../../flip';

const CardPile = ({
    cards,
    disablePopup,
    disableBackground = false,
    onPopupChange,
    source,
    onCardClick: propsOnCardClick,
    topCard,
    closeOnClick,
    disableHover,
    numColumns,
    numRows,
    popupMenu,
    title,
    titlePosition,
    playerName,
    popupLocation = 'bottom',
    popupId,
    className,
    style,
    cardCount,
    orientation = 'vertical',
    hiddenTopCard,
    hideUnderCard,
    showCards,
    selected,
    flipDeck,
    flipFrom,
    lockTopCard,
    showDepth,
    owner,
    slotLabel
}) => {
    useRenderCount('CardPile');
    const [showPopup, setShowPopup] = useState(cards && cards.some((card) => card.selectable));
    const prevCards = useRef(cards);
    const areaRef = useRef(null);

    useLayoutEffect(
        () =>
            registerPile(`${popupId || ''}:${source}`, {
                el: areaRef.current,
                source,
                hidden: !!hiddenTopCard,
                covered: !!topCard,
                sideways: orientation === 'horizontal',
                uuids: new Map((cards || []).map((card, index) => [card.uuid, index])),
                codes: new Map(
                    (cards || [])
                        .filter((card) => card.code && !card.facedown)
                        .map((card) => [card.uuid, card.code])
                )
            }),
        [cards, popupId, source, hiddenTopCard, orientation, topCard]
    );

    const isTopCardSelectable = useMemo(() => {
        if (!topCard) {
            return false;
        }

        return topCard.selectable && (!cards || cards.every((card) => card.unselectable));
    }, [cards, topCard]);

    const topCardHasAction = !!(topCard?.selectable || topCard?.canPlay);

    // Where piles open in sheets, every pile that can be opened is listed in them, to go to from any other
    const usesSheets = useContext(PopupHostContext) === 'sheet';
    const openRef = useRef(null);
    const hasSelectable = !!cards?.some((card) => card.selectable);
    useEffect(() => {
        if (!usesSheets || disablePopup || !title) {
            return;
        }
        return sheetStore.register({
            id: `${source}:${popupId ?? popupLocation}`,
            player: owner ?? playerName,
            side: popupLocation,
            source,
            title,
            selectable: hasSelectable,
            open: () => openRef.current?.()
        });
    }, [
        usesSheets,
        disablePopup,
        title,
        source,
        popupId,
        playerName,
        owner,
        popupLocation,
        hasSelectable
    ]);

    const updatePopupVisibility = useCallback(
        (value) => {
            setShowPopup(value);

            if (onPopupChange) {
                onPopupChange({ source: source, visible: value });
            }
        },
        [onPopupChange, source]
    );

    openRef.current = () => updatePopupVisibility(true);

    const onCollectionClick = useCallback(
        (event) => {
            event.preventDefault();

            if (!disablePopup) {
                updatePopupVisibility(!showPopup);
            }
        },
        [showPopup, updatePopupVisibility, disablePopup]
    );

    const onTopCardClick = useCallback(() => {
        if (disablePopup || isTopCardSelectable || topCardHasAction) {
            if (propsOnCardClick && topCard) {
                propsOnCardClick(topCard);
            }

            return;
        }

        updatePopupVisibility(!showPopup);
    }, [
        showPopup,
        disablePopup,
        isTopCardSelectable,
        topCardHasAction,
        propsOnCardClick,
        topCard,
        updatePopupVisibility
    ]);

    const onCloseClick = useCallback(
        (event) => {
            event.preventDefault();
            event.stopPropagation();

            updatePopupVisibility(!showPopup);
        },
        [showPopup, updatePopupVisibility]
    );

    const onCardClick = useCallback(
        (card) => {
            if (closeOnClick) {
                updatePopupVisibility(false);
            }

            if (propsOnCardClick) {
                propsOnCardClick(card);
            }
        },
        [closeOnClick, propsOnCardClick, updatePopupVisibility]
    );

    const onPopupMenuItemClick = useCallback(
        (menuItem) => {
            if (menuItem.handler) {
                menuItem.handler();
            }

            if (menuItem.close) {
                updatePopupVisibility(!showPopup);
            }
        },
        [showPopup, updatePopupVisibility]
    );

    useEffect(() => {
        const hasNewSelectableCard = cards && cards.some((card) => card.selectable);
        const didHaveSelectableCard =
            prevCards.current && prevCards.current.some((card) => card.selectable);

        if (!didHaveSelectableCard && hasNewSelectableCard) {
            updatePopupVisibility(true);
        } else if (didHaveSelectableCard && !hasNewSelectableCard) {
            updatePopupVisibility(false);
        }

        prevCards.current = cards;
    }, [cards, updatePopupVisibility]);

    const getPopup = useCallback(() => {
        let cardList = [];

        const listProps = {
            disableHover: disableHover,
            onCardClick: onCardClick,
            source: source,
            numColumns,
            numRows,
            flip: true
        };

        if (cards && cards.some((card) => card.group)) {
            const cardGroup = cards.reduce((grouping, card) => {
                (grouping[card.group] = grouping[card.group] || []).push(card);

                return grouping;
            }, {});
            const sortedKeys = Object.keys(cardGroup).sort();
            for (const key of sortedKeys) {
                cardList.push(
                    <CardTiledList
                        cards={cardGroup[key]}
                        key={key}
                        title={key}
                        {...listProps}
                        showCards={showCards}
                    />
                );
            }
        } else {
            cardList = <CardTiledList cards={cards} {...listProps} showCards={showCards} />;
        }

        if (disablePopup) {
            return null;
        }

        const popupClass = classNames(
            'flex flex-col box-content border-1 border-default-200 bg-black/75 rounded-b-md overflow-hidden'
        );

        const retPopupMenu = popupMenu && (
            <div className='flex gap-1.5 p-2'>
                {popupMenu.map((menuItem, index) => {
                    return (
                        <Button
                            color='primary'
                            className='flex-1'
                            key={index}
                            onPress={() => onPopupMenuItemClick(menuItem)}
                            startContent={<FontAwesomeIcon icon={menuItem.icon} />}
                        >
                            {menuItem.text}
                        </Button>
                    );
                })}
            </div>
        );

        return (
            <PopupContainer
                id={popupId}
                open={!!showPopup}
                anchorRef={areaRef}
                title={playerName ? `${playerName}'s ${title}` : title}
                pileTitle={title}
                playerName={owner ?? playerName}
                name={source}
                onCloseClick={onCloseClick}
                onOpen={() => updatePopupVisibility(true)}
                prompting={!!cards?.some((card) => card.selectable)}
                side={popupLocation}
            >
                <div
                    data-pile-popup=''
                    className={popupClass}
                    onClick={(event) => event.stopPropagation()}
                >
                    {retPopupMenu}
                    <Droppable source={source} popup className='overflow-auto'>
                        {cardList}
                    </Droppable>
                </div>
            </PopupContainer>
        );
    }, [
        disableHover,
        onCardClick,
        source,
        numColumns,
        numRows,
        cards,
        disablePopup,
        showPopup,
        popupMenu,
        playerName,
        title,
        onCloseClick,
        popupLocation,
        popupId,
        showCards,
        onPopupMenuItemClick,
        updatePopupVisibility,
        owner
    ]);

    // A sideways card is laid out as an upright one, so the area is held to the height of a sideways card
    const retCardCount = cardCount || (cards ? cards.length : 0);
    const rise = showDepth ? pileRise(retCardCount) : undefined;
    const areaStyle = useMemo(
        () => ({
            ...(orientation === 'horizontal' && { height: 'calc(var(--card-scale, 1) * 4rem)' }),
            ...(rise && { '--pile-rise': rise }),
            ...style
        }),
        [orientation, style, rise]
    );
    const retClassName = classNames('flex w-fit h-fit', className, {
        'cursor-pointer': !disablePopup
    });

    const headerText = title ? title + ' (' + retCardCount + ')' : '';
    const shownTopCard = topCard || (cards ? cards[0] : null);
    const hiddenUuid = shownTopCard?.uuid;
    const hiddenUnselectable = shownTopCard?.unselectable;
    const retTopCard = useMemo(
        () =>
            shownTopCard && hiddenTopCard
                ? {
                      facedown: true,
                      selected,
                      uuid: hiddenUuid,
                      unselectable: hiddenUnselectable
                  }
                : shownTopCard,
        [shownTopCard, hiddenTopCard, selected, hiddenUuid, hiddenUnselectable]
    );

    // A pile with cards to choose in it, while they are not on show, breathes as a card to choose does; a top card
    // that can be chosen already does
    const pileChoose = hasSelectable && !showPopup && !retTopCard?.selectable;

    // The card under the top one is drawn too, so it is already there when the top card is taken away
    const nextCard = cards
        ? topCard
            ? cards.find((card) => card.uuid !== topCard.uuid)
            : cards[1]
        : null;
    const nextUuid = nextCard?.uuid;
    const retNextCard = useMemo(
        () =>
            nextCard && (hiddenTopCard || hideUnderCard)
                ? { facedown: true, uuid: nextUuid }
                : nextCard,
        [nextCard, hiddenTopCard, hideUnderCard, nextUuid]
    );

    return (
        <LabelledGameArea
            ref={areaRef}
            label={headerText}
            slotLabel={slotLabel}
            count={title ? retCardCount : undefined}
            inspectable={!!title}
            opens={!disablePopup}
            upright={orientation !== 'horizontal'}
            inspectSkip={
                topCardHasAction || isTopCardSelectable || !!cards?.some((card) => card.selectable)
            }
            position={titlePosition}
            className={retClassName}
            style={areaStyle}
            onClick={onCollectionClick}
            disableBackground={disableBackground}
            labelClickable={!disablePopup && topCardHasAction}
            data-flip-deck={flipDeck}
        >
            {retTopCard ? (
                <div className='relative'>
                    {showDepth && <PileDepth count={retCardCount} orientation={orientation} />}
                    <div
                        data-pile-stack=''
                        className='relative shift-smooth'
                        style={showDepth ? raisedStackStyle : undefined}
                    >
                        {retNextCard && (
                            <div key={retNextCard.uuid} className='absolute left-0 top-0'>
                                <Card
                                    card={retNextCard}
                                    source={source}
                                    disableHover
                                    orientation={orientation}
                                    under={retTopCard.uuid || true}
                                    flip={!hiddenTopCard && !hideUnderCard}
                                    flipFrom={flipFrom}
                                />
                            </div>
                        )}
                        <div
                            key={retTopCard.uuid}
                            data-pile-top=''
                            data-pile-choose={pileChoose ? '' : undefined}
                            className={classNames('relative flex', {
                                'ring-selectable rounded-[calc(var(--card-scale,1)*0.25rem)]':
                                    pileChoose
                            })}
                        >
                            <Card
                                card={retTopCard}
                                source={source}
                                disableHover={hiddenTopCard}
                                onClick={onTopCardClick}
                                dragDisabled={lockTopCard}
                                orientation={orientation}
                                flip={!hiddenTopCard}
                                flipFrom={flipFrom}
                            />
                        </div>
                    </div>
                </div>
            ) : (
                <div className={cardBoxClass(orientation)} />
            )}
            {getPopup()}
        </LabelledGameArea>
    );
};

export default CardPile;
