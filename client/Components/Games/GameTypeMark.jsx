import React from 'react';
import classNames from 'classnames';
import { GameTypes } from '../../constants';

const typeStyles = {
    beginner: { mark: 'bg-success', text: 'text-success' },
    casual: { mark: 'bg-warning', text: 'text-warning' },
    competitive: { mark: 'bg-danger', text: 'text-danger' }
};

export const GameTypeDiamond = ({ gameType, className }) => (
    <span
        aria-hidden
        className={classNames(
            'inline-block size-2 shrink-0 rotate-45',
            typeStyles[gameType]?.mark ?? 'bg-ink-faint',
            className
        )}
    />
);

const GameTypeMark = ({ gameType, className }) => (
    <span
        className={classNames(
            'inline-flex items-center gap-1.5',
            typeStyles[gameType]?.text,
            className
        )}
    >
        <GameTypeDiamond gameType={gameType} />
        {GameTypes.find((type) => type.name === gameType)?.label ?? gameType}
    </span>
);

export default GameTypeMark;
