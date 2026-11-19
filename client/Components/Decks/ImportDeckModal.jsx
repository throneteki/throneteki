import React, { useState } from 'react';
import { TextAreaField } from '../Site/Field';
import Toggle from '../Site/Toggle';
import { useGetCardsQuery, useGetPacksQuery } from '../../redux/middleware/api';
import { processDeckText } from './DeckHelper';
import { Constants, GameFormats } from '../../constants';
import { Button, Link, Spinner } from '@heroui/react';
import Dialog from '../Site/Dialog';
import SelectField from '../Site/SelectField';
import LoadingSpinner from '../Site/LoadingSpinner';
import Notice from '../Site/Notice';
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
    const [gameVariant, setGameVariant] = useState(GameFormats[0].variants[0].name);

    const { data: cards, isLoading: isCardsLoading, isError: isCardsError } = useGetCardsQuery({});
    const { data: packs, isLoading: isPacksLoading, isError: isPacksError } = useGetPacksQuery({});

    const onSubmit = async () => {
        setIsProcessing(true);
        const deck = processDeckText(
            Constants.Factions,
            packs,
            cards,
            deckText,
            isDraftpool ? 'draft' : undefined,
            isDraftpool ? gameVariant : undefined,
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
    };

    return (
        <Dialog
            placement={placement}
            isOpen={modalProps.isOpen}
            onOpenChange={modalProps.onOpenChange}
            title='Import deck'
            size='lg'
            footer={({ close }) => (
                <div className='flex justify-end gap-2'>
                    <Button onPress={close} variant='tertiary'>
                        Close
                    </Button>
                    <Button
                        isDisabled={deckText === ''}
                        isPending={isProcessing || isLoading}
                        onPress={onSubmit}
                        variant='primary'
                    >
                        {(isProcessing || isLoading) && <Spinner color='current' size='sm' />}
                        {submitLabel}
                    </Button>
                </div>
            )}
        >
            <div className='flex flex-col gap-4'>
                {(isCardsError || isPacksError) && (
                    <Notice kind='error'>
                        The card data couldn&apos;t be loaded. Please try again later.
                    </Notice>
                )}
                {isCardsLoading || isPacksLoading ? (
                    <LoadingSpinner />
                ) : (
                    <>
                        {message}
                        <div className='flex flex-wrap items-end gap-4'>
                            <Toggle
                                onValueChange={(isSelected) => {
                                    setIsDraftpool(isSelected);
                                    if (isSelected) {
                                        setGameVariant('towerofjoy');
                                    }
                                }}
                                isSelected={isDraftpool}
                            >
                                {'Import as draft pool'}
                            </Toggle>
                            {isDraftpool && (
                                <SelectField
                                    label='Game variant'
                                    className='md:w-2/6'
                                    value={gameVariant}
                                    onChange={setGameVariant}
                                    items={
                                        GameFormats.find((gf) => gf.name === 'draft')?.variants.map(
                                            (gv) => ({
                                                id: gv.name,
                                                label: gv.label
                                            })
                                        ) || []
                                    }
                                />
                            )}
                        </div>
                        {isDraftpool ? (
                            <p className='text-sm text-ink-dim'>
                                After building your deck on{' '}
                                <Link href='https://draftmancer.com'>Draftmancer</Link>, copy the
                                list by clicking on <strong>Export {'>'} Card Names</strong>, and
                                paste it below.
                            </p>
                        ) : (
                            <p className='text-sm text-ink-dim'>
                                Open your deck on{' '}
                                <Link href='https://thronesdb.com'>ThronesDB</Link>, copy the plain
                                text export from <strong>Actions {'>'} Plain Text</strong>, and
                                paste it below.
                            </p>
                        )}
                        <TextAreaField
                            aria-label='Deck list'
                            minRows={20}
                            value={deckText}
                            isDisabled={isProcessing || isLoading}
                            placeholder={'Paste your deck export here...'}
                            onValueChange={setDeckText}
                        />
                    </>
                )}
            </div>
        </Dialog>
    );
};

export default ImportDeckModal;
