import React, { useEffect, useMemo, useState } from 'react';

import { BannersForFaction, Constants } from '../../constants';
import ReactTable from '../Table/ReactTable';
import DeckSummary from './DeckSummary';
import AlertPanel from '../Site/AlertPanel';
import {
    Button,
    ButtonGroup,
    Card,
    CardBody,
    Input,
    Select,
    SelectItem,
    extendVariants
} from '@heroui/react';
import LoadingSpinner from '../Site/LoadingSpinner';
import {
    useAddDeckMutation,
    useGetCardsQuery,
    useGetFactionsQuery,
    useGetPacksQuery,
    useGetRestrictedListQuery,
    useSaveDeckMutation
} from '../../redux/middleware/api';
import { navigate } from '../../redux/reducers/navigation';
import { useDispatch } from 'react-redux';
import { validateDeck } from '../../../deck-helper';
import RestrictedListDropdown from './RestrictedListDropdown';
import DeckStatus from './DeckStatus';
import { toast } from 'react-toastify';
import CardHoverable from '../Images/CardHoverable';
import CardImage from '../Images/CardImage';
import FactionFilter from '../Table/FactionFilter';
import CardTypeFilter from '../Table/CardTypeFilter';
import ImportDeckModal from './ImportDeckModal';

const SmallButton = extendVariants(Button, {
    variants: {
        size: {
            xs: 'px-2 min-w-8 h-8 text-small gap-unit-1 border'
        }
    }
});

const DeckEditor = ({ deck, onBackClick }) => {
    const dispatch = useDispatch();
    const { data: cards, isLoading, isError } = useGetCardsQuery({});
    const [addDeck, { isLoading: isAddLoading }] = useAddDeckMutation();
    const [saveDeck, { isLoading: isSaveLoading }] = useSaveDeckMutation();
    const { data: packs } = useGetPacksQuery();
    const { data: restrictedLists } = useGetRestrictedListQuery();
    const {
        data: factions,
        isLoading: isFactionsLoading,
        isError: isFactionsError
    } = useGetFactionsQuery({});
    const [factionFilter, setFactionFilter] = useState(
        [deck.faction.value]
            .concat(['neutral'])
            .concat(
                deck.drawCards
                    .filter((a) => BannersForFaction[a.card.code])
                    .map((a) => BannersForFaction[a.card.code])
            )
    );
    const [typeFilter, setTypeFilter] = useState(
        Constants.CardTypes.map(({ value }) => value).filter((value) => value !== 'title')
    );
    const [deckCards, setDeckCards] = useState(
        (deck.agenda ? [{ card: deck.agenda, count: 1 }] : [])
            .concat(deck.drawCards || [])
            .concat(deck.plotCards || [])
            .concat(deck.bannerCards?.map((bc) => ({ card: bc, count: 1 })) || [])
    );
    const [deckName, setDeckName] = useState(deck.name);
    const [faction, setFaction] = useState(deck.faction);
    const [showImportModal, setShowImportModal] = useState(false);
    const [pageNumber, setPageNumber] = useState(0);

    const [currentRestrictedList, setCurrentRestrictedList] = useState(
        restrictedLists && restrictedLists[0]
    );
    const cardsByCode = cards;
    const factionsByCode = factions;

    const deckToSave = useMemo(() => {
        if (!factionsByCode || !cardsByCode || !packs || !currentRestrictedList) {
            return {};
        }

        const saveDeck = {
            _id: deck._id,
            name: deckName,
            faction: factionsByCode[faction.value],
            agenda: deck.agenda && cardsByCode[deck.agenda.code],
            bannerCards: [],
            plotCards: [],
            drawCards: []
        };

        saveDeck.bannerCards = deckCards
            .filter((dc) => dc.card.code !== deck.agenda?.code && dc.card.type === 'agenda')
            .map((c) => c.card);

        for (const deckCard of deckCards.filter(
            (dc) => cardsByCode[dc.card.code].type === 'plot'
        )) {
            saveDeck.plotCards.push(deckCard);
        }

        for (const deckCard of deckCards.filter(
            (dc) =>
                cardsByCode[dc.card.code].type !== 'plot' &&
                cardsByCode[dc.card.code].type !== 'agenda'
        )) {
            saveDeck.drawCards.push(deckCard);
        }

        if (!saveDeck.status) {
            saveDeck.status = {};
        }

        saveDeck.status[currentRestrictedList._id] = validateDeck(saveDeck, {
            packs: packs,
            restrictedLists: [currentRestrictedList]
        });

        return saveDeck;
    }, [
        cardsByCode,
        currentRestrictedList,
        deck._id,
        deck.agenda,
        deckCards,
        deckName,
        faction.value,
        factionsByCode,
        packs
    ]);

    const columns = useMemo(
        () => [
            {
                accessorFn: (row) => row.label,
                header: 'Name',
                cell: (info) => (
                    <CardHoverable code={info.row.original.code}>{info.getValue()}</CardHoverable>
                ),
                meta: {
                    colWidth: '70%',
                    className: 'min-w-44'
                },
                enableColumnFilter: true
            },
            {
                id: 'C/I',
                accessorFn: (row) =>
                    row.income != undefined ? row.income : row.cost != undefined ? row.cost : '',
                header: 'C/I',
                meta: {
                    colWidth: '10%',
                    className: 'max-sm:hidden'
                },
                enableColumnFilter: false
            },
            {
                id: 'S/I',
                accessorFn: (row) =>
                    row.initiative != undefined
                        ? row.initiative
                        : row.strength != undefined
                          ? row.strength
                          : '',
                header: 'S/I',
                meta: {
                    colWidth: '10%',
                    className: 'max-sm:hidden'
                },
                enableColumnFilter: false
            },
            {
                accessorKey: 'type',
                header: 'T',
                cell: (info) => (
                    <span
                        className={`icon icon-${info.getValue()} text-${info.row.original.faction}`}
                    ></span>
                ),
                filterFn: 'arrIncludesSome',
                meta: {
                    colWidth: '10%'
                },
                enableColumnFilter: false
            },
            {
                id: 'faction',
                accessorKey: 'faction',
                header: 'F',
                cell: (info) => (
                    <span className={`icon icon-${info.getValue()} text-${info.getValue()}`}></span>
                ),
                filterFn: 'arrIncludesSome',
                meta: {
                    colWidth: '10%'
                },
                enableColumnFilter: false
            },
            {
                id: 'quantity',
                accessorFn: (row) => {
                    const deckCard = deckCards.find((dc) => dc.card.code === row.code);
                    return deckCard?.count || 0;
                },
                header: 'Qty',
                cell: (info) => {
                    const max = info.row.original.deckLimit + 1;
                    const deckCard = deckCards.find(
                        (dc) => dc.card.code === info.row.original.code
                    );
                    const count = deckCard?.count || 0;

                    const setCardQuantity = (code, quantity) => {
                        const newDeckCards = [];
                        let found = false;

                        for (const deckCard of deckCards) {
                            const newDeckCard = Object.assign({}, deckCard);

                            if (deckCard.card.code === code) {
                                found = true;

                                newDeckCard.count = quantity;
                            }

                            if (newDeckCard.count > 0) {
                                newDeckCards.push(newDeckCard);
                            }
                        }

                        if (!found) {
                            const newCard = {
                                card: cardsByCode[code],
                                count: quantity
                            };

                            newDeckCards.push(newCard);
                        }

                        setDeckCards(newDeckCards);
                    };
                    return (
                        <>
                            <Select
                                className='sm:hidden'
                                onChange={(e) =>
                                    setCardQuantity(
                                        info.row.original.code,
                                        parseInt(e.target.value)
                                    )
                                }
                                defaultSelectedKeys={['0']}
                                selectedKeys={[count.toString()]}
                                classNames={{ trigger: 'h-8 min-h-8' }}
                            >
                                {[...Array(max).keys()].map((digit) => (
                                    <SelectItem key={digit.toString()} textValue={digit.toString()}>
                                        {digit}
                                    </SelectItem>
                                ))}
                            </Select>
                            <ButtonGroup className='max-sm:hidden'>
                                {[...Array(max).keys()].map((digit) => (
                                    <SmallButton
                                        size='xs'
                                        className='w-1'
                                        key={digit}
                                        value={digit}
                                        color={count === digit ? 'primary' : null}
                                        onPress={() =>
                                            setCardQuantity(info.row.original.code, digit)
                                        }
                                    >
                                        {digit}
                                    </SmallButton>
                                ))}
                            </ButtonGroup>
                        </>
                    );
                },
                meta: {
                    colWidth: '10%',
                    className: 'min-w-20'
                }
            }
        ],
        [deckCards, cardsByCode]
    );

    const cardsMemo = useMemo(() => {
        if (!cards) {
            return {};
        }
        return { data: Object.values(cards) };
    }, [cards]);

    useEffect(() => {
        setFaction(deck.faction);
    }, [deck.faction]);

    useEffect(() => {
        if (!currentRestrictedList && restrictedLists) {
            setCurrentRestrictedList(restrictedLists[0]);
        }
    }, [currentRestrictedList, restrictedLists]);

    if (isLoading || isFactionsLoading || !packs || !currentRestrictedList) {
        return <LoadingSpinner />;
    } else if (isError || isFactionsError) {
        return (
            <AlertPanel variant='danger'>
                An error occurred loading data from the server. Please try again later.
            </AlertPanel>
        );
    }

    const onSaveClick = async (andClose) => {
        try {
            deckToSave._id
                ? await saveDeck(deckToSave).unwrap()
                : await addDeck(deckToSave).unwrap();

            toast.success(`Deck ${deckToSave._id ? 'saved' : 'added'} successfully.`);

            if (andClose) {
                dispatch(navigate('/decks'));
            }
        } catch (err) {
            toast.error(
                `An error occured ${deckToSave._id ? 'saving' : 'adding'}  the deck. Please try again later`
            );
        }
    };

    return (
        <div className='flex flex-col gap-3'>
            <div className='flex flex-wrap gap-2'>
                <Button color='default' onPress={() => onBackClick()}>
                    Back
                </Button>
                <Button
                    color='primary'
                    isLoading={isAddLoading || isSaveLoading}
                    onPress={() => onSaveClick(true)}
                >
                    Save & Close
                </Button>
                <Button
                    color='primary'
                    isLoading={isAddLoading || isSaveLoading}
                    onPress={() => onSaveClick(false)}
                >
                    Save
                </Button>
                <Button onPress={() => setShowImportModal(true)}>Import</Button>
            </div>
            <div className='columns-1 xl:columns-2 gap-4'>
                <div className='flex flex-col gap-2 break-inside-avoid'>
                    <Input
                        placeholder={'Enter a name'}
                        value={deckName}
                        onValueChange={setDeckName}
                        label={'Deck Name'}
                    />
                    <div className='flex max-md:flex-wrap gap-2'>
                        <Select
                            className='w-full md:w-1/2'
                            items={Constants.Factions}
                            label='Faction'
                            selectedKeys={new Set([faction.value])}
                            onChange={(e) => setFaction(e.target)}
                            renderValue={(items) => {
                                return items.map((item) => (
                                    <div key={item.key}>{item.data.name}</div>
                                ));
                            }}
                        >
                            {(faction) => (
                                <SelectItem key={faction.value}>
                                    <div className='flex gap-2 items-center'>
                                        <CardImage size='small' code={faction.value} />
                                        <div>{faction.name}</div>
                                    </div>
                                </SelectItem>
                            )}
                        </Select>
                        <RestrictedListDropdown
                            className='w-full md:w-1/2'
                            currentRestrictedList={currentRestrictedList}
                            onChange={(restrictedList) => {
                                setCurrentRestrictedList(restrictedList);
                            }}
                            restrictedLists={restrictedLists}
                        />
                    </div>
                    <Card>
                        <CardBody>
                            <div className='flex'>
                                <dl className='grid grid-cols-2 gap-2'>
                                    <dt className='font-bold'>Plot cards:</dt>
                                    <dd>
                                        {deckToSave.plotCards.reduce(
                                            (acc, card) => acc + card.count,
                                            0
                                        )}
                                    </dd>
                                    <dt className='font-bold'>Draw cards:</dt>
                                    <dd>
                                        {deckToSave.drawCards.reduce(
                                            (acc, card) => acc + card.count,
                                            0
                                        )}
                                    </dd>
                                </dl>
                            </div>
                            <div className='flex gap-2 items-center'>
                                <div className='font-bold'>Validity:</div>
                                <DeckStatus status={deckToSave.status[currentRestrictedList._id]} />
                            </div>
                        </CardBody>
                    </Card>
                    <CardTypeFilter
                        className='self-start'
                        filter={typeFilter}
                        setFilter={setTypeFilter}
                        types={Constants.CardTypes.filter(({ value }) => value !== 'title')}
                    />
                    <FactionFilter
                        className='self-start'
                        filter={factionFilter}
                        setFilter={setFactionFilter}
                        factions={Constants.Factions.concat({ name: 'Neutral', value: 'neutral' })}
                    />
                    <div className='min-h-96 h-[50vh]'>
                        <ReactTable
                            dataLoadFn={() => ({
                                data: cardsMemo,
                                isLoading: false,
                                isError: false
                            })}
                            defaultColumnFilters={{ type: typeFilter, faction: factionFilter }}
                            defaultSort={[
                                {
                                    id: 'type',
                                    desc: true
                                }
                            ]}
                            disableSelection
                            columns={columns}
                            startPageNumber={pageNumber}
                            onPageChanged={(page) => setPageNumber(page)}
                            classNames={{
                                td: 'max-sm:px-2',
                                th: 'max-sm:px-2'
                            }}
                        />
                    </div>
                </div>
                <DeckSummary
                    className='break-inside-avoid'
                    deck={{
                        name: deckName,
                        deckCards: deckCards,
                        faction: factionsByCode[deck.faction.code]
                    }}
                />

                <ImportDeckModal
                    isOpen={showImportModal}
                    onOpenChange={(open) => setShowImportModal(open)}
                    onProcessed={async (deck) => {
                        try {
                            setFaction(deck.faction);
                            setDeckName(deck.name);
                            setDeckCards(
                                (deck.agenda ? [{ card: deck.agenda, count: 1 }] : [])
                                    .concat(deck.drawCards || [])
                                    .concat(deck.plotCards || [])
                                    .concat(
                                        deck.bannerCards?.map((bc) => ({
                                            card: bc,
                                            count: 1
                                        })) || []
                                    )
                            );
                            toast.success('Deck changes imported successfully');
                            await onSaveClick(false);
                            setShowImportModal(false);
                        } catch (err) {
                            toast.error('An error occurred importing deck changes');
                        }
                    }}
                    message={
                        <p className='text-bold text-danger-300'>
                            Note: The deck you are editing will be overwritten!
                        </p>
                    }
                />
            </div>
        </div>
    );
};

export default DeckEditor;
