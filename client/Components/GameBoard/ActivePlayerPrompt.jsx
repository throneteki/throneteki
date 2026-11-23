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
                    color={button.cancel ? 'default' : 'primary'}
                    className={classNames(
                        'text-wrap text-xs h-8 md:h-full md:min-h-10 md:text-small',
                        button.pending && pendingButtonClass
                    )}
                    onPress={(event) => handleButtonClick(event, button)}
                    isDisabled={button.disabled || (button.endsTurn && !endTurnReady)}
                    disableRipple
                    fullWidth
                >
                    {button.icon && (
                        <ThronesIcon icon={button.icon} withBackground noSize={false} />
                    )}
                    <span>{button.text}</span>
                    {button.pending && <PendingMark />}
                    {shortcutLabel && (
                        <Kbd className='hidden md:inline-flex absolute left-1 top-1/2 -translate-y-1/2 text-tiny bg-transparent shadow-none opacity-60'>
                            {shortcutLabel}
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
        let split = promptText.split('\n');
        for (let token of split) {
            promptTextElement.push(token);
            promptTextElement.push(<br />);
        }
    } else {
        promptTextElement.push(promptText);
    }

    if (isLoading) {
        return (
            <div className={className}>
                <div className='relative border-1 border-default-200 bg-black/65 rounded-md py-8'>
                    <LoadingSpinner />
                </div>
            </div>
        );
    }

    return (
        <div className={className}>
            <div
                className={
                    'relative text-xs md:text-small lg:text-medium font-bold text-center uppercase border-1 border-default-200 bg-secondary-200 py-1 rounded-t-md mx-0 mb-0'
                }
            >
                {`${phase} phase`}
            </div>
            {promptTitle && (
                <div
                    className={classNames(
                        'text-xs md:text-small lg:text-medium text-center border-1 border-default-200 py-1',
                        endsTurn ? 'bg-primary font-bold' : 'bg-black/65 font-normal'
                    )}
                >
                    {promptTitle}
                </div>
            )}
            <div className='text-center'>
                <div className='relative border-1 border-default-200 bg-black/65 rounded-b-md'>
                    <p className='my-1 mx-2 text-xs md:text-small'>{promptTextElement}</p>
                    <PromptControls
                        controls={controls}
                        cards={cards}
                        pausedPromptId={pausedPromptId}
                        onLookupValueSelected={handleLookupValueSelected}
                    />
                    <div className='flex flex-col mx-2 gap-0.5 md:gap-1 mb-1'>{getButtons()}</div>
                </div>
            </div>
        </div>
    );
};

export default ActivePlayerPrompt;
