import React from 'react';
import { useDispatch } from 'react-redux';
import classNames from 'classnames';
import { Button } from '@heroui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCogs } from '@fortawesome/free-solid-svg-icons';

import ActivePlayerPrompt from '../ActivePlayerPrompt';
import CardPile from '../CardPile';
import DrawDeck from '../DrawDeck';
import Droppable from '../Droppable';
import GameTimer from '../GameTimer';
import PlayerBoard from '../PlayerBoard';
import PlayerPlots from '../PlayerPlots';
import SquishableCardPanel from '../SquishableCardPanel';
import { pileRise } from '../PileDepth';
import { findPendingAttachment, withoutPendingAttachment } from '../pendingAttachment';
import { findLeftBehind } from '../leftBehind';
import {
    sendButtonClickedMessage,
    sendShowDrawDeckMessage,
    sendShuffleDeckMessage
} from '../../../redux/reducers/game';
import { useLayoutMode } from './useBoardLayout';
import LeaveGameButton from './LeaveGameButton';

// Where each part of the board sits in each layout mode. "o-" parts are the opponent's, "m-" parts ours.
const areas = {
    narrow: {
        columns: 'auto minmax(0, 1fr) auto',
        rows: 'auto minmax(0, 1fr) auto minmax(0, 1fr) auto auto',
        template: [
            'o-id o-hand o-piles',
            'o-play o-play o-play',
            'mid mid mid',
            'm-play m-play m-play',
            'm-id . m-piles',
            'm-hand m-hand m-hand'
        ]
    },
    short: {
        columns: 'auto minmax(0, 1fr) auto',
        rows: 'auto minmax(0, 1fr) auto minmax(0, 1fr) auto auto',
        template: [
            'o-id o-play o-hand',
            'o-id o-play o-piles',
            'm-id o-play mid',
            'm-id m-play mid',
            'm-id m-play m-piles',
            'm-id m-hand m-piles'
        ]
    },
    wide: {
        columns: 'auto auto minmax(0, 1fr) auto',
        rows: 'auto minmax(0, 1fr) minmax(0, 1fr) auto',
        template: [
            'o-id o-hand o-piles mid',
            'o-play o-play o-play mid',
            'm-play m-play m-play mid',
            'm-id m-hand m-piles mid'
        ]
    }
};

const gridStyle = (mode) => ({
    gridTemplateColumns: areas[mode].columns,
    gridTemplateRows: areas[mode].rows,
    gridTemplateAreas: areas[mode].template.map((row) => `"${row}"`).join(' ')
});

// A region drawn at another of the board's scales: every card size inside follows --card-scale
const scaled = (scale) => (scale ? { '--card-scale': `var(--${scale}-scale)` } : undefined);

const Region = ({ area, scale, className, children }) => (
    <div
        data-region={area}
        className={classNames('relative min-w-0 min-h-0', className)}
        style={{ gridArea: area, ...scaled(scale) }}
    >
        {children}
    </div>
);

const AdaptiveGameBoardLayout = ({
    thisPlayer,
    otherPlayer,
    userPlayer,
    onCardClick,
    onSettingsClick
}) => {
    const dispatch = useDispatch();
    const mode = useLayoutMode();
    const isMe = (player) => !!thisPlayer && player === thisPlayer;
    const piles = mode === 'wide' ? null : 'pile';

    const droppable = (player, source, children, count) =>
        isMe(player) ? (
            <Droppable
                source={source}
                className='self-start'
                rise={count === undefined ? undefined : pileRise(count)}
            >
                {children}
            </Droppable>
        ) : (
            children
        );

    const renderSide = (player, prefix, side) => {
        const me = isMe(player);
        const cardPiles = player.cardPiles;
        const playerName = player.user?.username;
        const pileProps = { onCardClick, popupLocation: side, popupId: side, playerName };
        const agenda = player.agendas?.[0];
        const numDrawCards = player.numDrawCards || cardPiles.drawDeck?.length || 0;
        const shadows = withoutPendingAttachment(cardPiles.shadows);
        const outOfGame = withoutPendingAttachment(cardPiles.outOfGamePile);

        return (
            <React.Fragment key={prefix}>
                <Region area={`${prefix}-id`} scale={piles} className='flex gap-1 p-1 items-start'>
                    <PlayerPlots
                        onCardClick={onCardClick}
                        direction={side === 'bottom' ? 'default' : 'reverse'}
                        isMe={me}
                        playerName={playerName}
                        plotDeck={cardPiles.plotDeck}
                        plotDiscard={cardPiles.plotDiscard}
                        activePlot={player.activePlot}
                        selectedPlot={player.selectedPlot}
                        mustShowPlotSelection={player.mustShowPlotSelection}
                    />
                    <CardPile
                        className='faction'
                        source='faction'
                        cards={[]}
                        topCard={player.faction}
                        disablePopup
                        onCardClick={onCardClick}
                        orientation={player.faction?.kneeled ? 'horizontal' : 'vertical'}
                    />
                    {agenda?.code &&
                        droppable(
                            player,
                            'agenda',
                            <CardPile
                                cards={agenda.childCards || []}
                                disablePopup={!agenda.childCards?.length}
                                showCards
                                source='agenda'
                                title={agenda.childCards?.length ? 'Agenda' : null}
                                topCard={agenda}
                                numColumns={5}
                                numRows={1.2}
                                {...pileProps}
                            />
                        )}
                </Region>
                <Region area={`${prefix}-hand`} scale={me ? 'hand' : piles} className='p-1'>
                    {droppable(
                        player,
                        'hand',
                        <SquishableCardPanel
                            cards={withoutPendingAttachment(cardPiles.hand)}
                            groupVisibleCards
                            maxCards={5}
                            onCardClick={onCardClick}
                            source='hand'
                            title='Hand'
                            flipFrom={playerName}
                            stagedArrivals
                            redeal={player.phase === 'setup'}
                        />
                    )}
                </Region>
                <Region
                    area={`${prefix}-piles`}
                    scale={piles}
                    className='flex gap-1 p-1 items-start'
                >
                    {shadows.length > 0 &&
                        droppable(
                            player,
                            'shadows',
                            <SquishableCardPanel
                                cards={shadows}
                                maxCards={2}
                                onCardClick={onCardClick}
                                source='shadows'
                                title='Shadows'
                            />
                        )}
                    {droppable(
                        player,
                        'draw deck',
                        <DrawDeck
                            cardCount={numDrawCards}
                            cards={withoutPendingAttachment(cardPiles.drawDeck)}
                            isMe={me}
                            numDrawCards={player.numDrawCards}
                            onPopupChange={
                                me
                                    ? (visible) => dispatch(sendShowDrawDeckMessage(visible))
                                    : undefined
                            }
                            onShuffleClick={
                                me ? () => dispatch(sendShuffleDeckMessage()) : undefined
                            }
                            revealTopCard={player.revealTopCard}
                            showDeck={player.showDeck}
                            spectating={!thisPlayer}
                            {...pileProps}
                        />,
                        numDrawCards
                    )}
                    {droppable(
                        player,
                        'discard pile',
                        <CardPile
                            numColumns={5}
                            numRows={2.2}
                            className='discard'
                            showDepth
                            title='Discard'
                            source='discard pile'
                            cards={withoutPendingAttachment(cardPiles.discardPile)}
                            {...pileProps}
                        />,
                        cardPiles.discardPile.length
                    )}
                    {droppable(
                        player,
                        'dead pile',
                        <CardPile
                            numColumns={5}
                            numRows={2.2}
                            className='dead'
                            showDepth
                            title='Dead'
                            source='dead pile'
                            cards={withoutPendingAttachment(cardPiles.deadPile)}
                            orientation='horizontal'
                            {...pileProps}
                        />,
                        cardPiles.deadPile.length
                    )}
                    {outOfGame.length > 0 &&
                        droppable(
                            player,
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
                </Region>
                <Region area={`${prefix}-play`} className='flex overflow-hidden'>
                    <PlayerBoard
                        isDroppable={me}
                        cardsInPlay={cardPiles.cardsInPlay}
                        pendingAttachment={findPendingAttachment(cardPiles)}
                        leftBehind={findLeftBehind(cardPiles)}
                        onCardClick={onCardClick}
                        rowDirection={side === 'bottom' ? 'default' : 'reverse'}
                    />
                </Region>
            </React.Fragment>
        );
    };

    const stat = (player) => (
        <span className='whitespace-nowrap'>
            {`${player.user?.username || 'Noone'}: ${player.stats?.totalPower ?? 0} power, ${player.stats?.gold ?? 0} gold`}
        </span>
    );

    return (
        <div
            data-layout={mode}
            className='grid h-full w-full overflow-hidden pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)]'
            style={gridStyle(mode)}
        >
            {renderSide(otherPlayer, 'o', 'top')}
            {renderSide(thisPlayer, 'm', 'bottom')}
            <Region
                area='mid'
                className={classNames('hud-zoom flex gap-1 p-1 z-[250]', {
                    'flex-row items-center justify-between': mode === 'narrow',
                    'flex-col justify-center w-40': mode === 'short',
                    'flex-col justify-end w-48 lg:w-64': mode === 'wide'
                })}
            >
                <div className='flex flex-col text-xs gap-0.5'>
                    {stat(otherPlayer)}
                    {stat(thisPlayer)}
                </div>
                <GameTimer player={thisPlayer} isMe={!!thisPlayer} side='bottom' />
                {userPlayer && thisPlayer && (
                    <ActivePlayerPrompt
                        className='min-w-0 flex-1'
                        buttons={userPlayer.buttons}
                        controls={userPlayer.controls}
                        promptText={userPlayer.menuTitle}
                        promptTitle={userPlayer.promptTitle}
                        onButtonClick={(button) =>
                            dispatch(
                                sendButtonClickedMessage(
                                    button.promptId,
                                    button.command,
                                    button.method,
                                    button.arg
                                )
                            )
                        }
                        phase={thisPlayer.phase}
                    />
                )}
                <div className='flex gap-1'>
                    <Button
                        isIconOnly
                        size='sm'
                        variant='light'
                        title='Open Settings'
                        onPress={onSettingsClick}
                    >
                        <FontAwesomeIcon icon={faCogs} />
                    </Button>
                    <LeaveGameButton />
                </div>
            </Region>
        </div>
    );
};

export default AdaptiveGameBoardLayout;
