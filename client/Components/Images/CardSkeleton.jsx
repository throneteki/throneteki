import React from 'react';
import classNames from 'classnames';

// Where each type's card lays out its parts, as boxes in percent of the card: [left, top, width, height]. Upright
// cards are drawn at 300 by 420, plots on their side at 420 by 300.
const cost = { box: [4, 2, 16, 11.5], shape: 'circle' };
const templates = {
    character: [
        { box: [14, 0, 86, 62], shape: 'art' },
        cost,
        { box: [5, 28, 13, 9.5], shape: 'circle' },
        { box: [5, 40, 13, 9.5], shape: 'circle' },
        { box: [5, 53, 13, 9.5], shape: 'shield' },
        { box: [24, 61.5, 66, 4.5], shape: 'bar' },
        { box: [4, 67, 92, 27], shape: 'text', lines: 3 }
    ],
    location: [
        { box: [18, 0, 82, 62], shape: 'art' },
        cost,
        { box: [5, 15, 10, 46], shape: 'bar' },
        { box: [4, 64, 92, 29], shape: 'text', lines: 3 }
    ],
    attachment: [
        { box: [4, 7, 92, 52], shape: 'oval' },
        cost,
        { box: [8, 60, 84, 25], shape: 'text', lines: 3 },
        { box: [12, 88, 76, 4.5], shape: 'bar' }
    ],
    event: [
        cost,
        { box: [26, 3.5, 66, 5], shape: 'bar' },
        { box: [4, 13, 92, 46], shape: 'art' },
        { box: [6, 60, 88, 32], shape: 'text', lines: 4 }
    ],
    agenda: [
        { box: [10, 3, 80, 5], shape: 'bar' },
        { box: [4, 10, 92, 53], shape: 'art' },
        { box: [4, 66, 92, 26], shape: 'text', lines: 3 }
    ],
    title: [
        { box: [10, 3, 80, 5], shape: 'bar' },
        { box: [4, 10, 92, 28], shape: 'art' },
        { box: [8, 40, 84, 42], shape: 'text', lines: 5 },
        { box: [36, 84, 12, 8.5], shape: 'circle' },
        { box: [52, 84, 12, 8.5], shape: 'circle' }
    ],
    faction: [
        { box: [8, 3, 84, 5], shape: 'bar' },
        { box: [15, 16, 70, 62], shape: 'crest' },
        { box: [12, 84, 76, 5], shape: 'bar' }
    ],
    plot: [
        { box: [0, 0, 100, 52], shape: 'art' },
        { box: [2, 50, 9, 12.5], shape: 'circle' },
        { box: [12, 50, 9, 12.5], shape: 'diamond' },
        { box: [22, 50, 9, 12.5], shape: 'circle' },
        { box: [34, 53, 56, 6], shape: 'bar' },
        { box: [3, 64, 84, 25], shape: 'text', lines: 3 },
        { box: [89, 78, 8, 11], shape: 'circle' }
    ],
    back: [
        { box: [6, 5, 88, 90], shape: 'frame' },
        { box: [28, 35, 44, 31], shape: 'circle' }
    ]
};

const shapeClass = {
    art: 'rounded-sm bg-zinc-700/60',
    oval: 'rounded-[50%] bg-zinc-700/60',
    circle: 'rounded-full bg-zinc-600',
    diamond: 'rotate-45 scale-75 rounded-sm bg-zinc-600',
    shield: 'rounded-b-[45%] rounded-t-sm bg-zinc-600',
    crest: 'rounded-b-[45%] rounded-t-md bg-zinc-700/60',
    bar: 'rounded-full bg-zinc-600',
    text: 'flex flex-col justify-center gap-[12%] rounded-sm bg-zinc-800 px-[6%]',
    frame: 'rounded-sm border-2 border-zinc-600'
};

// Text lines, each shorter than a full line by a little more, so they read as a paragraph
const lineWidths = ['90%', '100%', '80%', '95%', '65%'];

const Part = ({ box: [left, top, width, height], shape, lines }) => (
    <div
        className={classNames('absolute', shapeClass[shape])}
        style={{ left: `${left}%`, top: `${top}%`, width: `${width}%`, height: `${height}%` }}
    >
        {lines &&
            lineWidths
                .slice(0, lines)
                .map((lineWidth, index) => (
                    <div
                        key={index}
                        className='h-[9%] min-h-px rounded-full bg-zinc-600/80'
                        style={{ width: lineWidth }}
                    />
                ))}
    </div>
);

// A card-shaped placeholder while the image loads, gently pulsing: laid out as its type's card is when the type is
// known (kind), otherwise a frame, the art and a text box
const CardSkeleton = ({ kind, orientation }) => {
    const template = templates[kind];
    return (
        <div
            aria-hidden
            data-card-skeleton={kind ?? ''}
            className='absolute inset-0 rounded-[inherit] border border-zinc-700 bg-zinc-900'
        >
            {template ? (
                <div className='absolute inset-0 animate-pulse'>
                    {template.map((part, index) => (
                        <Part key={index} {...part} />
                    ))}
                </div>
            ) : (
                <div
                    className={classNames(
                        'absolute inset-[7%] flex animate-pulse gap-[6%] rounded-[inherit]',
                        orientation === 'horizontal' ? 'flex-row' : 'flex-col'
                    )}
                >
                    <div className='flex-[3] rounded-sm bg-zinc-800' />
                    <div className='flex flex-[2] flex-col justify-center gap-[12%]'>
                        <div className='h-[14%] w-4/5 rounded-full bg-zinc-800' />
                        <div className='h-[14%] w-full rounded-full bg-zinc-800' />
                        <div className='h-[14%] w-3/5 rounded-full bg-zinc-800' />
                    </div>
                </div>
            )}
        </div>
    );
};

// The template for a card: its back, its type, or, where the type is not given, what its image says it is
export const skeletonKind = (code, type, orientation, isFaction) => {
    if (code?.startsWith('cardback')) {
        return 'back';
    }
    if (templates[type]) {
        return type;
    }
    if (isFaction) {
        return 'faction';
    }
    return orientation === 'horizontal' ? 'plot' : undefined;
};

export default CardSkeleton;
