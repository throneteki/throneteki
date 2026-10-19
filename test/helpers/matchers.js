import { expect } from 'vitest';

function serializeButtons(buttons) {
    return buttons
        .map((button) => `[${button.disabled ? button.text + ' (Disabled)' : button.text}]`)
        .join('\n');
}

function cardName(card) {
    return typeof card === 'string' ? card : card.name;
}

function selectableCardNames(playerWrapper) {
    return playerWrapper.player.getSelectableCards().map((card) => card.name);
}

function isSelectableByName(playerWrapper, card) {
    return selectableCardNames(playerWrapper).includes(cardName(card));
}

const ChallengeTypeButtons = ['Military', 'Intrigue', 'Power'];

function idlePromptDescription(playerWrapper) {
    const prompt = playerWrapper.currentPrompt();
    const buttons = prompt.buttons.map((button) => button.text);

    switch (playerWrapper.game.currentPhase) {
        case 'plot':
            return prompt.menuTitle === 'Select a plot' && 'select a plot';
        case 'marshal':
            return prompt.menuTitle === 'Marshal your cards' && 'marshal cards';
        case 'challenge':
            return (
                ChallengeTypeButtons.every((text) => buttons.includes(text)) &&
                buttons.includes('Done') &&
                'initiate a challenge'
            );
        default:
            return prompt.menuTitle === 'Initiate an action' && 'initiate an action';
    }
}

const matchers = {
    toHavePrompt(actual, expected) {
        const currentTitle = actual.currentPrompt().menuTitle;
        const pass = this.equals(currentTitle, expected);
        return {
            pass,
            message: () =>
                pass
                    ? `Expected ${actual.name} not to have prompt "${expected}" but it did.`
                    : `Expected ${actual.name} to have prompt "${expected}" but it had "${currentTitle}".`
        };
    },

    toHavePromptButton(actual, expected) {
        const buttons = actual.currentPrompt().buttons;
        const button = buttons.find((b) => this.equals(b.text, expected));
        const pass = !!button && !button.disabled;
        return {
            pass,
            message: () =>
                pass
                    ? `Expected ${actual.name} not to have prompt button "${expected}" but it did.`
                    : `Expected ${actual.name} to have prompt button "${expected}" but it had buttons:\n${serializeButtons(buttons)}`
        };
    },

    toHaveDisabledPromptButton(actual, expected) {
        const buttons = actual.currentPrompt().buttons;
        const button = buttons.find((b) => this.equals(b.text, expected));
        const pass = !!button && !!button.disabled;
        return {
            pass,
            message: () =>
                pass
                    ? `Expected ${actual.name} not to have disabled prompt button "${expected}" but it did.`
                    : `Expected ${actual.name} to have disabled prompt button "${expected}" but it had buttons:\n${serializeButtons(buttons)}`
        };
    },

    toBeControlledBy(actual, expected) {
        const controller = actual.controller;
        const pass = this.equals(controller.name, expected.name);
        return {
            pass,
            message: () =>
                pass
                    ? `Expected ${actual.name} not to be controlled by ${expected.name} but it is.`
                    : `Expected ${actual.name} to be controlled by ${expected.name} but is controlled by ${controller.name}`
        };
    },

    toAllowAbilityTrigger(actual, expected) {
        const isPromptingAbility = actual.game.hasOpenInterruptOrReactionWindow();
        const pass = isPromptingAbility && isSelectableByName(actual, expected);
        return {
            pass,
            message: () =>
                pass
                    ? `Expected ${actual.name} not to be allowed to trigger ${cardName(expected)} but it is.`
                    : `Expected ${actual.name} to be allowed to trigger ${cardName(expected)} but it isn't. Selectable cards: ${selectableCardNames(actual).join(', ') || 'none'}`
        };
    },

    toAllowSelect(actual, expected) {
        const pass = isSelectableByName(actual, expected);
        return {
            pass,
            message: () =>
                pass
                    ? `Expected ${actual.name} not to be allowed to select ${cardName(expected)} but it is.`
                    : `Expected ${actual.name} to be allowed to select ${cardName(expected)} but it isn't. Selectable cards: ${selectableCardNames(actual).join(', ') || 'none'}`
        };
    },

    toBeAbleToSelect(actual, card) {
        const pass = actual.player.getSelectableCards().includes(card);
        return {
            pass,
            message: () =>
                pass
                    ? `Expected ${actual.name} not to be able to select ${card.name} (${card.location}) but they can.`
                    : `Expected ${actual.name} to be able to select ${card.name} (${card.location}) but they can't. Selectable cards: ${selectableCardNames(actual).join(', ') || 'none'}`
        };
    },

    isReadyToTakeAction(actual) {
        const openWindow = actual.game.hasOpenInterruptOrReactionWindow();
        const idle = !openWindow && idlePromptDescription(actual);
        const pass = !!idle;
        return {
            pass,
            message: () =>
                pass
                    ? `Expected ${actual.name} not to be ready to ${idle} but they are.`
                    : `Expected ${actual.name} to be ready to take their next action in the ${actual.game.currentPhase} phase${openWindow ? ' but an ability window is still open' : ''}. Current prompt is:\n${actual.formatPrompt()}`
        };
    }
};

export function install() {
    expect.extend(matchers);
}
