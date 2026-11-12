import React from 'react';
import { cardBoxClass } from '../../cardScale';

const maxLayers = 6;
const steps = [1, 4, 10, 20, 30, 40];
const stepRem = 0.075;

// How many edges of cards show under the top card of a pile: one for a few cards, more as it grows
export const depthLayers = (count) => steps.filter((step) => count >= step).length;

// How far the top of a pile stands above the table: the bottom card lies on the pile's outline
export const pileRise = (count) =>
    `calc(var(--card-scale, 1) * ${depthLayers(count) * stepRem}rem)`;

// Raised to the top of the pile it is in: --pile-rise is set by the pile, and is zero elsewhere
export const raisedStyle = {
    translate: '0 calc(-1 * var(--pile-rise, 0px))',
    transitionProperty: 'translate'
};

// The cards on top of a deep pile. Moving them up makes them a layer of their own, which is put at the level
// cards lie at, so the board's zone stays under them where the pile stands up into it.
export const raisedStackStyle = { ...raisedStyle, zIndex: 200 };

// The cards under the top one, seen as thin edges along the bottom of the pile, as if looking slightly down
// at it. The lowest lies on the outline and each one above is a step higher, up to the top card. They stay
// in place and fade in or out, so a pile gaining or losing cards settles.
const PileDepth = ({ count, orientation }) => {
    const layers = depthLayers(count);

    return (
        <>
            {Array.from({ length: maxLayers }, (_, height) => (
                <div
                    key={height}
                    className={`${cardBoxClass(orientation)} shift-smooth pointer-events-none absolute left-0 top-0 rounded-[calc(var(--card-scale,1)*0.25rem)] border-b border-black/60`}
                    style={{
                        opacity: height < layers ? 1 : 0,
                        translate: `0 calc(var(--card-scale, 1) * ${-height * stepRem}rem)`,
                        background: height % 2 ? '#5d5d5d' : '#4b4b4b',
                        transitionProperty: 'opacity'
                    }}
                />
            ))}
        </>
    );
};

export default PileDepth;
