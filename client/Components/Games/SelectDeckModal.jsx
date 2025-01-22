import React from 'react';
import { Modal, ModalBody, ModalContent, ModalHeader } from '@heroui/react';
import DeckList from '../Decks/DeckList';

const SelectDeckModal = ({ onClose, onDeckSelected, restrictedList }) => {
    //  const standaloneDecks = useSelector((state) => state.cards.standaloneDecks);
    return (
        <>
            <Modal isOpen={true} onClose={onClose} size='5xl'>
                <ModalContent>
                    <ModalHeader>{'Select Deck'}</ModalHeader>
                    <ModalBody>
                        <div>
                            <DeckList
                                onDeckSelected={onDeckSelected}
                                readOnly={true}
                                restrictedList={restrictedList}
                            />
                            {/*standaloneDecks && standaloneDecks.length !== 0 && (
                            <div>
                                <h4 className='deck-list-header'>
                                    <Trans>Or choose a standalone deck</Trans>:
                                </h4>
                                <DeckList standaloneDecks onDeckSelected={onDeckSelected} />
                            </div>
                        )*/}
                        </div>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
};

export default SelectDeckModal;
