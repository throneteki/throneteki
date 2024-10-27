import React, { useCallback } from 'react';

import AbilityTargeting from './AbilityTargeting';
import AbilityTimer from './AbilityTimer';
import CardNameLookup from './CardNameLookup';
import TraitNameLookup from './TraitNameLookup';
import SelectFromValuesLookup from './SelectFromValuesLookup';
import { useGetCardsQuery } from '../../redux/middleware/api';
import { Button } from '@nextui-org/react';
import ThronesIcon from './ThronesIcon';

const ActivePlayerPrompt = ({
    stopAbilityTimer,
    onButtonClick,
    buttons,
    onMouseOver,
    onMouseOut,
    controls,
    promptTitle,
    timerStartTime,
    timerLimit,
    phase,
    onTitleClick,
    promptText
}) => {
    const { data: cards, isLoading } = useGetCardsQuery();

    const handleButtonClick = useCallback(
        (event, button) => {
            event.preventDefault();

            //     stopAbilityTimer();

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

            if (onButtonClick) {
                onButtonClick(button);
            }
        },
        [stopAbilityTimer, onButtonClick]
    );

    const handleCancelTimerClick = useCallback(
        (event, button) => {
            event.preventDefault();

            //      stopAbilityTimer();

            if (button.method || button.arg) {
                onButtonClick(button);
            }
        },
        [stopAbilityTimer, onButtonClick]
    );

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
        let buttonIndex = 0;

        let retButtons = [];

        if (!buttons) {
            return null;
        }

        for (const button of buttons) {
            if (button.timer) {
                continue;
            }

            let clickCallback = button.timerCancel
                ? (event) => handleCancelTimerClick(event, button)
                : (event) => handleButtonClick(event, button);

            let option = (
                <div className='w-full px-1'>
                    <Button
                        color='primary'
                        key={button.command + buttonIndex.toString()}
                        className='text-wrap mb-1 h-full min-h-10'
                        onClick={clickCallback}
                        onMouseOver={
                            button.card ? (event) => onMouseOver(event, button.card) : null
                        }
                        onMouseOut={button.card ? (event) => onMouseOut(event, button.card) : null}
                        isDisabled={button.disabled}
                        disableRipple
                        fullWidth
                    >
                        {button.icon && (
                            <ThronesIcon icon={button.icon} withBackground noSize={false} />
                        )}
                        <span>{button.text}</span>
                    </Button>
                </div>
            );
            buttonIndex++;

            retButtons.push(option);
        }

        return retButtons;
    }, [buttons, handleButtonClick, handleCancelTimerClick, onMouseOver, onMouseOut]);

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
                            onMouseOut={onMouseOut}
                            onMouseOver={onMouseOver}
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
    }, [controls, cards, handleLookupValueSelected, onMouseOver, onMouseOut]);

    let promptTitleElement;

    if (promptTitle) {
        promptTitleElement = (
            <div className='font-normal text-center border-1 border-default-200 bg-black/65 py-1'>
                {promptTitle}
            </div>
        );
    }

    let timer = null;

    let promptTextElement = [];
    if (promptText && promptText.includes('\n')) {
        let split = promptText.split('\n');
        for (let token of split) {
            promptTextElement.push(token);
            promptTextElement.push(<br />);
        }
    } else {
        promptTextElement.push(promptText);
    }

    if (timerStartTime) {
        timer = <AbilityTimer startTime={timerStartTime} limit={timerLimit} />;
    }

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className='m-1'>
            {timer}
            <div
                className={
                    'relative text-medium font-bold text-center uppercase border-1 border-default-200 bg-secondary-200 py-1 rounded-t-md mx-0 mb-0 ' +
                    phase
                }
                onClick={onTitleClick}
            >
                {phase} phase
            </div>
            {promptTitleElement}
            <div className='text-center'>
                <div className='relative border-1 border-default-200 bg-black/65 rounded-b-md'>
                    <p className='my-1 mx-2 text-small'>{promptTextElement}</p>
                    {getControls()}
                    <div className='flex flex-col m-1'>{getButtons()}</div>
                </div>
            </div>
        </div>
    );
};

export default ActivePlayerPrompt;
