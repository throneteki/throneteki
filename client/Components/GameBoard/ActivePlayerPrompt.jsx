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
                    variant={button.cancel ? 'tertiary' : 'primary'}
                    className='text-wrap text-xs h-8 md:h-full md:min-h-10 md:text-sm'
                    onPress={(event) => handleButtonClick(event, button)}
                    isDisabled={button.disabled || (button.endsTurn && !endTurnReady)}
                    fullWidth
                >
                    {button.icon && (
                        <ThronesIcon icon={button.icon} withBackground noSize={false} />
                    )}
                    <span>{button.text}</span>
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
                {getControls()}
                <div className='mx-2 mb-2 flex flex-col gap-0.5 md:gap-1'>{getButtons()}</div>
            </div>
        </div>
    );
};

export default ActivePlayerPrompt;
