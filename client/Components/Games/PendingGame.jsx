import React, { forwardRef, useCallback, useState } from 'react';
import Panel from '../Site/Panel';
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

import {
    Button,
    Link,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Snippet
} from '@heroui/react';
import GameTypeInfo from './GameTypeInfo';
import AlertPanel, { AlertType } from '../Site/AlertPanel';
import PendingGamePlayers from './PendingGamePlayers';
import LoadingSpinner from '../Site/LoadingSpinner';
import { GameFormats } from '../../constants';
import ChatArea from '../Site/ChatArea';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

const PendingGame = forwardRef(function PendingGame(_, ref) {
    const dispatch = useDispatch();
    const [waiting, setWaiting] = useState(false);
    const [showDecksModal, setShowDecksModal] = useState(false);
    const [confirmingDeck, setConfirmingDeck] = useState();

    const { connecting, host } = useSelector((state) => state.game);
    const { currentGame, gameError } = useSelector((state) => state.lobby);
    const user = useSelector((state) => state.auth.user);

    const getGameStatus = useCallback(() => {
        if (gameError) {
            return gameError;
        }

        if (connecting) {
            return 'Connecting to game server: ' + host;
        }

        if (waiting) {
            return 'Waiting for lobby server...';
        }

        if (Object.values(currentGame.players).length < 2) {
            return 'Waiting for players...';
        }

        if (
            !Object.values(currentGame.players).every((player) => {
                return !!player.deck.selected;
            })
        ) {
            return 'Waiting for players to select decks';
        }

        if (currentGame.owner === user.username) {
            return 'Ready to begin, click start to begin the game';
        }

        return 'Ready to begin, waiting for opponent to start the game';
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
    const variant = format.variants.find((v) => v.name === currentGame.gameVariant);
    return (
        <div className='flex flex-col gap-2'>
            <Panel title={currentGame.name}>
                <div className='flex flex-col gap-2'>
                    <div>
                        {currentGame.event.name && (
                            <p>
                                <strong>Event:</strong> {currentGame.event.name}
                            </p>
                        )}
                        <p>
                            <strong>Format:</strong> {format.label}
                        </p>
                        <p>
                            <strong>Variant:</strong> {variant.label}
                        </p>
                        <p>
                            <strong>Legality:</strong> {currentGame.restrictedList.name}
                        </p>
                    </div>
                    <div className='flex gap-2 flex-wrap'>
                        <div className='flex gap-1'>
                            <Button
                                color='success'
                                isDisabled={!canStartGame()}
                                onPress={() => {
                                    setWaiting(true);
                                    dispatch(sendStartGameMessage());
                                }}
                            >
                                Start
                            </Button>
                            <Button
                                color='primary'
                                onPress={() => {
                                    dispatch(sendLeaveGameMessage());
                                }}
                            >
                                Leave
                            </Button>
                        </div>
                        <Snippet
                            classNames={{ base: 'py-1' }}
                            codeString={`${window.location.protocol}//${window.location.host}/play?gameId=${currentGame.id}`}
                            hideSymbol
                        >
                            <Link href={`/play?gameId=${currentGame.id}`} isExternal>
                                Game Link
                            </Link>
                        </Snippet>
                    </div>
                    <div>
                        <GameTypeInfo gameType={currentGame.gameType} />
                    </div>
                    <div>
                        {gameError ? (
                            <AlertPanel variant={AlertType.Danger}>{getGameStatus()}</AlertPanel>
                        ) : (
                            getGameStatus()
                        )}
                    </div>
                </div>
            </Panel>
            <div ref={ref}>
                <PendingGamePlayers
                    currentGame={currentGame}
                    user={user}
                    onSelectDeck={() => setShowDecksModal(true)}
                />
            </div>
            {currentGame.spectators.length > 0 && (
                <Panel title={`Spectators (${currentGame.spectators.length})`}>
                    {currentGame.spectators.map((spectator) => {
                        return <div key={spectator.name}>{spectator.name}</div>;
                    })}
                </Panel>
            )}
            <Panel title={'Chat'}>
                <ChatArea
                    classNames={{
                        wrapper: 'h-52 border-1 border-primary-500 rounded-lg overflow-hidden',
                        messages: 'flex flex-col gap-1.5 p-2'
                    }}
                    messageCount={currentGame.messages.length}
                    onSendMessage={(message) => dispatch(sendChatMessage(message))}
                    placeholder={'Enter a message...'}
                >
                    <Messages messages={currentGame.messages} />
                </ChatArea>
            </Panel>
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
            {
                <Modal isOpen={!!confirmingDeck} onClose={() => setConfirmingDeck(undefined)}>
                    <ModalContent>
                        <ModalHeader>Confirm Deck Selection</ModalHeader>
                        <ModalBody>
                            <div className='bg-default-100 p-2 rounded-lg'>
                                <div className='text-large font-bold'>
                                    {currentGame.event?.name ?? 'Unselected'}
                                </div>
                                <div className='flex gap-2 items-center'>
                                    <FontAwesomeIcon icon={faCheck} />
                                    <span>{confirmingDeck?.name ?? 'Unselected'}</span>
                                </div>
                            </div>
                            <div>
                                Once this game starts, your selected deck will be permanently locked
                                for this event. You cannot swap it out or make changes for the
                                duration of the event.
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button onPress={() => setConfirmingDeck(undefined)}>Back</Button>
                            <Button
                                color='success'
                                onPress={() => {
                                    dispatch(sendSelectDeckMessage(confirmingDeck._id));
                                    setConfirmingDeck(undefined);
                                    setShowDecksModal(false);
                                }}
                            >
                                Continue
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            }
        </div>
    );
});

export default PendingGame;
