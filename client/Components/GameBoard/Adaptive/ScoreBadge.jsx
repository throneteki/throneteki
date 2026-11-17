import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import classNames from 'classnames';
import { Avatar } from '@heroui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { Constants } from '../../../constants';
import { sendChangeStatMessage } from '../../../redux/reducers/game';

const stats = [
    { code: 'totalPower', change: 'power', name: 'Power' },
    { code: 'gold', change: 'gold', name: 'Gold' }
];

// A player's power and gold, large with their icons, beside their avatar. In manual mode our own can be tapped
// to change them.
const ScoreBadge = ({ player, align = 'start', showName = false, canChange = false }) => {
    const dispatch = useDispatch();
    const [changing, setChanging] = useState(null);
    if (!player) {
        return null;
    }
    const username = player.user?.username;

    const avatar = (
        <div className='relative shrink-0' title={player.firstPlayer ? 'First player' : undefined}>
            <Avatar
                src={username ? `/img/avatar/${username}.png` : undefined}
                showFallback
                name={username}
                className={classNames('h-6 w-6 text-tiny', {
                    'ring-2 ring-warning': player.firstPlayer
                })}
            />
            {player.firstPlayer && (
                <span className='absolute -bottom-1 -right-1.5 rounded-full bg-warning px-0.5 text-[8px] font-bold leading-none text-black'>
                    1st
                </span>
            )}
        </div>
    );

    return (
        <div
            data-score={username}
            className={classNames('flex min-w-0 items-center gap-1.5 normal-case tracking-normal', {
                'flex-row-reverse': align === 'end'
            })}
        >
            {avatar}
            {showName && (
                <span className='truncate text-xs font-semibold text-default-300'>{username}</span>
            )}
            {stats.map((stat) => (
                <div key={stat.code} className='flex items-center gap-0.5'>
                    <button
                        type='button'
                        disabled={!canChange}
                        title={stat.name}
                        className={classNames('flex items-center gap-0.5', {
                            'rounded-md ring-1 ring-danger/60': canChange
                        })}
                        onClick={() => setChanging(changing === stat.code ? null : stat.code)}
                    >
                        <img
                            src={Constants.StatIconImagePaths[stat.code]}
                            alt=''
                            className='h-5 w-5'
                        />
                        <span className='text-base font-bold leading-none text-white'>
                            {player.stats?.[stat.code] ?? 0}
                        </span>
                    </button>
                    {canChange && changing === stat.code && (
                        <span className='flex gap-0.5'>
                            {[
                                [-1, faMinus],
                                [1, faPlus]
                            ].map(([step, icon]) => (
                                <button
                                    key={step}
                                    type='button'
                                    title={`${step > 0 ? 'Raise' : 'Reduce'} ${stat.name}`}
                                    className='h-5 w-5 rounded bg-default-200 text-[10px]'
                                    onClick={() =>
                                        dispatch(sendChangeStatMessage(stat.change, step))
                                    }
                                >
                                    <FontAwesomeIcon icon={icon} />
                                </button>
                            ))}
                        </span>
                    )}
                </div>
            ))}
        </div>
    );
};

export default ScoreBadge;
