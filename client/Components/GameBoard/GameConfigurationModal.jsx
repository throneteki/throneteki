import React, { useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@heroui/react';
import GameConfiguration from './GameConfiguration';
import { touchCloseButton } from './touchCloseButton';

// On a phone the settings are a screen of their own, sliding up from the bottom
const slideUp = {
    variants: {
        enter: { y: 0, transition: { duration: 0.25, ease: 'easeOut' } },
        exit: { y: '100%', transition: { duration: 0.2, ease: 'easeIn' } }
    }
};

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
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size={fullScreen ? 'full' : '2xl'}
            scrollBehavior='inside'
            motionProps={fullScreen ? slideUp : undefined}
            classNames={
                fullScreen
                    ? {
                          base: 'bg-black/95 pt-[var(--safe-top)] pb-[var(--safe-bottom)]',
                          header: 'border-b border-default-200 px-4 py-3',
                          body: 'px-3 py-3',
                          closeButton: touchCloseButton
                      }
                    : { header: 'border-b border-default-200', closeButton: touchCloseButton }
            }
        >
            <ModalContent>
                <ModalHeader className='flex flex-col gap-2'>
                    <div>
                        <h2 className='text-large font-bold'>Game Settings</h2>
                        <p className='text-small font-normal text-default-500'>
                            For this game only. To change them for every game, use your profile.
                        </p>
                    </div>
                </ModalHeader>
                <ModalBody>
                    <GameConfiguration
                        isSpectating={isSpectating}
                        values={draft}
                        onChange={(changes) => setDraft((current) => ({ ...current, ...changes }))}
                    />
                </ModalBody>
                <ModalFooter className='flex flex-wrap items-center justify-end gap-2 border-t border-default-200 px-4 py-3'>
                    <span
                        className={classNames(
                            'w-full text-small sm:mr-auto sm:w-auto',
                            dirty ? 'text-warning' : 'text-default-500'
                        )}
                    >
                        {dirty ? 'You have unsaved changes' : 'No unsaved changes'}
                    </span>
                    {/* Close, or Discard while there are changes, fading between them at the wider one's width */}
                    <Button
                        variant='flat'
                        aria-label={dirty ? 'Discard' : 'Close'}
                        onPress={dirty ? () => setDraft(saved) : onClose}
                    >
                        <span className='grid'>
                            {[
                                ['Close', !dirty],
                                ['Discard', dirty]
                            ].map(([label, shown]) => (
                                <span
                                    key={label}
                                    aria-hidden
                                    className={classNames(
                                        'col-start-1 row-start-1 transition-opacity duration-200',
                                        shown ? 'opacity-100' : 'opacity-0'
                                    )}
                                >
                                    {label}
                                </span>
                            ))}
                        </span>
                    </Button>
                    <Button color='success' isDisabled={!dirty} onPress={save}>
                        Save changes
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default GameConfigurationModal;
