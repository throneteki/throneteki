import React, { forwardRef } from 'react';
import classNames from 'classnames';
import Button from './Button';

// An action taken in the game, such as a prompt's choice or joining a game: a gold outline, washed with gold under
// the pointer. quiet: a way out (cancel, pass), drawn as a quiet button. Site controls (saving, settings, forms) use the
// ordinary buttons instead.
export const gameActionClass = (quiet = false) =>
    classNames(
        'min-w-0 gap-1 rounded border font-medium transition-[background-color,border-color,color] duration-150 data-[disabled=true]:opacity-40',
        quiet
            ? 'border-edge bg-quiet text-ink data-[hovered=true]:bg-quiet-hover data-[pressed=true]:bg-quiet-hover'
            : 'border-action bg-panel/80 text-action-fg data-[hovered=true]:bg-action-wash data-[pressed=true]:bg-action-wash data-[focus-visible=true]:border-action'
    );

const GameActionButton = forwardRef(function GameActionButton(
    { quiet = false, className, ...props },
    ref
) {
    return (
        <Button
            ref={ref}
            variant='outline'
            {...props}
            className={classNames(gameActionClass(quiet), className)}
        />
    );
});

export default GameActionButton;
