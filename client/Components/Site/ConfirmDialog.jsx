import React from 'react';
import { Button } from '@heroui/react';
import Dialog from './Dialog';

const ConfirmDialog = ({
    isOpen,
    onOpenChange,
    title = 'Are you sure?',
    message,
    onOk,
    onCancel,
    okLabel = 'Yes',
    cancelLabel = 'No',
    placement = 'center',
    isDestructive = false
}) => (
    <Dialog
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        title={title}
        placement={placement}
        size='sm'
        footer={({ close }) => (
            <div className='flex justify-end gap-2'>
                <Button
                    variant='tertiary'
                    onPress={() => {
                        close();
                        onCancel?.();
                    }}
                >
                    {cancelLabel}
                </Button>
                <Button
                    variant={isDestructive ? 'danger' : 'primary'}
                    onPress={() => {
                        close();
                        onOk?.();
                    }}
                >
                    {okLabel}
                </Button>
            </div>
        )}
    >
        <p className='text-ink-dim'>{message}</p>
    </Dialog>
);

export default ConfirmDialog;
