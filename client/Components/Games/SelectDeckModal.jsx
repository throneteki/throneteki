import React from 'react';
import { Modal, ModalBody, ModalContent, ModalHeader, Tab, Tabs } from '@heroui/react';
import DeckList from '../Decks/DeckList';
import { useGetDecksQuery, useGetStandaloneDecksQuery } from '../../redux/middleware/api';

const SelectDeckModal = ({ isOpen, onClose, onDeckSelected, game }) => {
    const deckTabs = [
        { title: 'My Decks', dataQuery: useGetDecksQuery },
        { title: 'Standalone Decks', dataQuery: useGetStandaloneDecksQuery }
    ];
    return (
        <Modal
            className='max-h-screen'
            isOpen={isOpen}
            onClose={onClose}
            size='5xl'
            scrollBehavior='inside'
        >
            <ModalContent>
                <ModalHeader>{'Select Deck'}</ModalHeader>
                <ModalBody>
                    <Tabs items={deckTabs}>
                        {(item) => (
                            <Tab key={item.title} title={item.title}>
                                <DeckList
                                    deckLoadFn={item.dataQuery}
                                    onDeckSelected={onDeckSelected}
                                    readOnly={true}
                                    format={game.gameFormat}
                                    variant={game.gameVariant}
                                    legality={game.restrictedList._id}
                                    eventId={game.event?._id}
                                />
                            </Tab>
                        )}
                    </Tabs>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default SelectDeckModal;
