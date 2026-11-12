import React from 'react';
import { Kbd, Modal, ModalBody, ModalContent, ModalHeader } from '@heroui/react';
import { shortcutList } from './keyboardShortcuts';

export const KeyboardShortcutsTable = () => (
    <table className='w-full text-small'>
        <tbody>
            {shortcutList.map((shortcut) => (
                <tr key={shortcut.keys.join('-')}>
                    <td className='py-1 pr-4 whitespace-nowrap'>
                        {shortcut.keys.length > 1 ? (
                            <>
                                <Kbd>{shortcut.keys[0]}</Kbd> to <Kbd>{shortcut.keys[1]}</Kbd>
                            </>
                        ) : (
                            <Kbd>{shortcut.keys[0]}</Kbd>
                        )}
                    </td>
                    <td className='py-1'>{shortcut.description}</td>
                </tr>
            ))}
        </tbody>
    </table>
);

const KeyboardShortcutsModal = ({ isOpen, onClose }) => (
    <Modal isOpen={isOpen} onClose={onClose} size='md'>
        <ModalContent>
            <ModalHeader>Keyboard Shortcuts</ModalHeader>
            <ModalBody className='pb-6'>
                <KeyboardShortcutsTable />
                <p className='text-tiny text-default-500'>
                    Shortcuts are ignored while you are typing. They can be turned off in your
                    profile settings.
                </p>
            </ModalBody>
        </ModalContent>
    </Modal>
);

export default KeyboardShortcutsModal;
