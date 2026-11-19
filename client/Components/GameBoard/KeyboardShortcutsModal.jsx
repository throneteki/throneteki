import React from 'react';
import { Kbd } from '@heroui/react';
import Dialog from '../Site/Dialog';
import { shortcutList } from './keyboardShortcuts';

export const KeyboardShortcutsTable = () => (
    <table className='w-full text-sm'>
        <tbody>
            {shortcutList.map((shortcut) => (
                <tr key={shortcut.keys.join('-')} className='border-b border-gold-hair'>
                    <td className='whitespace-nowrap py-2 pr-4'>
                        {shortcut.keys.length > 1 ? (
                            <>
                                <Kbd>
                                    <Kbd.Content>{shortcut.keys[0]}</Kbd.Content>
                                </Kbd>{' '}
                                to{' '}
                                <Kbd>
                                    <Kbd.Content>{shortcut.keys[1]}</Kbd.Content>
                                </Kbd>
                            </>
                        ) : (
                            <Kbd>
                                <Kbd.Content>{shortcut.keys[0]}</Kbd.Content>
                            </Kbd>
                        )}
                    </td>
                    <td className='py-2 text-ink-dim'>{shortcut.description}</td>
                </tr>
            ))}
        </tbody>
    </table>
);

const KeyboardShortcutsModal = ({ isOpen, onClose }) => (
    <Dialog
        isOpen={isOpen}
        onOpenChange={(open) => !open && onClose()}
        title='Keyboard shortcuts'
        bodyClassName='pb-6'
    >
        <KeyboardShortcutsTable />
        <p className='mt-3 text-xs text-ink-faint'>
            Shortcuts are ignored while you are typing. They can be turned off in your profile
            settings.
        </p>
    </Dialog>
);

export default KeyboardShortcutsModal;
