import React, { useState } from 'react';
import {
    useGetCardsQuery,
    useGetFactionsQuery,
    useGetPacksQuery
} from '../../redux/middleware/api';
import { processDeckText } from './DeckHelper';
import {
    Button,
    Link,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Switch,
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
    const [isDraftpool, setIsDraftpool] = useState(false);

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
                        <ModalHeader className='flex flex-col gap-1'>Import Decklist</ModalHeader>
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
                                        <Switch
                                            id='importDraftPool'
                                            onValueChange={(isSelected) =>
                                                setIsDraftpool(isSelected)
                                            }
                                            isSelected={isDraftpool}
                                        >
                                            {'Import as draft pool'}
                                        </Switch>
                                        {isDraftpool ? (
                                            <span>
                                                After building your deck on{' '}
                                                <Link href='https://draftmancer.com'>
                                                    Draftmancer
                                                </Link>
                                                , copy the list by clicking on{' '}
                                                <strong>Export {'>'} Card Names</strong>, and paste
                                                it below.
                                            </span>
                                        ) : (
                                            <span>
                                                Open your deck on{' '}
                                                <Link href='https://thronesdb.com'>ThronesDB</Link>,
                                                copy the plain text export from{' '}
                                                <strong>Actions {'>'} Plain Text</strong>, and paste
                                                it below.
                                            </span>
                                        )}
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
                                    const deck = processDeckText(
                                        factions,
                                        packs,
                                        cards,
                                        deckText,
                                        isDraftpool
                                    );
                                    if (!deck) {
                                        toast.error(
                                            'There was an error processing your deck. Please ensure you have pasted a plain text export from ThronesDB, card name export from Draftmancer, or a plain card list.'
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
