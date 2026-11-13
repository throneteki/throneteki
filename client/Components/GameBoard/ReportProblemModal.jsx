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

const ReportProblemModal = ({ isOpen, onClose, onSend }) => {
    const [description, setDescription] = useState('');

    const send = () => {
        if (description.trim()) {
            onSend(description.trim());
        }
        setDescription('');
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size='md'>
            <ModalContent>
                <ModalHeader>Report a problem</ModalHeader>
                <ModalBody>
                    <Textarea
                        autoFocus
                        label='What went wrong?'
                        placeholder='For example: I tried to use a card ability and nothing happened'
                        value={description}
                        onValueChange={setDescription}
                        maxLength={MaxDescriptionLength}
                        minRows={3}
                    />
                </ModalBody>
                <ModalFooter>
                    <Button variant='light' onPress={onClose}>
                        Skip
                    </Button>
                    <Button color='primary' onPress={send} isDisabled={!description.trim()}>
                        Add description
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default ReportProblemModal;
