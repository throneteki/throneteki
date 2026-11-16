import React from 'react';
import { useDispatch } from 'react-redux';
import CardPile from '../CardPile';
import DrawDeck from '../DrawDeck';
import Droppable from '../Droppable';
import SquishableCardPanel from '../SquishableCardPanel';
import { cardBoxClass } from '../../../cardScale';
import { withoutPendingAttachment } from '../pendingAttachment';
import { sendShowDrawDeckMessage, sendShuffleDeckMessage } from '../../../redux/reducers/game';

// While a card is carried, the piles that are hidden when empty are offered as places to drop it, laid over
// the board beside the other piles so nothing on the board moves
const DropTray = ({ piles, side }) =>
    piles.length > 0 && (
        <div
            className={`absolute right-0 z-[260] flex gap-1 ${side === 'bottom' ? 'bottom-full mb-1' : 'top-full mt-1'}`}
        >
            {piles.map(({ source, label, orientation }) => (
                <Droppable key={source} source={source}>
                    <div
                        className={`${cardBoxClass(orientation)} flex items-center justify-center text-center text-tiny leading-tight border-2 border-dashed border-default-400 bg-black/70 rounded-md`}
                    >
                        {label}
                    </div>
                </Droppable>
            ))}
        </div>
    );

// A player's draw deck, discard and dead piles, with shadows and out of game shown only when they hold cards
const PileCluster = ({
    player,
    isMe,
    side,
    spectating,
    onCardClick,
    pileProps,
    droppable,
    isDragging
}) => {
    const dispatch = useDispatch();
    const cardPiles = player.cardPiles;
    const numDrawCards = player.numDrawCards || cardPiles.drawDeck?.length || 0;
    const shadows = withoutPendingAttachment(cardPiles.shadows);
    const outOfGame = withoutPendingAttachment(cardPiles.outOfGamePile);
    const discard = withoutPendingAttachment(cardPiles.discardPile);
    const dead = withoutPendingAttachment(cardPiles.deadPile);

    const emptyTargets = [
        shadows.length === 0 && { source: 'shadows', label: 'Shadows' },
        outOfGame.length === 0 && {
            source: 'out of game',
            label: 'Out of Game',
            orientation: 'horizontal'
        }
    ].filter(Boolean);

    return (
        <div className='relative flex items-start gap-1'>
            {shadows.length > 0 &&
                droppable(
                    'shadows',
                    <SquishableCardPanel
                        cards={shadows}
                        maxCards={Math.min(shadows.length, 1.5)}
                        onCardClick={onCardClick}
                        source='shadows'
                        title='Shadows'
                    />
                )}
            {droppable(
                'draw deck',
                <DrawDeck
                    cardCount={numDrawCards}
                    cards={withoutPendingAttachment(cardPiles.drawDeck)}
                    isMe={isMe}
                    numDrawCards={player.numDrawCards}
                    onPopupChange={
                        isMe ? (visible) => dispatch(sendShowDrawDeckMessage(visible)) : undefined
                    }
                    onShuffleClick={isMe ? () => dispatch(sendShuffleDeckMessage()) : undefined}
                    revealTopCard={player.revealTopCard}
                    showDeck={player.showDeck}
                    spectating={spectating}
                    {...pileProps}
                />,
                numDrawCards
            )}
            {droppable(
                'discard pile',
                <CardPile
                    numColumns={5}
                    numRows={2.2}
                    className='discard'
                    showDepth
                    title='Discard'
                    source='discard pile'
                    cards={discard}
                    {...pileProps}
                />,
                discard.length
            )}
            {droppable(
                'dead pile',
                <CardPile
                    numColumns={5}
                    numRows={2.2}
                    className='dead'
                    showDepth
                    title='Dead'
                    source='dead pile'
                    cards={dead}
                    orientation='horizontal'
                    {...pileProps}
                />,
                dead.length
            )}
            {outOfGame.length > 0 &&
                droppable(
                    'out of game',
                    <CardPile
                        numColumns={4}
                        numRows={1.2}
                        cards={outOfGame}
                        orientation='horizontal'
                        source='out of game'
                        title='Out of Game'
                        showDepth
                        {...pileProps}
                    />,
                    outOfGame.length
                )}
            {isMe && isDragging && <DropTray piles={emptyTargets} side={side} />}
        </div>
    );
};

export default PileCluster;
