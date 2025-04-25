import React, { useCallback } from 'react';

import AbilityTargeting from './AbilityTargeting';
import AbilityTimer from './AbilityTimer';
import CardNameLookup from './CardNameLookup';
import TraitNameLookup from './TraitNameLookup';
import SelectFromValuesLookup from './SelectFromValuesLookup';
import { useGetCardsQuery } from '../../redux/middleware/api';
import { Button } from '@heroui/react';
import ThronesIcon from './ThronesIcon';
import LoadingSpinner from '../Site/LoadingSpinner';
import CardHoverable from '../Images/CardHoverable';

const ActivePlayerPrompt = ({
    className,
    onButtonClick,
    buttons,
    controls,
    promptTitle,
    timerStartTime,
    timerLimit,
    phase,
    promptText
}) => {
    const { data: cards, isLoading } = useGetCardsQuery();

    const handleButtonClick = useCallback(
        (event, button) => {
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
        [onButtonClick]
    );

    const handleCancelTimerClick = useCallback(
        (event, button) => {
            //      stopAbilityTimer();

            if (button.method || button.arg) {
                onButtonClick(button);
            }
        },
        [onButtonClick]
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
        if (!buttons) {
            return null;
        }

        return buttons.reduce((buttons, button, index) => {
            if (!button.timer) {
                const clickCallback = button.timerCancel
                    ? (event) => handleCancelTimerClick(event, button)
                    : (event) => handleButtonClick(event, button);

                const buttonRet = (
                    <Button
                        type='button'
                        color='primary'
                        className='text-wrap text-xs h-8 md:h-full md:min-h-10 md:text-small'
                        onPress={clickCallback}
                        isDisabled={button.disabled}
                        disableRipple
                        fullWidth
                    >
                        {button.icon && (
                            <ThronesIcon icon={button.icon} withBackground noSize={false} />
                        )}
                        <span>{button.text}</span>
                    </Button>
                );
                buttons.push(
                    <div className='w-full' key={index}>
                        {button.card ? (
                            <CardHoverable code={button.card.code}>{buttonRet}</CardHoverable>
                        ) : (
                            buttonRet
                        )}
                    </div>
                );
            }
            return buttons;
        }, []);
    }, [buttons, handleButtonClick, handleCancelTimerClick]);

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
    }, [controls, cards, handleLookupValueSelected]);

    let promptTitleElement;

    if (promptTitle) {
        promptTitleElement = (
            <div className='font-normal text-xs md:text-small lg:text-medium text-center border-1 border-default-200 bg-black/65 py-1'>
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
            {timer}
            <div
                className={
                    'relative text-xs md:text-small lg:text-medium font-bold text-center uppercase border-1 border-default-200 bg-secondary-200 py-1 rounded-t-md mx-0 mb-0'
                }
            >
                {`${phase} phase`}
            </div>
            {promptTitleElement}
            <div className='text-center'>
                <div className='relative border-1 border-default-200 bg-black/65 rounded-b-md'>
                    <p className='my-1 mx-2 text-xs md:text-small'>{promptTextElement}</p>
                    {getControls()}
                    <div className='flex flex-col mx-2 md:gap-1 mb-1'>{getButtons()}</div>
                </div>
            </div>
        </div>
    );
};

export default ActivePlayerPrompt;
