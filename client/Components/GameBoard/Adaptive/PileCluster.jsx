import React from 'react';
import { useDispatch } from 'react-redux';
import CardPile from '../CardPile';
import DrawDeck from '../DrawDeck';
import { withoutPendingAttachment } from '../pendingAttachment';
import { sendShowDrawDeckMessage, sendShuffleDeckMessage } from '../../../redux/reducers/game';
import Reveal from './Reveal';

// A player's draw deck, discard and dead piles, and out of game while it holds cards. Our own out of game also
// shows, empty, in manual mode and while a card is carried, as somewhere to put it. Shadows lie beside the hand.
const PileCluster = ({ player, isMe, spectating, pileProps, droppable, offerEmpty = false }) => {
    const dispatch = useDispatch();
    const cardPiles = player.cardPiles;
    const numDrawCards = player.numDrawCards || cardPiles.drawDeck?.length || 0;
    const outOfGame = withoutPendingAttachment(cardPiles.outOfGamePile);
    const discard = withoutPendingAttachment(cardPiles.discardPile);
    const dead = withoutPendingAttachment(cardPiles.deadPile);

    return (
        <div className='flex items-start gap-1'>
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
            <Reveal show={outOfGame.length > 0 || (isMe && offerEmpty)} className='shrink-0'>
                {droppable(
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
            </Reveal>
        </div>
    );
};

export default PileCluster;
