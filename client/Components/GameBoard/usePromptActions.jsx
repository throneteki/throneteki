import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useGetCardsQuery } from '../../redux/middleware/api';
import AbilityTargeting from './AbilityTargeting';
import CardNameLookup from './CardNameLookup';
import TraitNameLookup from './TraitNameLookup';
import SelectFromValuesLookup from './SelectFromValuesLookup';
import ResponseDelay from './ResponseDelay';
import {
    getPromptButtonIndex,
    isPromptShortcutKey,
    isShortcutEvent,
    keyboardShortcutsEnabled
} from './keyboardShortcuts';

const pressDelay = 300;
const endTurnDelay = 500;

// What every prompt does with its buttons and controls, however it is drawn
export const usePromptActions = ({ buttons, controls, promptText, onButtonClick }) => {
    const { data: cards, isLoading } = useGetCardsQuery();
    const [pausedPromptId, setPausedPromptId] = useState();
    const shortcutsEnabled = useSelector((state) =>
        keyboardShortcutsEnabled(state.auth.user?.settings)
    );

    // Ignore a press that lands just after the buttons change, such as one meant for a window
    // that closed under the cursor. A button that ends your turn in the phase waits longer, and
    // shows as disabled while it does, as it often replaces a Pass button the player is pressing.
    const buttonsShownAt = useRef(0);
    const freshFor = useRef(pressDelay);
    const [endTurnReady, setEndTurnReady] = useState(true);
    const buttonsKey = (buttons || [])
        .map((button) => `${button.promptId}:${button.text}`)
        .join('|');
    const endsTurn = (buttons || []).some((button) => button.endsTurn);
    useEffect(() => {
        buttonsShownAt.current = Date.now();
        freshFor.current = endsTurn ? endTurnDelay : pressDelay;
        if (!endsTurn) {
            return;
        }

        setEndTurnReady(false);
        const timer = setTimeout(() => setEndTurnReady(true), endTurnDelay);
        return () => clearTimeout(timer);
    }, [buttonsKey, endsTurn]);
    const isFreshPress = () => Date.now() - buttonsShownAt.current < freshFor.current;

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

    // A wait shown to every player who might be able to respond, so their opponents can't tell
    // who really can.
    const responseDelay = controls && controls.find((control) => control.type === 'response-delay');
    const shownText = responseDelay
        ? `Any ${responseDelay.abilityWord || 'response'}s?`
        : promptText;

    return {
        cards,
        isLoading,
        pausedPromptId,
        shortcutsEnabled,
        responseDelay,
        promptText: shownText,
        endsTurn,
        endTurnReady,
        handleButtonClick,
        handleLookupValueSelected
    };
};

// The controls a prompt can carry beside its buttons
export const PromptControls = ({
    controls,
    only,
    cards,
    pausedPromptId,
    onLookupValueSelected,
    slimDelay = false
}) => {
    if (!controls) {
        return null;
    }

    return controls
        .filter((control) => !only || only(control))
        .map((control) => {
            // The lookups search every card, so they wait until the cards have loaded
            if (['card-name', 'trait-name'].includes(control.type) && !cards) {
                return (
                    <div key={control.promptId} className='px-2 py-1 text-xs italic'>
                        Loading cards…
                    </div>
                );
            }
            const lookup = (value) =>
                onLookupValueSelected(control.command, control.method, control.promptId, value);
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
                            onValueSelected={lookup}
                        />
                    );
                case 'trait-name':
                    return (
                        <TraitNameLookup
                            key={control.promptId}
                            cards={cards}
                            onValueSelected={lookup}
                        />
                    );
                case 'response-delay':
                    return (
                        <ResponseDelay
                            key={`${control.type}-${control.promptId}`}
                            duration={control.duration}
                            paused={control.paused || control.promptId === pausedPromptId}
                            slim={slimDelay}
                        />
                    );
                case 'select-from-values':
                    return (
                        <SelectFromValuesLookup
                            key={control.promptId}
                            selectableValues={control.selectableValues}
                            onValueSelected={lookup}
                        />
                    );
            }
            return null;
        });
};
