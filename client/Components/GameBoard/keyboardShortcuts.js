export const shortcutList = [
    { keys: ['1', '9'], description: 'Press the prompt button with that number' },
    { keys: ['W'], description: 'Wait: pause the response timer' },
    { keys: ['Space'], description: 'Pass or Done' },
    { keys: ['Enter'], description: 'Open and type in the game chat' },
    { keys: ['Esc'], description: 'Leave the chat box' },
    { keys: ['?'], description: 'Show the keyboard shortcuts' }
];

export const keyboardShortcutsEnabled = (settings) => settings?.keyboardShortcuts !== false;

const overlaySelector = '[role="dialog"], [role="menu"], [role="listbox"]';

const isEditable = (element) =>
    !!element &&
    (element.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(element.tagName));

const isInteractive = (element) =>
    !!element?.closest?.('button, a[href], [role="button"], [role="option"]');

// Space and Enter already press a focused button, so they are left alone there.
export const isShortcutEvent = (event, doc = globalThis.document) => {
    if (event.defaultPrevented || event.repeat) {
        return false;
    }

    if (event.ctrlKey || event.altKey || event.metaKey) {
        return false;
    }

    const target = event.target;
    if (isEditable(target) || doc?.querySelector(overlaySelector)) {
        return false;
    }

    if ((event.key === ' ' || event.key === 'Enter') && isInteractive(target)) {
        return false;
    }

    return true;
};

const isWaitButton = (button) => !!button.pausesTimer;

const isPassOrDoneButton = (button) =>
    !button.cancel && (button.done || button.text === 'Pass' || button.text === 'Done');

// Digits use the physical key so they work on layouts such as AZERTY, where the top row
// gives symbols without Shift.
const getDigit = (event) => {
    const match = /^(?:Digit|Numpad)([1-9])$/.exec(event.code || '');
    return match ? Number(match[1]) : null;
};

export const isPromptShortcutKey = (event) =>
    getDigit(event) !== null || event.key === 'w' || event.key === 'W' || event.key === ' ';

const getNumberedButtonIndexes = (buttons) =>
    buttons.reduce(
        (indexes, button, index) => (isWaitButton(button) ? indexes : [...indexes, index]),
        []
    );

export const getPromptButtonIndex = (event, buttons) => {
    if (!buttons || buttons.length === 0) {
        return -1;
    }

    const digit = getDigit(event);
    if (digit !== null) {
        const index = getNumberedButtonIndexes(buttons)[digit - 1];
        return index === undefined ? -1 : index;
    }

    if (event.key === 'w' || event.key === 'W') {
        return buttons.findIndex(isWaitButton);
    }

    if (event.key === ' ') {
        return buttons.findIndex(isPassOrDoneButton);
    }

    return -1;
};

export const getButtonShortcutLabel = (buttons, index) => {
    if (isWaitButton(buttons[index])) {
        return 'W';
    }

    const position = getNumberedButtonIndexes(buttons).indexOf(index);
    return position >= 0 && position < 9 ? String(position + 1) : null;
};
