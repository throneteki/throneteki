import React, { useState } from 'react';
import {
    useGetCardsQuery,
    useGetFactionsQuery,
    useGetPacksQuery
} from '../../redux/middleware/api';
import { processThronesDbDeckText } from './DeckHelper';
import {
    Button,
    Link,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Textarea
} from '@heroui/react';
import LoadingSpinner from '../Site/LoadingSpinner';
import AlertPanel from '../Site/AlertPanel';
import { toast } from 'react-toastify';

const ImportDeckModal = ({
    onProcessed,
    isLoading,
    message,
    placement = 'center',
    submitLabel = 'Submit',
    ...modalProps
}) => {
    const [deckText, setDeckText] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const {
        data: factions,
        isLoading: isFactionsLoading,
        isError: isFactionsError
    } = useGetFactionsQuery({});
    const { data: cards, isLoading: isCardsLoading, isError: isCardsError } = useGetCardsQuery({});
    const { data: packs, isLoading: isPacksLoading, isError: isPacksError } = useGetPacksQuery({});

    return (
        <Modal placement={placement} {...modalProps}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className='flex flex-col gap-1'>
                            Import from ThronesDb
                        </ModalHeader>
                        <ModalBody>
                            <div className='flex flex-col gap-2'>
                                {(isFactionsError || isCardsError || isPacksError) && (
                                    <AlertPanel
                                        variant='danger'
                                        message='An error occured loading the card data. Please try again later'
                                    />
                                )}
                                {isFactionsLoading || isCardsLoading || isPacksLoading ? (
                                    <LoadingSpinner />
                                ) : (
                                    <>
                                        <span>{message}</span>
                                        <span>
                                            Open your deck on{' '}
                                            <Link href='https://thronesdb.com'>ThronesDB</Link>,
                                            copy the plain text export from{' '}
                                            <strong>Actions {'>'} Plain Text</strong>, and paste it
                                            below.
                                        </span>
                                        <Textarea
                                            minRows={20}
                                            value={deckText}
                                            isDisabled={isProcessing || isLoading}
                                            placeholder={'Paste your deck export here...'}
                                            onValueChange={setDeckText}
                                        />
                                    </>
                                )}
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button onPress={onClose}>Close</Button>
                            <Button
                                color='primary'
                                isDisabled={deckText === ''}
                                isLoading={isProcessing || isLoading}
                                onPress={async () => {
                                    setIsProcessing(true);
                                    const deck = processThronesDbDeckText(
                                        factions,
                                        packs,
                                        cards,
                                        deckText
                                    );
                                    if (!deck) {
                                        toast.error(
                                            'There was an error processing your deck. Please ensure you have pasted a plain text export from ThronesDB.'
                                        );
                                    } else {
                                        await onProcessed(deck);
                                    }
                                    setIsProcessing(false);
                                }}
                            >
                                {submitLabel}
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};

export default ImportDeckModal;
