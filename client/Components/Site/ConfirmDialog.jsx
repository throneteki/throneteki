import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@heroui/react';
import React from 'react';

const ConfirmDialog = ({
    isOpen,
    onOpenChange,
    title = 'Are you sure?',
    message,
    onOk,
    onCancel
}) => {
    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className='flex flex-col gap-1'>{title}</ModalHeader>
                        <ModalBody>{message}</ModalBody>
                        <ModalFooter>
                            <Button
                                color='primary'
                                onPress={() => {
                                    onClose();

                                    if (onOk) {
                                        onOk();
                                    }
                                }}
                            >
                                Yes
                            </Button>
                            <Button
                                onPress={(e) => {
                                    onClose(e);
                                    if (onCancel) {
                                        onCancel();
                                    }
                                }}
                            >
                                No
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};

export default ConfirmDialog;
