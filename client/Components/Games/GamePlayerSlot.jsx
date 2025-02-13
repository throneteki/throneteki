import React, { useMemo } from 'react';
import classNames from 'classnames';
import { Avatar, Button } from '@heroui/react';

const GamePlayerSlot = ({ player, showJoinButton, onJoinGame, position = 'left' }) => {
    const factionAgendas = useMemo(() => {
        const className = classNames('flex items-center gap-1', {
            'flex-row': position === 'right',
            'flex-row-reverse': position === 'left'
        });
        const faction = (
            <div key='faction' className='w-12 rounded-md'>
                {
                    <img
                        className='rounded-md'
                        src={`/img/cards/${player?.faction || 'cardback'}.png`}
                    />
                }
            </div>
        );
        const agendas =
            player?.agendas?.map((agenda) => (
                <div key={agenda} className='w-8'>
                    {<img className='rounded-md' src={`/img/cards/${agenda || 'cardback'}.png`} />}
                </div>
            )) || [];

        return <div className={className}>{[faction, ...agendas]}</div>;
    }, [player, position]);

    const avatarName = useMemo(() => {
        const className = classNames(
            'text-normal whitespace-nowrap flex items-center justify-end gap-2',
            {
                'flex-row': position === 'left',
                'flex-row-reverse': position === 'right'
            }
        );
        return (
            <div className={className}>
                <span>
                    <Avatar src={`/img/avatar/${player?.name}.png`} showFallback />{' '}
                </span>
                <span className='text-bold'>{player?.name}</span>
            </div>
        );
    }, [player, position]);

    if (player) {
        const className = classNames('flex flex-col justify-end gap-1 w-1/2 py-4 px-2', {
            'md:flex-row': position === 'left',
            'md:flex-row-reverse': position === 'right'
        });
        return (
            <div className={className}>
                {avatarName}
                {factionAgendas}
            </div>
        );
    } else {
        return (
            <div className='flex items-center w-1/2 py-4 px-2'>
                {showJoinButton && (
                    <Button size='sm' color='primary' onPress={onJoinGame}>
                        Join
                    </Button>
                )}
            </div>
        );
    }
};

export default GamePlayerSlot;
