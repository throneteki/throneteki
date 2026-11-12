import {
    getButtonShortcutLabel,
    getPromptButtonIndex,
    isPromptShortcutKey,
    isShortcutEvent,
    keyboardShortcutsEnabled
} from '../../client/Components/GameBoard/keyboardShortcuts.js';

const element = ({ tagName = 'DIV', isContentEditable = false, matches = [] } = {}) => ({
    tagName,
    isContentEditable,
    closest: (selector) =>
        matches.some((match) => selector.split(', ').includes(match)) ? {} : null
});

const emptyDocument = { querySelector: () => null };
const documentWithOverlay = { querySelector: () => ({}) };

const keyEvent = (key, properties = {}) => ({
    key,
    code: /^[1-9]$/.test(key) ? `Digit${key}` : '',
    target: element(),
    defaultPrevented: false,
    repeat: false,
    ctrlKey: false,
    altKey: false,
    metaKey: false,
    ...properties
});

describe('keyboard shortcuts', function () {
    describe('keyboardShortcutsEnabled', function () {
        it('is on unless the setting is turned off', function () {
            expect(keyboardShortcutsEnabled(undefined)).toBe(true);
            expect(keyboardShortcutsEnabled({})).toBe(true);
            expect(keyboardShortcutsEnabled({ keyboardShortcuts: true })).toBe(true);
            expect(keyboardShortcutsEnabled({ keyboardShortcuts: false })).toBe(false);
        });
    });

    describe('isShortcutEvent', function () {
        it('accepts a plain key press on the board', function () {
            expect(isShortcutEvent(keyEvent('1'), emptyDocument)).toBe(true);
        });

        it('ignores key presses while typing', function () {
            for (const tagName of ['INPUT', 'TEXTAREA', 'SELECT']) {
                expect(
                    isShortcutEvent(keyEvent('1', { target: element({ tagName }) }), emptyDocument)
                ).toBe(false);
            }

            expect(
                isShortcutEvent(
                    keyEvent('w', { target: element({ isContentEditable: true }) }),
                    emptyDocument
                )
            ).toBe(false);
        });

        it('ignores held keys and key presses with modifiers', function () {
            expect(isShortcutEvent(keyEvent('1', { repeat: true }), emptyDocument)).toBe(false);
            expect(isShortcutEvent(keyEvent('1', { ctrlKey: true }), emptyDocument)).toBe(false);
            expect(isShortcutEvent(keyEvent('1', { altKey: true }), emptyDocument)).toBe(false);
            expect(isShortcutEvent(keyEvent('1', { metaKey: true }), emptyDocument)).toBe(false);
        });

        it('ignores key presses while a modal or menu is open, wherever focus is', function () {
            expect(isShortcutEvent(keyEvent('1'), documentWithOverlay)).toBe(false);
            expect(isShortcutEvent(keyEvent(' '), documentWithOverlay)).toBe(false);
        });

        it('leaves Space and Enter to a focused button but still accepts other keys', function () {
            const target = element({ tagName: 'BUTTON', matches: ['button'] });

            expect(isShortcutEvent(keyEvent(' ', { target }), emptyDocument)).toBe(false);
            expect(isShortcutEvent(keyEvent('Enter', { target }), emptyDocument)).toBe(false);
            expect(isShortcutEvent(keyEvent('2', { target }), emptyDocument)).toBe(true);
        });
    });

    describe('isPromptShortcutKey', function () {
        it('recognises digits, W and Space but not Enter', function () {
            expect(isPromptShortcutKey(keyEvent('1'))).toBe(true);
            expect(isPromptShortcutKey(keyEvent('w'))).toBe(true);
            expect(isPromptShortcutKey(keyEvent(' '))).toBe(true);
            expect(isPromptShortcutKey(keyEvent('Enter'))).toBe(false);
            expect(isPromptShortcutKey(keyEvent('0', { code: 'Digit0' }))).toBe(false);
        });
    });

    describe('getPromptButtonIndex', function () {
        const waitButtons = [
            { text: 'Wait', arg: 'wait', pausesTimer: true },
            { text: "Don't ask again this phase", arg: 'passAndPauseForPhase' }
        ];
        const passButtons = [
            { text: 'Pass', arg: 'done', done: true },
            { text: "Don't ask again this phase", arg: 'passAndPauseForPhase' }
        ];

        it('maps number keys to button positions', function () {
            expect(getPromptButtonIndex(keyEvent('1'), passButtons)).toBe(0);
            expect(getPromptButtonIndex(keyEvent('2'), passButtons)).toBe(1);
            expect(getPromptButtonIndex(keyEvent('3'), passButtons)).toBe(-1);
        });

        it('uses the physical key, so digits work on AZERTY and the numpad', function () {
            expect(getPromptButtonIndex(keyEvent('&', { code: 'Digit1' }), passButtons)).toBe(0);
            expect(getPromptButtonIndex(keyEvent('2', { code: 'Numpad2' }), passButtons)).toBe(1);
        });

        it('leaves the Wait button out of the numbering', function () {
            expect(getPromptButtonIndex(keyEvent('1'), waitButtons)).toBe(1);
            expect(getPromptButtonIndex(keyEvent('2'), waitButtons)).toBe(-1);
        });

        it('maps W to the button that pauses the timer', function () {
            expect(getPromptButtonIndex(keyEvent('w'), waitButtons)).toBe(0);
            expect(getPromptButtonIndex(keyEvent('W'), waitButtons)).toBe(0);
        });

        it('does nothing for W once the timer is paused', function () {
            expect(getPromptButtonIndex(keyEvent('w'), passButtons)).toBe(-1);
        });

        it('maps Space to a button marked done', function () {
            expect(getPromptButtonIndex(keyEvent(' '), passButtons)).toBe(0);
            expect(getPromptButtonIndex(keyEvent(' '), waitButtons)).toBe(-1);
        });

        it('maps Space to Pass and Done buttons that are not marked done', function () {
            const actionWindow = [{ text: 'Pass' }];
            const marshaling = [{ text: 'Use ability' }, { text: 'Done' }];
            const plotSelection = [{ arg: 'plotselected', text: 'Done' }];

            expect(getPromptButtonIndex(keyEvent(' '), actionWindow)).toBe(0);
            expect(getPromptButtonIndex(keyEvent(' '), marshaling)).toBe(1);
            expect(getPromptButtonIndex(keyEvent(' '), plotSelection)).toBe(0);
        });

        it('never maps Space to a Cancel button', function () {
            const buttons = [{ text: 'Cancel', arg: 'done', cancel: true }];

            expect(getPromptButtonIndex(keyEvent(' '), buttons)).toBe(-1);
        });

        it('does nothing without buttons', function () {
            expect(getPromptButtonIndex(keyEvent('1'), [])).toBe(-1);
            expect(getPromptButtonIndex(keyEvent('1'), undefined)).toBe(-1);
        });
    });

    describe('getButtonShortcutLabel', function () {
        it('labels the Wait button W and numbers the others without it', function () {
            const buttons = [{ pausesTimer: true }, { text: 'Pause for phase' }];

            expect(getButtonShortcutLabel(buttons, 0)).toBe('W');
            expect(getButtonShortcutLabel(buttons, 1)).toBe('1');
        });

        it('only numbers the first nine buttons', function () {
            const buttons = Array.from({ length: 10 }, (_, index) => ({ text: `${index}` }));

            expect(getButtonShortcutLabel(buttons, 8)).toBe('9');
            expect(getButtonShortcutLabel(buttons, 9)).toBe(null);
        });
    });
});
