import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import { Button } from '@heroui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCogs, faWrench } from '@fortawesome/free-solid-svg-icons';

import Droppable from '../Droppable';
import GameTimer from '../GameTimer';
import PlayerBoard from '../PlayerBoard';
import SquishableCardPanel from '../SquishableCardPanel';
import { AreaLabelContext } from '../LabelledGameArea';
import { pileRise } from '../PileDepth';
import { findPendingAttachment, withoutPendingAttachment } from '../pendingAttachment';
import { findLeftBehind } from '../leftBehind';
import {
    sendButtonClickedMessage,
    sendToggleManualModeMessage
} from '../../../redux/reducers/game';
import { useLayoutMode } from './useBoardLayout';
import LeaveGameButton from './LeaveGameButton';
import PlotFactionStack from './PlotFactionStack';
import PileCluster from './PileCluster';
import HandTray from './HandTray';
import OpponentCarousel from './OpponentCarousel';
import ScrollArea from './ScrollArea';
import PromptBar from './PromptBar';

// One player's side of the board, as a grid of its parts: "id" (plots, agenda and faction), "hand" (the
// opponent's hand, or ours on a wide board), "piles" and "play". Ours mirrors the opponent's, play area nearest
// the middle.
const sideAreas = {
    narrow: {
        top: { columns: 'auto minmax(0, 1fr) auto', rows: ['id hand piles', 'play play play'] },
        bottom: { columns: 'auto minmax(0, 1fr) auto', rows: ['play play play', 'id . piles'] }
    },
    short: {
        top: { columns: 'auto minmax(0, 1fr) auto', rows: ['id play hand', 'id play piles'] },
        bottom: { columns: 'auto minmax(0, 1fr) auto', rows: ['id play piles', 'id play piles'] }
    },
    wide: {
        top: { columns: 'auto auto minmax(0, 1fr)', rows: ['id hand piles', 'play play play'] },
        bottom: { columns: 'auto auto minmax(0, 1fr)', rows: ['play play play', 'id hand piles'] }
    }
};

const sideGridStyle = (mode, side) => {
    const { columns, rows } = sideAreas[mode][side];
    const playRow = rows.findIndex((row) => row.includes('play') && !row.includes('id'));
    return {
        gridTemplateColumns: columns,
        gridTemplateRows: rows
            .map((row, index) =>
                index === playRow || (mode === 'short' && index === (side === 'top' ? 1 : 0))
                    ? 'minmax(0, 1fr)'
                    : 'auto'
            )
            .join(' '),
        gridTemplateAreas: rows.map((row) => `"${row}"`).join(' ')
    };
};

// A part drawn at another of the board's scales: every card size inside follows --card-scale
const Part = ({ area, scale, className, children }) => (
    <div
        data-region={area}
        className={classNames('relative min-w-0 min-h-0', className)}
        style={{ gridArea: area, ...(scale && { '--card-scale': `var(--${scale}-scale)` }) }}
    >
        {children}
    </div>
);

const AdaptiveGameBoardLayout = ({
    thisPlayer,
    otherPlayers,
    userPlayer,
    onCardClick,
    onSettingsClick,
    isDragging
}) => {
    const dispatch = useDispatch();
    const mode = useLayoutMode();
    const manualMode = useSelector((state) => !!state.lobby.currentGame?.manualMode);
    const username = useSelector((state) => state.auth.user?.username);
    const isPlaying = !!thisPlayer && thisPlayer.user?.username === username;
    const phoneLayout = mode !== 'wide';
    const pileScale = phoneLayout ? 'pile' : null;

    const renderSide = (player, side) => {
        const isMe = !!thisPlayer && player === thisPlayer;
        const pileProps = {
            onCardClick,
            popupLocation: side,
            popupId: side,
            playerName: player.user?.username
        };
        const droppable = (source, children, count, className = 'self-start') =>
            isMe ? (
                <Droppable
                    source={source}
                    className={className}
                    rise={count === undefined ? undefined : pileRise(count)}
                >
                    {children}
                </Droppable>
            ) : (
                children
            );
        const handInStrip = !isMe || mode === 'wide';

        return (
            <div
                data-side={side}
                className='grid h-full w-full min-h-0 min-w-0'
                style={sideGridStyle(mode, side)}
            >
                <Part area='id' scale={pileScale} className='p-1'>
                    <PlotFactionStack
                        player={player}
                        isMe={isMe}
                        side={side}
                        onCardClick={onCardClick}
                        pileProps={pileProps}
                        droppable={droppable}
                    />
                </Part>
                {handInStrip && (
                    <Part
                        area='hand'
                        scale={isMe ? null : pileScale}
                        className={classNames('p-1', { 'justify-self-end': mode === 'short' })}
                    >
                        {droppable(
                            'hand',
                            <SquishableCardPanel
                                cards={withoutPendingAttachment(player.cardPiles.hand)}
                                groupVisibleCards
                                maxCards={isMe ? 5 : 1}
                                onCardClick={onCardClick}
                                source='hand'
                                title='Hand'
                                flipFrom={player.user?.username}
                                stagedArrivals={isMe}
                                redeal={player.phase === 'setup'}
                            />
                        )}
                    </Part>
                )}
                <Part
                    area='piles'
                    scale={pileScale}
                    className={classNames('p-1 flex', {
                        'justify-end': mode !== 'wide',
                        'items-end': mode === 'short' && side === 'bottom'
                    })}
                >
                    <PileCluster
                        player={player}
                        isMe={isMe}
                        side={side}
                        spectating={!thisPlayer}
                        onCardClick={onCardClick}
                        pileProps={pileProps}
                        droppable={droppable}
                        isDragging={isDragging}
                    />
                </Part>
                <Part area='play' className='flex'>
                    <ScrollArea className='flex-1' anchor={side === 'top' ? 'end' : 'start'}>
                        <PlayerBoard
                            isDroppable={isMe}
                            cardsInPlay={player.cardPiles.cardsInPlay}
                            pendingAttachment={findPendingAttachment(player.cardPiles)}
                            leftBehind={findLeftBehind(player.cardPiles)}
                            onCardClick={onCardClick}
                            rowDirection={side === 'bottom' ? 'default' : 'reverse'}
                            overflow='wrap'
                        />
                    </ScrollArea>
                </Part>
            </div>
        );
    };

    // Until the scoreboard (phase 4), each player's power and gold sit at their end of the phase track
    const stat = (player) =>
        player && (
            <span className='whitespace-nowrap text-default-500'>
                <span className='text-default-300'>{player.user?.username || 'Noone'}</span>
                {` ♛${player.stats?.totalPower ?? 0} ●${player.stats?.gold ?? 0}`}
            </span>
        );
    const onButtonClick = (button) =>
        dispatch(
            sendButtonClickedMessage(button.promptId, button.command, button.method, button.arg)
        );
    const gameActions = (
        <div className='flex'>
            <Button
                isIconOnly
                size='sm'
                variant='light'
                className='h-6 w-6 min-w-6'
                title='Open Settings'
                onPress={onSettingsClick}
            >
                <FontAwesomeIcon icon={faCogs} />
            </Button>
            {isPlaying && (
                <Button
                    isIconOnly
                    size='sm'
                    variant='light'
                    className={classNames('h-6 w-6 min-w-6', { 'text-danger': manualMode })}
                    title={
                        manualMode
                            ? 'Manual mode is on: the rules are not fully enforced, and players can change the game by hand. Click to turn it off.'
                            : 'Manual mode is off: the game enforces the rules, and manual changes are disabled. Click to ask your opponent to turn it on.'
                    }
                    onPress={() => dispatch(sendToggleManualModeMessage())}
                >
                    <FontAwesomeIcon icon={faWrench} />
                </Button>
            )}
            <LeaveGameButton />
        </div>
    );

    const divider = (
        <div data-region='mid' className='relative z-[250] shrink-0'>
            <PromptBar
                mode={mode}
                phase={thisPlayer?.phase}
                promptTitle={userPlayer?.promptTitle}
                promptText={userPlayer?.menuTitle}
                buttons={userPlayer?.buttons}
                controls={userPlayer?.controls}
                selecting={!!userPlayer?.selectCard}
                onButtonClick={onButtonClick}
                timer={<GameTimer player={thisPlayer} isMe={!!thisPlayer} side='bottom' />}
                actions={gameActions}
                startOfTrack={otherPlayers.map((player) => (
                    <React.Fragment key={player.name ?? player.seatNo}>
                        {stat(player)}{' '}
                    </React.Fragment>
                ))}
                endOfTrack={stat(thisPlayer)}
            />
        </div>
    );

    const opponents = (
        <OpponentCarousel
            className='flex-1 basis-0'
            opponents={otherPlayers}
            renderSide={(player) => renderSide(player, 'top')}
        />
    );
    const ours = (
        <div className='flex flex-1 basis-0 min-h-0'>{renderSide(thisPlayer, 'bottom')}</div>
    );
    const handTray = phoneLayout && thisPlayer && (
        <div
            data-region='hand-tray'
            className='shrink-0 p-1'
            style={{ '--card-scale': 'var(--hand-scale)' }}
        >
            <HandTray
                player={thisPlayer}
                onCardClick={onCardClick}
                peek={mode === 'short'}
                droppable={(source, children, count, className) => (
                    <Droppable source={source} className={className}>
                        {children}
                    </Droppable>
                )}
            />
        </div>
    );

    return (
        <AreaLabelContext.Provider value={phoneLayout ? 'count' : 'full'}>
            <div
                data-layout={mode}
                className='flex h-full w-full flex-col overflow-hidden pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)]'
            >
                {opponents}
                {divider}
                {ours}
                {handTray}
            </div>
        </AreaLabelContext.Provider>
    );
};

export default AdaptiveGameBoardLayout;
