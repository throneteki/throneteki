import React, { useState } from 'react';
import {
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Textarea
} from '@heroui/react';
import { MaxDescriptionLength } from '../../../shared/problemReportLimits';

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
        <Modal isOpen={isOpen} onClose={close} isDismissable={false} size='md'>
            <ModalContent>
                <ModalHeader>Report a problem</ModalHeader>
                <ModalBody>
                    <p className='text-sm'>
                        The game has been saved as it was when you opened this. Describe what went
                        wrong and what you expected to happen, so the report can be looked into.
                    </p>
                    <Textarea
                        autoFocus
                        isRequired
                        label='What went wrong?'
                        placeholder='For example: I tried to use a card ability and nothing happened'
                        value={description}
                        onValueChange={setDescription}
                        maxLength={MaxDescriptionLength}
                        minRows={3}
                    />
                </ModalBody>
                <ModalFooter>
                    <Button variant='light' onPress={close}>
                        Cancel
                    </Button>
                    <Button color='primary' onPress={send} isDisabled={!description.trim()}>
                        Send report
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default ReportProblemModal;
