import React, { useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
import { Button } from '@heroui/react';
import Dialog from '../Site/Dialog';
import GameConfiguration from './GameConfiguration';
import { touchCloseButton } from './touchCloseButton';

const changed = (a, b) => JSON.stringify(a ?? null) !== JSON.stringify(b ?? null);

// This game's gameplay settings, kept aside as they are changed and applied together on Save, as the profile's are.
// Closing without saving drops the changes. How the board looks is set in the profile.
const GameConfigurationModal = ({
    isOpen,
    isSpectating,
    keywordSettings,
    onClose,
    onKeywordSettingToggle,
    onPromptDupesToggle,
    onPromptedActionWindowToggle,
    onHideResponsesToggle,
    promptDupes,
    promptedActionWindows,
    hideInterrupts,
    hideReactions,
    fullScreen = false
}) => {
    const saved = useMemo(
        () => ({
            actionWindows: promptedActionWindows || {},
            keywordSettings: keywordSettings || {},
            promptDupes: !!promptDupes,
            hideInterrupts: hideInterrupts !== false,
            hideReactions: hideReactions !== false
        }),
        [promptedActionWindows, keywordSettings, promptDupes, hideInterrupts, hideReactions]
    );
    const [draft, setDraft] = useState(saved);

    useEffect(() => {
        if (isOpen) {
            setDraft(saved);
        }
        // Only on opening: what is saved changing while open must not undo what is being changed
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

    const changedKeys = Object.keys(saved).filter((key) => changed(draft[key], saved[key]));
    const dirty = changedKeys.length > 0;

    const save = () => {
        const changedIn = (key) =>
            Object.keys({ ...saved[key], ...draft[key] }).filter(
                (name) => !!draft[key][name] !== !!saved[key][name]
            );
        for (const name of changedIn('actionWindows')) {
            onPromptedActionWindowToggle?.(name, !!draft.actionWindows[name]);
        }
        for (const name of changedIn('keywordSettings')) {
            onKeywordSettingToggle?.(name, !!draft.keywordSettings[name]);
        }
        if (changedKeys.includes('promptDupes')) {
            onPromptDupesToggle?.(draft.promptDupes);
        }
        if (changedKeys.includes('hideInterrupts')) {
            onHideResponsesToggle?.('interrupts', draft.hideInterrupts);
        }
        if (changedKeys.includes('hideReactions')) {
            onHideResponsesToggle?.('reactions', draft.hideReactions);
        }
        onClose();
    };

    return (
        <Dialog
            isOpen={isOpen}
            onOpenChange={(open) => !open && onClose()}
            title='Game settings'
            size={fullScreen ? 'full' : 'lg'}
            className={
                fullScreen ? 'pt-[var(--safe-top)] pb-[var(--safe-bottom)]' : 'max-w-[56rem]'
            }
            closeClassName={touchCloseButton}
            footer={
                <div className='flex flex-wrap items-center justify-end gap-x-3 gap-y-2'>
                    <span
                        aria-live='polite'
                        className={classNames(
                            'w-full text-sm sm:mr-auto sm:w-auto',
                            dirty ? 'text-warning' : 'text-ink-faint'
                        )}
                    >
                        {dirty
                            ? 'You have unsaved changes'
                            : 'For this game only. Your defaults are in your profile.'}
                    </span>
                    <Button variant='tertiary' onPress={dirty ? () => setDraft(saved) : onClose}>
                        {dirty ? 'Discard' : 'Close'}
                    </Button>
                    <Button variant='primary' isDisabled={!dirty} onPress={save}>
                        Save changes
                    </Button>
                </div>
            }
        >
            <GameConfiguration
                isSpectating={isSpectating}
                values={draft}
                onChange={(changes) => setDraft((current) => ({ ...current, ...changes }))}
            />
        </Dialog>
    );
};

export default GameConfigurationModal;
