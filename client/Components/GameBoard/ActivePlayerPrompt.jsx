import React, { useCallback, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';

import AbilityTargeting from './AbilityTargeting';
import CardNameLookup from './CardNameLookup';
import TraitNameLookup from './TraitNameLookup';
import SelectFromValuesLookup from './SelectFromValuesLookup';
import { useGetCardsQuery } from '../../redux/middleware/api';
import { Button, Kbd } from '@heroui/react';
import { useSelector } from 'react-redux';
import ThronesIcon from './ThronesIcon';
import LoadingSpinner from '../Site/LoadingSpinner';
import CardHoverable from '../Images/CardHoverable';
import ResponseDelay from './ResponseDelay';
import {
    getButtonShortcutLabel,
    getPromptButtonIndex,
    isPromptShortcutKey,
    isShortcutEvent,
    keyboardShortcutsEnabled
} from './keyboardShortcuts';

const EndTurnDelay = 500;

const ActivePlayerPrompt = ({
    className,
    onButtonClick,
    buttons,
    controls,
    promptTitle,
    phase,
    promptText
}) => {
    const { data: cards, isLoading } = useGetCardsQuery();
    const [pausedPromptId, setPausedPromptId] = useState();
    const shortcutsEnabled = useSelector((state) =>
        keyboardShortcutsEnabled(state.auth.user?.settings)
    );

    // Ignore a press that lands just after the buttons change, such as one meant for a window
    // that closed under the cursor. A button that ends your turn in the phase waits longer, and
    // shows as disabled while it does, as it often replaces a Pass button the player is pressing.
    const buttonsShownAt = useRef(0);
    const pressDelay = useRef(300);
    const [endTurnReady, setEndTurnReady] = useState(true);
    const buttonsKey = (buttons || [])
        .map((button) => `${button.promptId}:${button.text}`)
        .join('|');
    const endsTurn = (buttons || []).some((button) => button.endsTurn);
    useEffect(() => {
        buttonsShownAt.current = Date.now();
        pressDelay.current = endsTurn ? EndTurnDelay : 300;
        if (!endsTurn) {
            return;
        }

        setEndTurnReady(false);
        const timer = setTimeout(() => setEndTurnReady(true), EndTurnDelay);
        return () => clearTimeout(timer);
    }, [buttonsKey, endsTurn]);
    const isFreshPress = () => Date.now() - buttonsShownAt.current < pressDelay.current;

    const handleButtonClick = useCallback(
        (event, button) => {
            if (isFreshPress()) {
                return;
            }

            // A clicked button keeps focus, and Space or Enter would then press whichever
            // button takes its place in the next prompt.
            if (event && event.pointerType !== 'keyboard') {
                event.target?.blur?.();
            }

            let googleFormMatcher =
                button.arg && button.arg.toString().match(/^googleForm:(?<formId>.+)$/);
            if (googleFormMatcher) {
                window.open(
                    `https://forms.gle/${googleFormMatcher.groups.formId}`,
                    '_blank',
                    'noopener,noreferrer'
                );
                return;
            }

            if (button.pausesTimer) {
                setPausedPromptId(button.promptId);
            }

            if (onButtonClick) {
                onButtonClick(button);
            }
        },
        [onButtonClick]
    );

    const latestButtons = useRef(buttons);
    const latestHandleButtonClick = useRef(handleButtonClick);
    useEffect(() => {
        latestButtons.current = buttons;
        latestHandleButtonClick.current = handleButtonClick;
    });

    useEffect(() => {
        if (!shortcutsEnabled) {
            return;
        }

        const onKeyDown = (event) => {
            const currentButtons = latestButtons.current;
            if (
                !currentButtons ||
                currentButtons.length === 0 ||
                !isPromptShortcutKey(event) ||
                !isShortcutEvent(event)
            ) {
                return;
            }

            event.preventDefault();

            const button = currentButtons[getPromptButtonIndex(event, currentButtons)];
            if (button && !button.disabled) {
                latestHandleButtonClick.current(null, button);
            }
        };

        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [shortcutsEnabled]);

    const handleLookupValueSelected = useCallback(
        (command, method, promptId, cardName) => {
            if (onButtonClick) {
                onButtonClick({
                    command: command,
                    arg: cardName,
                    method: method,
                    promptId: promptId
                });
            }
        },
        [onButtonClick]
    );

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
                    className='text-wrap text-xs h-8 md:h-full md:min-h-10 md:text-small'
                    onPress={(event) => handleButtonClick(event, button)}
                    isDisabled={button.disabled || (button.endsTurn && !endTurnReady)}
                    disableRipple
                    fullWidth
                >
                    {button.icon && (
                        <ThronesIcon icon={button.icon} withBackground noSize={false} />
                    )}
                    <span>{button.text}</span>
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

    const getControls = useCallback(() => {
        if (!controls) {
            return null;
        }

        return controls.map((control) => {
            switch (control.type) {
                case 'targeting':
                    return (
                        <AbilityTargeting
                            key={control.promptId}
                            source={control.source}
                            targets={control.targets}
                        />
                    );
                case 'card-name':
                    return (
                        <CardNameLookup
                            key={control.promptId}
                            cards={cards}
                            onValueSelected={handleLookupValueSelected.bind(
                                this,
                                control.command,
                                control.method,
                                control.promptId
                            )}
                        />
                    );
                case 'trait-name':
                    return (
                        <TraitNameLookup
                            key={control.promptId}
                            cards={cards}
                            onValueSelected={handleLookupValueSelected.bind(
                                this,
                                control.command,
                                control.method,
                                control.promptId
                            )}
                        />
                    );
                case 'response-delay':
                    return (
                        <ResponseDelay
                            key={`${control.type}-${control.promptId}`}
                            duration={control.duration}
                            paused={control.paused || control.promptId === pausedPromptId}
                        />
                    );
                case 'select-from-values':
                    return (
                        <SelectFromValuesLookup
                            key={control.promptId}
                            selectableValues={control.selectableValues}
                            onValueSelected={handleLookupValueSelected.bind(
                                this,
                                control.command,
                                control.method,
                                control.promptId
                            )}
                        />
                    );
            }
        });
    }, [controls, cards, handleLookupValueSelected, pausedPromptId]);

    // A wait shown to every player who might be able to respond, so their opponents can't tell
    // who really can.
    const responseDelay = controls && controls.find((control) => control.type === 'response-delay');
    if (responseDelay) {
        const word = responseDelay.abilityWord || 'response';
        promptText = `Any ${word}s?`;
    }

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
                    {getControls()}
                    <div className='flex flex-col mx-2 gap-0.5 md:gap-1 mb-1'>{getButtons()}</div>
                </div>
            </div>
        </div>
    );
};

export default ActivePlayerPrompt;
