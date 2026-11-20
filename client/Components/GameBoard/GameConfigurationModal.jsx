import React, { useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@heroui/react';
import GameConfiguration from './GameConfiguration';

// On a phone the settings are a screen of their own, sliding up from the bottom
const slideUp = {
    variants: {
        enter: { y: 0, transition: { duration: 0.25, ease: 'easeOut' } },
        exit: { y: '100%', transition: { duration: 0.2, ease: 'easeIn' } }
    }
};

const sections = [
    { key: 'gameplay', label: 'Gameplay' },
    { key: 'appearance', label: 'Appearance' }
];

const sectionOf = (key) => (key === 'hud' ? 'appearance' : 'gameplay');

const changed = (a, b) => JSON.stringify(a ?? null) !== JSON.stringify(b ?? null);

const SectionTabs = ({ active, dirty, onSelect }) => (
    <div role='tablist' aria-label='Settings sections' className='grid grid-cols-2 gap-1'>
        {sections.map((section) => (
            <button
                key={section.key}
                type='button'
                role='tab'
                aria-selected={section.key === active}
                onClick={() => onSelect(section.key)}
                className={classNames(
                    'flex items-center justify-center gap-2 whitespace-nowrap rounded-medium px-3 py-2 text-small transition-colors',
                    section.key === active
                        ? 'bg-primary font-bold text-primary-foreground'
                        : 'text-default-600 hover:bg-default-100 hover:text-foreground'
                )}
            >
                {section.label}
                {dirty.includes(section.key) && (
                    <span
                        title='Unsaved changes'
                        className='h-2 w-2 shrink-0 rounded-full bg-warning'
                    />
                )}
            </button>
        ))}
    </div>
);

// This game's settings, kept aside as they are changed and applied together on Save, as the profile's are, so the
// board does not change under the dialog while it is open. Closing without saving drops the changes.
const GameConfigurationModal = ({
    isOpen,
    isSpectating,
    keywordSettings,
    onClose,
    onKeywordSettingToggle,
    onPromptDupesToggle,
    onPromptedActionWindowToggle,
    onHideResponsesToggle,
    onHudChange,
    promptDupes,
    promptedActionWindows,
    hideInterrupts,
    hideReactions,
    hud,
    fullScreen = false
}) => {
    const saved = useMemo(
        () => ({
            actionWindows: promptedActionWindows || {},
            keywordSettings: keywordSettings || {},
            promptDupes: !!promptDupes,
            hideInterrupts: hideInterrupts !== false,
            hideReactions: hideReactions !== false,
            hud
        }),
        [promptedActionWindows, keywordSettings, promptDupes, hideInterrupts, hideReactions, hud]
    );
    const [draft, setDraft] = useState(saved);
    const [section, setSection] = useState('gameplay');

    useEffect(() => {
        if (isOpen) {
            setDraft(saved);
        }
        // Only on opening: what is saved changing while open must not undo what is being changed
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

    const changedKeys = Object.keys(saved).filter((key) => changed(draft[key], saved[key]));
    const dirty = [...new Set(changedKeys.map(sectionOf))];

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
        if (changedKeys.includes('hud')) {
            onHudChange?.(draft.hud);
        }
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size={fullScreen ? 'full' : 'lg'}
            scrollBehavior='inside'
            motionProps={fullScreen ? slideUp : undefined}
            classNames={
                fullScreen
                    ? {
                          base: 'bg-black/95 pt-[var(--safe-top)] pb-[var(--safe-bottom)]',
                          header: 'border-b border-default-200 px-4 py-3',
                          body: 'px-3 py-3'
                      }
                    : { header: 'border-b border-default-200' }
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
                    <SectionTabs active={section} dirty={dirty} onSelect={setSection} />
                </ModalHeader>
                <ModalBody>
                    <GameConfiguration
                        section={section}
                        isSpectating={isSpectating}
                        values={draft}
                        onChange={(changes) => setDraft((current) => ({ ...current, ...changes }))}
                    />
                </ModalBody>
                <ModalFooter className='flex flex-wrap items-center justify-end gap-2 border-t border-default-200 px-4 py-3'>
                    <span
                        className={classNames(
                            'w-full text-small sm:mr-auto sm:w-auto',
                            dirty.length > 0 ? 'text-warning' : 'text-default-500'
                        )}
                    >
                        {dirty.length > 0 ? 'You have unsaved changes' : 'No unsaved changes'}
                    </span>
                    <Button
                        variant='flat'
                        isDisabled={dirty.length === 0}
                        onPress={() => setDraft(saved)}
                    >
                        Discard
                    </Button>
                    <Button color='success' isDisabled={dirty.length === 0} onPress={save}>
                        Save changes
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default GameConfigurationModal;
