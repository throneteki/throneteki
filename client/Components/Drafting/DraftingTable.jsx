import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import $ from 'jquery';

import GameChat from '../GameBoard/GameChat';
import CardTypeGroups from '../Decks/CardTypeGroups';
import CardZoom from '../GameBoard/CardZoom';
import DraftCard from './DraftCard';
import Panel from '../Site/Panel';
import DraftPlayerPrompt from './DraftPlayerPrompt';
import { navigate } from '../../redux/reducers/navigation';
import { sendLeaveGameMessage } from '../../redux/reducers/game';

const DraftingTable = () => {
    const [selectedGroupBy, setSelectedGroupBy] = useState('type');
    const [spectating, setSpectating] = useState(false);

    const { currentGame, cardToZoom, cards, user } = useSelector((state) => ({
        currentGame: state.lobby.currentGame,
        cardToZoom: state.cards.zoomCard,
        cards: state.cards.cards,
        socket: state.lobby.socket,
        user: state.account.user
    }));

    const dispatch = useDispatch();

    const selectCard = (card) => {
        dispatch(sendGameMessage('chooseCard', card));
    };

    const renderHand = (hand, chosenCardIndex) => {
        if (hand) {
            return hand.map((card, index) => (
                <DraftCard
                    key={card.uuid}
                    card={cards[card]}
                    onClick={() => selectCard(card)}
                    onMouseOut={onMouseOut}
                    onMouseOver={() => onMouseOver(cards[card])}
                    selected={index === chosenCardIndex}
                    size={user.settings.cardSize}
                    orientation={cards[card].type === 'plot' ? 'horizontal' : 'vertical'}
                />
            ));
        }
    };

    const setContextMenu = useCallback(
        (menu) => {
            dispatch(setContextMenu(menu));
        },
        [dispatch]
    );

    const updateContextMenu = useCallback(() => {
        if (!currentGame || !user) {
            return;
        }

        let thisPlayer = currentGame.players[user.username];

        if (thisPlayer) {
            setSpectating(false);
        } else {
            setSpectating(true);
        }

        let menuOptions = [{ text: 'Leave Game', onClick: onLeaveClick }];

        if (currentGame && currentGame.started) {
            let spectators = currentGame.spectators.map((spectator) => {
                return <li key={spectator.id}>{spectator.name}</li>;
            });

            let spectatorPopup = <ul className='spectators-popup absolute-panel'>{spectators}</ul>;

            menuOptions.unshift({
                text: 'Spectators: ' + currentGame.spectators.length,
                popup: spectatorPopup
            });

            setContextMenu(menuOptions);
        } else {
            setContextMenu([]);
        }
    }, [currentGame, onLeaveClick, setContextMenu, user]);

    useEffect(() => {
        updateContextMenu();
        $('.modal-backdrop').remove();
    }, [currentGame, user, updateContextMenu]);

    const onMouseOver = (card) => {
        dispatch(zoomCard(card));
    };

    const onMouseOut = () => {
        dispatch(clearZoom());
    };

    const handleChangeGroupBy = (value) => {
        setSelectedGroupBy(value);
    };

    const sendChatMessage = (message) => {
        dispatch(sendGameMessage(message));
    };

    const onPromptButtonClick = (button) => {
        dispatch(sendGameMessage(button.command, button.arg));
    };

    const isDraftActive = useCallback(() => {
        if (!currentGame || !user) {
            return false;
        }

        if (currentGame.draftingTable.draftFinished) {
            return false;
        }

        let thisPlayer = currentGame.players[user.username];
        if (!thisPlayer) {
            thisPlayer = Object.values(currentGame.players)[0];
        }

        let otherPlayers = Object.values(currentGame.players).filter((player) => {
            return player.name !== thisPlayer.name;
        });

        if (!otherPlayers) {
            return false;
        }

        if (otherPlayers.every((player) => player.disconnected || player.left)) {
            return false;
        }

        return true;
    }, [currentGame, user]);

    const onLeaveClick = useCallback(() => {
        if (!spectating && isDraftActive()) {
            toastr.confirm('Your draft is not finished, are you sure you want to leave?', {
                onOk: () => {
                    dispatch(sendLeaveGameMessage());
                }
            });

            return;
        }

        dispatch(sendLeaveGameMessage());
    }, [dispatch, isDraftActive, spectating]);

    if (!currentGame || !cards || !currentGame.started) {
        return <div>Waiting for server...</div>;
    }

    if (!user) {
        dispatch(navigate('/'));
        return <div>You are not logged in, redirecting...</div>;
    }

    const activePlayer = currentGame.draftingTable.activePlayer;
    const { chosenCardIndex, deck, hand } = activePlayer;

    const deckWithCards = deck.map((cardQuantity) => ({
        count: cardQuantity.count,
        code: cardQuantity.code,
        card: cards[cardQuantity.code]
    }));

    return (
        <div className='absolute bottom-0 left-0 top-0 right-0 flex flex-col justify-between'>
            <div>
                <CardZoom
                    imageUrl={cardToZoom ? '/img/cards/' + cardToZoom.code + '.png' : ''}
                    orientation={
                        cardToZoom
                            ? cardToZoom.type === 'plot'
                                ? 'horizontal'
                                : 'vertical'
                            : 'vertical'
                    }
                    show={!!cardToZoom}
                    cardName={cardToZoom ? cardToZoom.name : null}
                    card={cardToZoom ? cards[cardToZoom.code] : null}
                />
                <div className='board-middle'>
                    <div className='draft-current-cards'>
                        <Panel title='Current Hand'>{renderHand(hand, chosenCardIndex)}</Panel>
                    </div>
                    <div className='draft-prompt-area'>
                        <div className='draft-inset-pane'>
                            <DraftPlayerPrompt
                                cards={cards}
                                buttons={activePlayer.buttons}
                                promptText={activePlayer.menuTitle}
                                promptTitle={activePlayer.promptTitle}
                                onButtonClick={onPromptButtonClick}
                                onMouseOver={onMouseOver}
                                onMouseOut={onMouseOut}
                                user={user}
                            />
                        </div>
                    </div>
                    <div className='draft-deck'>
                        <Panel title='Drafted Cards'>
                            <div style={{ textAlign: 'right' }}>
                                <label>
                                    Group by:
                                    <select
                                        value={selectedGroupBy}
                                        onChange={(event) =>
                                            handleChangeGroupBy(event.target.value)
                                        }
                                    >
                                        <option value='type'>Type</option>
                                        <option value='cost'>Cost</option>
                                    </select>
                                </label>
                            </div>
                            <CardTypeGroups
                                cards={deckWithCards}
                                displayFactionIcons
                                groupBy={selectedGroupBy}
                                onCardMouseOut={onMouseOut}
                                onCardMouseOver={onMouseOver}
                                sortCardsBy='faction'
                            />
                        </Panel>
                    </div>
                </div>
                <div className='right-side'>
                    <div className='gamechat'>
                        <GameChat
                            key='gamechat'
                            messages={currentGame.messages}
                            onCardMouseOut={onMouseOut}
                            onCardMouseOver={onMouseOver}
                            onSendChat={sendChatMessage}
                            muted={currentGame.muteSpectators}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DraftingTable;
