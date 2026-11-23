import React, { useState } from 'react';
import classNames from 'classnames';
import { Button, Input, Modal, ModalBody, ModalContent, ModalHeader } from '@heroui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faSearch, faUsers } from '@fortawesome/free-solid-svg-icons';
import { touchCloseButton } from '../touchCloseButton';

// From this many spectators the list can be searched
export const searchFrom = 10;

// Who is watching, in a line short enough for a menu row: up to two names, then how many more
export const spectatorPreview = (spectators) => {
    const names = spectators.map((spectator) => spectator.name);
    if (names.length === 0) {
        return 'No one is watching';
    }
    if (names.length <= 2) {
        return names.join(' and ');
    }
    return `${names[0]}, ${names[1]} and ${names.length - 2} more`;
};

export const findSpectators = (spectators, search) => {
    const wanted = search.trim().toLowerCase();
    return wanted
        ? spectators.filter((spectator) => spectator.name?.toLowerCase().includes(wanted))
        : spectators;
};

// Every spectator by name, searchable once there are many. fill: takes the height it is given (the sheet) rather
// than its own limit (the bar's popover).
export const SpectatorList = ({ spectators, fill = false, heading = true }) => {
    const [search, setSearch] = useState('');
    const shown = findSpectators(spectators, search);
    return (
        <div
            className={classNames('flex min-w-[10rem] flex-col gap-1.5 text-small', {
                'min-h-0 flex-1': fill
            })}
        >
            {heading && (
                <div className='flex items-center gap-2 font-semibold'>
                    <FontAwesomeIcon icon={faUsers} className='w-4' />
                    {`Spectators (${spectators.length})`}
                </div>
            )}
            {spectators.length >= searchFrom && (
                <Input
                    size='sm'
                    aria-label='Find a spectator'
                    placeholder='Find a spectator'
                    value={search}
                    onValueChange={setSearch}
                    isClearable
                    onClear={() => setSearch('')}
                    startContent={<FontAwesomeIcon icon={faSearch} className='text-default-400' />}
                />
            )}
            {spectators.length === 0 ? (
                <span className='text-default-500'>No one is watching</span>
            ) : shown.length === 0 ? (
                <span className='text-default-500'>No spectator by that name</span>
            ) : (
                <ul
                    className={classNames(
                        'flex flex-col gap-0.5 overflow-y-auto',
                        fill ? 'min-h-0 flex-1' : 'max-h-60'
                    )}
                >
                    {shown.map((spectator) => (
                        <li
                            key={spectator.id ?? spectator.name}
                            className='shrink-0 truncate py-0.5 text-default-600'
                        >
                            {spectator.name}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

// The list on its own sheet, from the game menu: rising from the bottom on a phone, in the middle on a larger screen.
// onToggleMute: a player can mute the spectators' chat from it.
export const SpectatorSheet = ({ isOpen, onOpenChange, spectators, muted, onToggleMute }) => (
    <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement='auto'
        scrollBehavior='inside'
        size='sm'
        classNames={{ base: 'max-h-[75dvh] sm:max-h-[70vh]', closeButton: touchCloseButton }}
    >
        <ModalContent>
            <ModalHeader className='flex items-center gap-2 pr-12'>
                <FontAwesomeIcon icon={faUsers} className='w-4' />
                <span className='flex-1'>{`Spectators (${spectators.length})`}</span>
                {onToggleMute && (
                    <Button
                        size='sm'
                        variant='flat'
                        startContent={<FontAwesomeIcon icon={muted ? faEyeSlash : faEye} />}
                        title={muted ? 'Spectators cannot chat' : 'Spectators can chat'}
                        onPress={onToggleMute}
                    >
                        {muted ? 'Un-mute' : 'Mute'}
                    </Button>
                )}
            </ModalHeader>
            <ModalBody className='flex min-h-0 flex-col pb-4'>
                <SpectatorList spectators={spectators} fill heading={false} />
            </ModalBody>
        </ModalContent>
    </Modal>
);
