import React from 'react';
import { Button } from '@heroui/react';
import classNames from 'classnames';
import UserAvatar from '../Site/UserAvatar';
import DeckStatus from '../Decks/DeckStatus';
import { Constants } from '../../constants';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock } from '@fortawesome/free-solid-svg-icons';

const PendingGamePlayers = ({ currentGame, user, onSelectDeck }) => {
    const players = Object.values(currentGame.players).sort((a, b) => a.seatNo - b.seatNo);
    const openSeats = Math.max(0, (currentGame.maxPlayers ?? 2) - players.length);
    const me = players.find((player) => player.name === user?.username);
    const isDeckLocked = !!(currentGame.event?.lockDecks && me?.deck?.locked);

    return (
        <ul className='border-t border-gold-hair'>
            {players.map((player) => {
                const playerIsMe = player.name === user?.username;
                const deck = player.deck;

                return (
                    <li
                        key={player.name}
                        className='flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-gold-hair px-0.5 py-3'
                    >
                        <span className='flex min-w-[min(100%,11rem)] flex-1 items-center gap-2.5'>
                            <UserAvatar username={player.name} />
                            <span
                                className={classNames(
                                    'truncate text-ink',
                                    player.role &&
                                        Constants.ColorClassByRole[player.role.toLowerCase()]
                                )}
                            >
                                {player.name}
                            </span>
                            {player.name === currentGame.owner && (
                                <span className='text-xs text-ink-faint'>Host</span>
                            )}
                        </span>
                        {playerIsMe ? (
                            <span className='flex min-w-0 flex-wrap items-center gap-2'>
                                {deck?.selected && <DeckStatus deck={deck} />}
                                <Button
                                    size='sm'
                                    variant={deck?.selected ? 'tertiary' : 'primary'}
                                    className='max-w-full'
                                    onPress={onSelectDeck}
                                    isDisabled={isDeckLocked}
                                >
                                    {isDeckLocked && <FontAwesomeIcon icon={faLock} />}
                                    <span className='truncate'>
                                        {deck?.selected ? deck.name : 'Choose a deck'}
                                    </span>
                                </Button>
                            </span>
                        ) : (
                            <span
                                className={classNames(
                                    'text-sm',
                                    deck?.selected ? 'text-ink-dim' : 'text-ink-faint'
                                )}
                            >
                                {deck?.selected ? 'Deck chosen' : 'Choosing a deck'}
                            </span>
                        )}
                    </li>
                );
            })}
            {Array.from({ length: openSeats }, (_, index) => (
                <li
                    key={`open-${index}`}
                    className='flex items-center gap-2.5 border-b border-gold-hair px-0.5 py-3 text-sm italic text-ink-faint'
                >
                    <span
                        aria-hidden
                        className='size-10 shrink-0 rounded-full border border-dashed border-gold-line'
                    />
                    Open seat
                </li>
            ))}
        </ul>
    );
};

export default PendingGamePlayers;
