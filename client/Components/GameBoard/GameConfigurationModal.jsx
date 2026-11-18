import React from 'react';
import GameConfiguration from './GameConfiguration';
import { Button, Modal, ModalBody, ModalContent, ModalHeader } from '@heroui/react';

// On a phone the settings are a screen of their own, sliding up from the bottom, with Done always in reach at the top
const slideUp = {
    variants: {
        enter: { y: 0, transition: { duration: 0.25, ease: 'easeOut' } },
        exit: { y: '100%', transition: { duration: 0.2, ease: 'easeIn' } }
    }
};

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
    const content = (
        <GameConfiguration
            isSpectating={isSpectating}
            actionWindows={promptedActionWindows}
            keywordSettings={keywordSettings}
            promptDupes={promptDupes}
            hideInterrupts={hideInterrupts}
            hideReactions={hideReactions}
            hud={hud}
            onKeywordSettingToggle={onKeywordSettingToggle}
            onHideResponsesToggle={onHideResponsesToggle}
            onHudChange={onHudChange}
            onActionWindowToggle={onPromptedActionWindowToggle}
            onPromptDupesToggle={onPromptDupesToggle}
        />
    );

    // One dialog either way, so it is never swapped for another while it is open
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size={fullScreen ? 'full' : 'lg'}
            scrollBehavior='inside'
            hideCloseButton={fullScreen}
            motionProps={fullScreen ? slideUp : undefined}
            classNames={
                fullScreen
                    ? {
                          base: 'bg-black/95 pt-[var(--safe-top)] pb-[var(--safe-bottom)]',
                          header: 'sticky top-0 z-10 flex items-center gap-2 border-b border-default-200 bg-black/95 px-4 py-3',
                          body: 'px-3 py-3'
                      }
                    : undefined
            }
        >
            <ModalContent>
                {(close) => (
                    <>
                        <ModalHeader>
                            {fullScreen ? (
                                <>
                                    <span className='flex-1 text-lg font-bold'>Settings</span>
                                    <Button size='sm' color='primary' onPress={close}>
                                        Done
                                    </Button>
                                </>
                            ) : (
                                'Game Configuration'
                            )}
                        </ModalHeader>
                        <ModalBody>{content}</ModalBody>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};

export default GameConfigurationModal;
