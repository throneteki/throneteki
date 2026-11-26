import React, { forwardRef, useCallback, useState } from 'react';
import Frame from '../Site/Frame';
import Group from '../Site/Group';
import Notice from '../Site/Notice';
import Messages from '../GameBoard/Messages';
import SelectDeckModal from './SelectDeckModal';
import { useDispatch, useSelector } from 'react-redux';
import {
    sendChatMessage,
    sendLeaveGameMessage,
    sendSelectDeckMessage,
    sendStartGameMessage
} from '../../redux/reducers/lobby';
import { navigate } from '../../redux/reducers/navigation';

import { Button } from '@heroui/react';
import GameActionButton from '../Site/GameActionButton';
import Dialog from '../Site/Dialog';
import { GameTypeDescriptions } from './GameTypeInfo';
import PendingGamePlayers from './PendingGamePlayers';
import LoadingSpinner from '../Site/LoadingSpinner';
import { GameFormats, GameTypes } from '../../constants';
import ChatArea from '../Site/ChatArea';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';

const PendingGame = forwardRef(function PendingGame({ mockGame }, ref) {
    const dispatch = useDispatch();
    const [waiting, setWaiting] = useState(false);
    const [showDecksModal, setShowDecksModal] = useState(false);
    const [confirmingDeck, setConfirmingDeck] = useState();

    const { connecting, host } = useSelector((state) => state.game);
    const lobby = useSelector((state) => state.lobby);
    const currentGame = mockGame ?? lobby.currentGame;
    const gameError = lobby.gameError;
    const user = useSelector((state) => state.auth.user);

    const getGameStatus = useCallback(() => {
        if (gameError) {
            return gameError;
        }

        if (connecting) {
            return `Connecting to the game server, ${host}`;
        }

        if (waiting) {
            return 'Waiting for the lobby server';
        }

        if (Object.values(currentGame.players).length < 2) {
            return 'Waiting for players to join';
        }

        if (
            !Object.values(currentGame.players).every((player) => {
                return !!player.deck.selected;
            })
        ) {
            return 'Waiting for everyone to choose a deck';
        }

        if (currentGame.owner === user.username) {
            return 'Everyone is ready. Start the game when you are.';
        }

        return 'Everyone is ready. Waiting for the host to start the game.';
    }, [
        connecting,
        currentGame.owner,
        currentGame.players,
        gameError,
        host,
        user.username,
        waiting
    ]);

    const canStartGame = () => {
        if (!user || !currentGame || currentGame.owner !== user.username || connecting) {
            return false;
        }

        if (
            !Object.values(currentGame.players).every((player) => {
                return !!player.deck?.selected;
            })
        ) {
            return false;
        }

        if (waiting && !gameError) {
            return false;
        }

        return true;
    };

    if (currentGame && currentGame.started) {
        return <LoadingSpinner label='Loading game in progress...' />;
    }

    if (!user) {
        dispatch(navigate('/'));

        return <LoadingSpinner label='You must be logged in to play, redirecting...' />;
    }
    const format = GameFormats.find((gf) => gf.name === currentGame.gameFormat);
    const variant = format?.variants.find((v) => v.name === currentGame.gameVariant);
    const typeLabel = GameTypes.find((t) => t.name === currentGame.gameType)?.label;
    const isOwner = currentGame.owner === user.username;
    const isReady =
        Object.values(currentGame.players).length > 1 &&
        Object.values(currentGame.players).every((player) => !!player.deck?.selected);
    const gameLink = `${window.location.protocol}//${window.location.host}/play?gameId=${currentGame.id}`;
    const details = [
        currentGame.event?.name && ['Event', currentGame.event.name],
        ['Type', typeLabel],
        ['Format', format?.label],
        variant && format.variants.length > 1 && ['Variant', variant.label],
        currentGame.restrictedList?.name && ['Legality', currentGame.restrictedList.name]
    ].filter(Boolean);

    return (
        <Frame
            ref={ref}
            title={currentGame.name}
            description={GameTypeDescriptions[currentGame.gameType]}
            actions={
                <>
                    <Button onPress={() => dispatch(sendLeaveGameMessage())} variant='tertiary'>
                        Leave
                    </Button>
                    {isOwner && (
                        <GameActionButton
                            isDisabled={!canStartGame()}
                            onPress={() => {
                                setWaiting(true);
                                dispatch(sendStartGameMessage());
                            }}
                        >
                            Start game
                        </GameActionButton>
                    )}
                </>
            }
            bodyClassName='gap-6'
        >
            <dl className='flex flex-wrap gap-x-6 gap-y-1 text-sm'>
                {details.map(([term, value]) => (
                    <div key={term} className='flex gap-1.5'>
                        <dt className='text-ink-faint'>{term}</dt>
                        <dd className={term === 'Event' ? 'text-gold' : 'text-ink'}>{value}</dd>
                    </div>
                ))}
            </dl>
            <Notice kind={gameError ? 'error' : isReady && !waiting ? 'success' : 'info'}>
                {getGameStatus()}
            </Notice>
            <div className='grid grid-cols-1 gap-x-10 gap-y-6 lg:grid-cols-2'>
                <div className='flex flex-col gap-6'>
                    <Group title='Players'>
                        <PendingGamePlayers
                            currentGame={currentGame}
                            user={user}
                            onSelectDeck={() => setShowDecksModal(true)}
                        />
                        {currentGame.spectators.length > 0 && (
                            <p className='mt-3 text-sm text-ink-faint'>
                                Watching:{' '}
                                <span className='text-ink-dim'>
                                    {currentGame.spectators.map((s) => s.name).join(', ')}
                                </span>
                            </p>
                        )}
                    </Group>
                    <Group title='Invite' description='Send this link to someone so they can join.'>
                        <div className='flex min-w-0 items-center gap-1 border border-gold-hair bg-well py-1 pl-3 pr-1'>
                            <a
                                href={gameLink}
                                target='_blank'
                                rel='noopener noreferrer'
                                className='min-w-0 flex-1 truncate text-sm text-ink-dim hover:text-ink'
                            >
                                {gameLink}
                            </a>
                            <Button
                                size='sm'
                                variant='ghost'
                                onPress={() =>
                                    navigator.clipboard
                                        ?.writeText(gameLink)
                                        .then(() => toast.success('Game link copied'))
                                        .catch(() => toast.error("The link couldn't be copied"))
                                }
                            >
                                <FontAwesomeIcon icon={faCopy} />
                                Copy
                            </Button>
                        </div>
                    </Group>
                </div>
                <Group title='Chat'>
                    <ChatArea
                        classNames={{
                            wrapper: 'h-72 border border-gold-hair bg-well overflow-hidden',
                            messages: 'flex flex-col gap-1.5 p-3 text-sm'
                        }}
                        messageCount={currentGame.messages.length}
                        onSendMessage={(message) => dispatch(sendChatMessage(message))}
                        placeholder='Send a message'
                    >
                        <Messages messages={currentGame.messages} />
                    </ChatArea>
                </Group>
            </div>
            <SelectDeckModal
                isOpen={showDecksModal}
                onClose={() => setShowDecksModal(false)}
                onDeckSelected={(deck) => {
                    if (currentGame.event?.lockDecks) {
                        setConfirmingDeck(deck);
                    } else {
                        setShowDecksModal(false);
                        dispatch(sendSelectDeckMessage(deck._id));
                    }
                }}
                game={currentGame}
            />
            <Dialog
                isOpen={!!confirmingDeck}
                onOpenChange={(open) => !open && setConfirmingDeck(undefined)}
                title='Lock in this deck?'
                footer={
                    <div className='flex justify-end gap-2'>
                        <Button onPress={() => setConfirmingDeck(undefined)} variant='tertiary'>
                            Back
                        </Button>
                        <Button
                            onPress={() => {
                                dispatch(sendSelectDeckMessage(confirmingDeck._id));
                                setConfirmingDeck(undefined);
                                setShowDecksModal(false);
                            }}
                            variant='primary'
                        >
                            Use this deck
                        </Button>
                    </div>
                }
            >
                <div className='flex flex-col gap-3 text-sm text-ink-dim'>
                    <p>
                        <span className='text-ink'>{confirmingDeck?.name}</span> for{' '}
                        <span className='text-gold'>{currentGame.event?.name}</span>
                    </p>
                    <p>
                        Once this game starts, the deck is locked for the rest of the event. You
                        can&apos;t swap it or change it until the event ends.
                    </p>
                </div>
            </Dialog>
        </Frame>
    );
});

export default PendingGame;
