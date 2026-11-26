import React, { useState } from 'react';
import { TextAreaField } from '../Site/Field';
import { Button } from '@heroui/react';
import Dialog from '../Site/Dialog';
import { MaxDescriptionLength } from '../../../shared/problemReportLimits';
import { touchCloseButton } from './touchCloseButton';

const ReportProblemModal = ({ isOpen, onCancel, onSend }) => {
    const [description, setDescription] = useState('');

    const close = () => {
        setDescription('');
        onCancel();
    };

    const send = () => {
        if (!description.trim()) {
            return;
        }

        onSend(description.trim());
        setDescription('');
    };

    return (
        <Dialog
            isOpen={isOpen}
            onOpenChange={(open) => !open && close()}
            isDismissable={false}
            title='Report a problem'
            closeClassName={touchCloseButton}
            footer={
                <div className='flex justify-end gap-2'>
                    <Button onPress={close} variant='tertiary'>
                        Cancel
                    </Button>
                    <Button onPress={send} isDisabled={!description.trim()} variant='primary'>
                        Send report
                    </Button>
                </div>
            }
        >
            <div className='flex flex-col gap-4'>
                <p className='text-sm text-ink-dim'>
                    The game has been saved as it was when you opened this. Describe what went wrong
                    and what you expected to happen, so the report can be looked into.
                </p>
                <TextAreaField
                    autoFocus
                    isRequired
                    label='What went wrong?'
                    placeholder='For example: I tried to use a card ability and nothing happened'
                    value={description}
                    onValueChange={setDescription}
                    maxLength={MaxDescriptionLength}
                    minRows={3}
                />
            </div>
        </Dialog>
    );
};

export default ReportProblemModal;
