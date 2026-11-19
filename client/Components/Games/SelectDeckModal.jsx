import React from 'react';
import { Tabs } from '@heroui/react';
import Dialog from '../Site/Dialog';
import DeckList from '../Decks/DeckList';
import { useGetDecksQuery, useGetStandaloneDecksQuery } from '../../redux/middleware/api';

const SelectDeckModal = ({ isOpen, onClose, onDeckSelected, game }) => {
    const deckTabs = [
        { title: 'My Decks', dataQuery: useGetDecksQuery },
        { title: 'Standalone Decks', dataQuery: useGetStandaloneDecksQuery }
    ];
    return (
        <Dialog
            isOpen={isOpen}
            onOpenChange={(open) => !open && onClose()}
            title='Select deck'
            size='lg'
            className='w-full max-w-[calc(100vw-1rem)] sm:max-w-[38rem] md:max-w-[46rem] lg:max-w-[62rem] xl:max-w-[78rem] 2xl:max-w-[94rem]'
        >
            <Tabs>
                <Tabs.ListContainer>
                    <Tabs.List aria-label='Deck lists'>
                        {deckTabs.map((item) => (
                            <Tabs.Tab key={item.title} id={item.title}>
                                {item.title}
                                <Tabs.Indicator />
                            </Tabs.Tab>
                        ))}
                    </Tabs.List>
                </Tabs.ListContainer>
                {deckTabs.map((item) => (
                    <Tabs.Panel key={item.title} id={item.title}>
                        <DeckList
                            deckLoadFn={item.dataQuery}
                            onDeckSelected={onDeckSelected}
                            readOnly={true}
                            format={game.gameFormat}
                            variant={game.gameVariant}
                            legality={game.restrictedList?._id}
                            eventId={game.event?._id}
                        />
                    </Tabs.Panel>
                ))}
            </Tabs>
        </Dialog>
    );
};

export default SelectDeckModal;
