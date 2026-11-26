import React, { useCallback } from 'react';
import classNames from 'classnames';

import { Button, Kbd } from '@heroui/react';
import ThronesIcon from './ThronesIcon';
import LoadingSpinner from '../Site/LoadingSpinner';
import CardHoverable from '../Images/CardHoverable';
import { getButtonShortcutLabel } from './keyboardShortcuts';
import { PromptControls, usePromptActions } from './usePromptActions';
import PendingMark, { pendingButtonClass } from './PendingMark';

const ActivePlayerPrompt = ({
    className,
    onButtonClick,
    buttons,
    controls,
    promptTitle,
    phase,
    promptText: serverPromptText
}) => {
    const {
        cards,
        isLoading,
        pausedPromptId,
        shortcutsEnabled,
        promptText,
        endsTurn,
        endTurnReady,
        handleButtonClick,
        handleLookupValueSelected
    } = usePromptActions({ buttons, controls, promptText: serverPromptText, onButtonClick });

    const getButtons = useCallback(() => {
        if (!buttons) {
            return null;
        }

        return buttons.map((button, index) => {
            const shortcutLabel =
                shortcutsEnabled && !button.disabled && getButtonShortcutLabel(buttons, index);
            const buttonRet = (
                <Button
                    type='button'
                    variant={button.cancel ? 'tertiary' : 'primary'}
                    className={classNames(
                        'text-wrap text-xs h-8 md:h-full md:min-h-10 md:text-sm',
                        button.pending && pendingButtonClass
                    )}
                    onPress={(event) => handleButtonClick(event, button)}
                    isDisabled={button.disabled || (button.endsTurn && !endTurnReady)}
                    fullWidth
                >
                    {button.icon && (
                        <ThronesIcon icon={button.icon} withBackground noSize={false} />
                    )}
                    <span>{button.text}</span>
                    {button.pending && <PendingMark />}
                    {shortcutLabel && (
                        <Kbd className='absolute left-1 top-1/2 hidden -translate-y-1/2 bg-transparent text-xs text-current opacity-60 shadow-none md:inline-flex'>
                            <Kbd.Content>{shortcutLabel}</Kbd.Content>
                        </Kbd>
                    )}
                </Button>
            );

            return (
                <div className='w-full' key={index}>
                    {button.card ? (
                        <CardHoverable code={button.card.code}>{buttonRet}</CardHoverable>
                    ) : (
                        buttonRet
                    )}
                </div>
            );
        });
    }, [buttons, endTurnReady, handleButtonClick, shortcutsEnabled]);

    const promptTextElement = [];
    if (promptText && promptText.includes('\n')) {
        for (const [index, token] of promptText.split('\n').entries()) {
            promptTextElement.push(token);
            promptTextElement.push(<br key={index} />);
        }
    } else {
        promptTextElement.push(promptText);
    }

    const panelClass =
        'border border-gold-line bg-[#0c0d11]/95 shadow-[0_12px_30px_rgba(0,0,0,0.6)]';

    if (isLoading) {
        return (
            <div className={className}>
                <div className={classNames(panelClass, 'py-8')}>
                    <LoadingSpinner />
                </div>
            </div>
        );
    }

    return (
        <div className={className}>
            <div className={classNames(panelClass, 'text-center')}>
                <div className='border-b border-gold-hair px-2 py-1 font-display text-xs font-semibold text-gold first-letter:uppercase md:text-sm'>
                    {`${phase} phase`}
                </div>
                {promptTitle && (
                    <div
                        className={classNames(
                            'px-2 pt-1.5 text-xs md:text-sm',
                            endsTurn ? 'font-semibold text-gold' : 'text-ink-dim'
                        )}
                    >
                        {promptTitle}
                    </div>
                )}
                <p className='mx-2 my-1 text-xs text-ink md:text-sm'>{promptTextElement}</p>
                <PromptControls
                    controls={controls}
                    cards={cards}
                    pausedPromptId={pausedPromptId}
                    onLookupValueSelected={handleLookupValueSelected}
                />
                <div className='mx-2 mb-2 flex flex-col gap-0.5 md:gap-1'>{getButtons()}</div>
            </div>
        </div>
    );
};

export default ActivePlayerPrompt;
