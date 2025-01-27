import React, { useMemo } from 'react';
import classNames from 'classnames';
import { Avatar } from '@heroui/react';

const GamePlayer = (props) => {
    let classes = classNames('flex flex-col flex-1', {
        'mr-2 items-end': props.firstPlayer,
        'ml-2 items-start': !props.firstPlayer
    });

    let playerAndFactionAgenda;

    const agendaImages = useMemo(() => {
        return props.player.agendas?.map((agenda) => (
            <div key={agenda} className='w-8'>
                {<img className='rounded-md' src={`/img/cards/${agenda || 'cardback'}.png`} />}
            </div>
        ));
    }, [props.player.agendas]);

    if (props.firstPlayer) {
        playerAndFactionAgenda = (
            <div className='flex items-center flex-1'>
                <div className='text-normal whitespace-nowrap flex items-center gap-2 mr-2'>
                    <span className='ml-2'>
                        <Avatar src={`/img/avatar/${props.player.name}.png`} showFallback />{' '}
                    </span>
                    <span className='text-bold'>{props.player.name}</span>
                </div>
                {agendaImages}
                <div className='w-12 rounded-md ml-2'>
                    {<img src={`/img/cards/${props.player.faction || 'cardback'}.png`} />}
                </div>
            </div>
        );
    } else {
        playerAndFactionAgenda = (
            <div className='flex items-center flex-1'>
                <div className='w-12 rounded-md mr-2'>
                    {<img src={`/img/cards/${props.player.faction || 'cardback'}.png`} />}
                </div>
                {props.player.agendas?.map((agenda) => (
                    <div key={agenda} className='w-8'>
                        {
                            <img
                                className='rounded-md'
                                src={`/img/cards/${agenda || 'cardback'}.png`}
                            />
                        }
                    </div>
                ))}
                <div className='text-normal whitespace-nowrap flex items-center ml-2'>
                    <span className='text-bold'>{props.player.name}</span>
                    <span className='ml-2'>
                        <Avatar src={`/img/avatar/${props.player.name}.png`} showFallback />{' '}
                    </span>
                </div>
            </div>
        );
    }

    return (
        <div key={props.player.name} className={classes}>
            <div>{playerAndFactionAgenda}</div>
        </div>
    );
};

export default GamePlayer;
