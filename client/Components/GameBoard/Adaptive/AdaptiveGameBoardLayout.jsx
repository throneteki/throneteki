import React from 'react';
import { useDispatch } from 'react-redux';
import classNames from 'classnames';
import { Button } from '@heroui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCogs } from '@fortawesome/free-solid-svg-icons';

import ActivePlayerPrompt from '../ActivePlayerPrompt';
import Droppable from '../Droppable';
import GameTimer from '../GameTimer';
import PlayerBoard from '../PlayerBoard';
import SquishableCardPanel from '../SquishableCardPanel';
import { AreaLabelContext } from '../LabelledGameArea';
import { pileRise } from '../PileDepth';
import { findPendingAttachment, withoutPendingAttachment } from '../pendingAttachment';
import { findLeftBehind } from '../leftBehind';
import { sendButtonClickedMessage } from '../../../redux/reducers/game';
import { useLayoutMode } from './useBoardLayout';
import LeaveGameButton from './LeaveGameButton';
import PlotFactionStack from './PlotFactionStack';
import PileCluster from './PileCluster';
import HandTray from './HandTray';
import OpponentCarousel from './OpponentCarousel';

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
                                maxCards={
                                    isMe
                                        ? 5
                                        : Math.max(1, Math.min(player.cardPiles.hand.length, 2))
                                }
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
                <Part area='play' className='flex overflow-hidden'>
                    <PlayerBoard
                        isDroppable={isMe}
                        cardsInPlay={player.cardPiles.cardsInPlay}
                        pendingAttachment={findPendingAttachment(player.cardPiles)}
                        leftBehind={findLeftBehind(player.cardPiles)}
                        onCardClick={onCardClick}
                        rowDirection={side === 'bottom' ? 'default' : 'reverse'}
                        overflow={isMe ? 'squish-then-scroll' : 'squish'}
                    />
                </Part>
            </div>
        );
    };

    const stat = (player) => (
        <span className='whitespace-nowrap'>
            {`${player.user?.username || 'Noone'}: ${player.stats?.totalPower ?? 0} power, ${player.stats?.gold ?? 0} gold`}
        </span>
    );

    const mid = (
        <div
            data-region='mid'
            className={classNames('hud-zoom relative z-[250] flex gap-1 p-1 min-h-0', {
                'flex-row items-center justify-between': mode === 'narrow',
                'flex-col justify-center w-40 overflow-hidden': mode === 'short',
                'flex-col justify-end w-48 lg:w-64': mode === 'wide'
            })}
        >
            <div className='flex flex-col text-xs gap-0.5'>
                {otherPlayers.map((player) => (
                    <React.Fragment key={player.name ?? player.seatNo}>
                        {stat(player)}
                    </React.Fragment>
                ))}
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
                className={classNames(
                    'flex h-full w-full overflow-hidden pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)]',
                    mode === 'narrow' ? 'flex-col' : 'flex-row'
                )}
            >
                {mode === 'narrow' ? (
                    <>
                        {opponents}
                        {mid}
                        {ours}
                        {handTray}
                    </>
                ) : (
                    <>
                        <div className='flex flex-col flex-1 min-w-0 min-h-0'>
                            {opponents}
                            {ours}
                            {handTray}
                        </div>
                        {mid}
                    </>
                )}
            </div>
        </AreaLabelContext.Provider>
    );
};

export default AdaptiveGameBoardLayout;
