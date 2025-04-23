import React, { useMemo } from 'react';
import classNames from 'classnames';
import { Avatar } from '@heroui/react';
import CardImage from '../Images/CardImage';

const GamePlayerSlot = ({ player, className, position = 'left' }) => {
    const factionAgendas = useMemo(() => {
        const className = classNames('flex items-center gap-1', {
            'flex-row': position === 'right',
            'flex-row-reverse': position === 'left'
        });
        const faction = (
            <CardImage key='faction' size='normal' code={player.faction || 'cardback'} />
        );
        const agendas =
            player.agendas?.map((agenda) => (
                <CardImage key={agenda} size='small' code={agenda || 'cardback'} />
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
                    <Avatar src={`/img/avatar/${player.name}.png`} showFallback />{' '}
                </span>
                <span className='text-bold'>{player.name}</span>
            </div>
        );
    }, [player, position]);
    const wrapperClassName = classNames(
        'flex flex-col justify-end gap-1',
        {
            'md:flex-row': position === 'left',
            'md:flex-row-reverse': position === 'right'
        },
        className
    );

    return (
        <div className={wrapperClassName}>
            {avatarName}
            {factionAgendas}
        </div>
    );
};

export default GamePlayerSlot;
