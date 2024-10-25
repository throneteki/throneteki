import React, { useEffect, useMemo, useState } from 'react';

import { BannersForFaction, Constants } from '../../constants';
import ReactTable from '../Table/ReactTable';
import DeckSummary from './DeckSummary';
import AlertPanel from '../Site/AlertPanel';
import {
    Button,
    ButtonGroup,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Select,
    SelectItem,
    Textarea,
    extendVariants
} from '@nextui-org/react';
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
import FactionImage from '../Images/FactionImage';
import { validateDeck } from '../../../deck-helper';
import RestrictedListDropdown from './RestrictedListDropdown';
import DeckStatus from './DeckStatus';
import { processThronesDbDeckText } from './DeckHelper';

const SmallButton = extendVariants(Button, {
    variants: {
        size: {
            xs: 'px-2 min-w-8 h-8 text-small gap-unit-1 border'
        }
    }
});

const factionToTextColourMap = {
    baratheon: 'text-baratheon',
    greyjoy: 'text-greyjoy',
    lannister: 'text-lannister',
    martell: 'text-martell',
    neutral: 'text-neutral',
    stark: 'text-startl',
    targaryen: 'text-targaryen',
    thenightswatch: 'text-thenightswatch',
    tyrell: 'text-tyrell'
};

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
    const [typeFilter, setTypeFilter] = useState(['character', 'agenda', 'plot']);
    const [deckCards, setDeckCards] = useState(
        (deck.agenda ? [{ card: deck.agenda, count: 1 }] : [])
            .concat(deck.drawCards || [])
            .concat(deck.plotCards || [])
            .concat(deck.bannerCards?.map((bc) => ({ card: bc, count: 1 })) || [])
    );
    const [deckName, setDeckName] = useState(deck.name);
    const [faction, setFaction] = useState(deck.faction);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showImportPopup, setShowImportPopup] = useState(false);
    const [deckText, setDeckText] = useState();

    const [currentRestrictedList, setCurrentRestrictedList] = useState(
        restrictedLists && restrictedLists[0]
    );
    const cardsByCode = cards;
    const factionsByCode = factions;

    const deckToSave = useMemo(() => {
        if (!factionsByCode || !cardsByCode || !packs || !currentRestrictedList) {
            return null;
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
            .filter((dc) => dc.card.code !== deck.agenda.code && dc.card.type === 'agenda')
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
                cell: (info) => info.getValue(),
                meta: {
                    colWidth: '70%'
                }
            },
            {
                id: 'C/I',
                accessorFn: (row) =>
                    row.income != undefined ? row.income : row.cost != undefined ? row.cost : '',
                header: 'C/I',
                meta: {
                    colWidth: '10%'
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
                    colWidth: '10%'
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
                header: 'Quantity',
                cell: (info) => {
                    const max = info.row.original.deckLimit + 1;
                    const deckCard = deckCards.find(
                        (dc) => dc.card.code === info.row.original.code
                    );
                    const count = deckCard?.count || 0;

                    return (
                        <ButtonGroup>
                            {[...Array(max).keys()].map((digit) => (
                                <SmallButton
                                    size='xs'
                                    className='w-1'
                                    key={digit}
                                    value={digit}
                                    color={count === digit ? 'primary' : null}
                                    onClick={() => {
                                        const newDeckCards = [];
                                        let found = false;

                                        for (const deckCard of deckCards) {
                                            const newDeckCard = Object.assign({}, deckCard);

                                            if (deckCard.card.code === info.row.original.code) {
                                                found = true;

                                                newDeckCard.count = digit;
                                            }

                                            if (newDeckCard.count > 0) {
                                                newDeckCards.push(newDeckCard);
                                            }
                                        }

                                        if (!found) {
                                            const newCard = {
                                                card: cardsByCode[info.row.original.code],
                                                count: digit
                                            };

                                            newDeckCards.push(newCard);
                                        }

                                        setDeckCards(newDeckCards);
                                    }}
                                >
                                    {digit}
                                </SmallButton>
                            ))}
                        </ButtonGroup>
                    );
                },
                meta: {
                    colWidth: 1
                }
            }
        ],
        [deckCards, cardsByCode]
    );

    const cardTypes = useMemo(() => {
        if (!cards) {
            return [];
        }
        let cardTypes = Object.values(cards)
            .filter((c) => c.type !== 'title')
            .map((card) => card.type);

        return Array.from(new Set(cardTypes));
    }, [cards]);

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

    if (isLoading || isFactionsLoading) {
        return <LoadingSpinner text={'Loading, please wait...'} />;
    } else if (isError || isFactionsError) {
        return (
            <AlertPanel variant='danger'>
                An error occurred loading data from the server. Please try again later.
            </AlertPanel>
        );
    }

    const onSaveClick = async (andClose) => {
        setError();
        setSuccess();

        try {
            deckToSave._id
                ? await saveDeck(deckToSave).unwrap()
                : await addDeck(deckToSave).unwrap();
            setSuccess(`Deck ${deckToSave._id ? 'saved' : 'added'} successfully.`);

            if (andClose) {
                setTimeout(() => {
                    dispatch(navigate('/decks'));
                }, 1500);
            } else {
                setTimeout(() => {
                    setSuccess();
                }, 1500);
            }
        } catch (err) {
            const apiError = err;
            setError(
                apiError.data.message || 'An error occured adding the deck. Please try again later.'
            );
        }
    };

    return (
        <div className='grid lg:grid-cols-2 gap-4'>
            <div className='flex flex-col gap-2'>
                {(error || success) && (
                    <div className='mb-2'>
                        {error && <AlertPanel variant='danger'>{error}</AlertPanel>}
                        {success && <AlertPanel variant='success'>{success}</AlertPanel>}
                    </div>
                )}
                <div className='flex gap-2'>
                    <Button color='default' onClick={() => onBackClick()}>
                        Back
                    </Button>
                    <Button
                        color='primary'
                        isLoading={isAddLoading || isSaveLoading}
                        onClick={() => onSaveClick(true)}
                    >
                        Save and close
                    </Button>
                    <Button
                        color='primary'
                        isLoading={isAddLoading || isSaveLoading}
                        onClick={() => onSaveClick(false)}
                    >
                        Save
                    </Button>
                    <Button onClick={() => setShowImportPopup(true)}>Import</Button>
                </div>
                <div className='flex flex-col gap-2'>
                    <Input
                        placeholder={'Enter a name'}
                        value={deckName}
                        onChange={(event) => setDeckName(event.target.value)}
                        label={'Deck Name'}
                    />
                    <Select
                        items={Constants.Factions}
                        label='Faction'
                        selectedKeys={new Set([faction.value])}
                        onChange={(e) => setFaction(e.target)}
                        renderValue={(items) => {
                            return items.map((item) => <div key={item.key}>{item.data.name}</div>);
                        }}
                    >
                        {(faction) => (
                            <SelectItem key={faction.value}>
                                <div className='flex gap-2 items-center'>
                                    <FactionImage size='sm' faction={faction.value} />
                                    <div>{faction.name}</div>
                                </div>
                            </SelectItem>
                        )}
                    </Select>
                    <RestrictedListDropdown
                        currentRestrictedList={currentRestrictedList}
                        onChange={(restrictedList) => {
                            setCurrentRestrictedList(restrictedList);
                        }}
                        restrictedLists={restrictedLists}
                    />
                    <div className='flex mt-1 ml-1'>
                        <dl className='grid grid-cols-2 gap-2'>
                            <dt className='font-bold'>Draw cards:</dt>
                            <dd>
                                {deckToSave.drawCards.reduce((acc, card) => acc + card.count, 0)}
                            </dd>
                            <dt className='font-bold'>Plot cards:</dt>
                            <dd>
                                {deckToSave.plotCards.reduce((acc, card) => acc + card.count, 0)}
                            </dd>
                        </dl>
                    </div>
                    <div className='flex gap-2 items-center ml-1'>
                        <div className='font-bold'>Validity:</div>
                        <DeckStatus status={deckToSave.status[currentRestrictedList._id]} />
                    </div>
                    <div className='mt-1'>
                        <ButtonGroup>
                            {cardTypes.map((type) => {
                                return (
                                    <SmallButton
                                        key={type}
                                        size='xs'
                                        color={
                                            typeFilter.some((t) => t === type) ? 'primary' : null
                                        }
                                        onClick={() =>
                                            setTypeFilter(
                                                typeFilter.some((t) => t === type)
                                                    ? typeFilter.filter((t) => t !== type)
                                                    : typeFilter.concat(type)
                                            )
                                        }
                                    >
                                        <span className={`icon icon-${type}`}></span>
                                    </SmallButton>
                                );
                            })}
                        </ButtonGroup>
                    </div>
                    <div>
                        <ButtonGroup aria-label='Faction buttons'>
                            {Constants.Factions.concat({ name: 'Neutral', value: 'neutral' }).map(
                                (faction) => {
                                    return (
                                        <SmallButton
                                            key={faction.value}
                                            size='xs'
                                            color={
                                                factionFilter.some((f) => f === faction.value)
                                                    ? 'primary'
                                                    : null
                                            }
                                            onClick={() =>
                                                setFactionFilter(
                                                    factionFilter.some((f) => f === faction.value)
                                                        ? factionFilter.filter(
                                                              (f) => f !== faction.value
                                                          )
                                                        : factionFilter.concat(faction.value)
                                                )
                                            }
                                        >
                                            <span
                                                className={`icon icon-${faction.value} ${factionToTextColourMap[faction.value]}`}
                                            ></span>
                                        </SmallButton>
                                    );
                                }
                            )}
                        </ButtonGroup>
                    </div>
                    <div className='h-[50vh]'>
                        <ReactTable
                            dataLoadFn={() => ({
                                data: cardsMemo,
                                isLoading: false,
                                isError: false
                            })}
                            defaultColumnFilters={{ type: typeFilter, faction: factionFilter }}
                            defaultSort={{
                                column: 'type',
                                direction: 'descending'
                            }}
                            disableSelection
                            columns={columns}
                        />
                    </div>
                </div>
            </div>
            <div>
                <DeckSummary
                    deck={{
                        name: deckName,
                        deckCards: deckCards,
                        faction: factionsByCode[deck.faction.code]
                    }}
                />
            </div>

            <Modal isOpen={showImportPopup} onOpenChange={(open) => setShowImportPopup(open)}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className='flex flex-col gap-1'>
                                Import from ThronesDb
                            </ModalHeader>
                            <ModalBody>
                                <label>
                                    Export your deck as plain text from{' '}
                                    <a
                                        href='https://thronesdb.com'
                                        target='_blank'
                                        rel='noreferrer'
                                    >
                                        ThronesDB
                                    </a>{' '}
                                    and paste it into this box.
                                    <p className='text-bold text-danger-300'>
                                        Note: The deck you are editing will be overwritten!
                                    </p>
                                </label>
                                <Textarea
                                    minRows={20}
                                    value={deckText}
                                    onValueChange={setDeckText}
                                />
                            </ModalBody>
                            <ModalFooter>
                                <Button onPress={onClose}>Close</Button>
                                <Button
                                    color='primary'
                                    onPress={() => {
                                        const deck = processThronesDbDeckText(
                                            factions,
                                            packs,
                                            cards,
                                            deckText
                                        );

                                        if (!deck) {
                                            setError(
                                                'Invalid deck. Ensure you have exported a plain text deck from ThronesDb.'
                                            );

                                            onClose();

                                            return;
                                        }

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

                                        onClose();
                                    }}
                                >
                                    Import
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
};

export default DeckEditor;
