import React, { useMemo, useState } from 'react';

import { BannersForFaction, Constants } from '../../constants';
import ReactTable from '../Table/ReactTable';
import DeckSummary from './DeckSummary';
import AlertPanel from '../Site/AlertPanel';
import { Button, ButtonGroup, Input, extendVariants } from '@nextui-org/react';
import LoadingSpinner from '../Site/LoadingSpinner';
import {
    useAddDeckMutation,
    useGetCardsQuery,
    useGetFactionsQuery,
    useSaveDeckMutation
} from '../../redux/middleware/api';

const SmallButton = extendVariants(Button, {
    variants: {
        size: {
            xs: 'px-2 min-w-8 h-8  text-small gap-unit-1 rounded-none first:rounded-l-md last:rounded-r-md border'
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
    const { data: cards, isLoading, isError } = useGetCardsQuery({});
    const [addDeck, { isLoading: isAddLoading }] = useAddDeckMutation();
    const [saveDeck, { isLoading: isSaveLoading }] = useSaveDeckMutation();
    const {
        data: factions,
        isLoading: isFactionsLoading,
        isError: isFactionsError
    } = useGetFactionsQuery({});
    const [factionFilter, setFactionFilter] = useState(
        [deck.faction.code]
            .concat(['neutral'])
            .concat(
                deck.drawCards
                    .filter((a) => BannersForFaction[a.card.code])
                    .map((a) => BannersForFaction[a.card.code])
            )
    );
    const [typeFilter, setTypeFilter] = useState(['character', 'agenda', 'plot']);
    const [deckCards, setDeckCards] = useState(deck.drawCards.concat(deck.plotCards) || []);
    const [deckName, setDeckName] = useState(deck.name);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const buildSaveDeck = () => {
        const saveDeck = {
            _id: deck._id,
            name: deckName,
            faction: factionsByCode[deck.faction.value],
            agenda: deck.agenda && cardsByCode[deck.agenda.code],
            bannerCards: [],
            plotCards: [],
            drawCards: []
        };

        saveDeck.bannerCards = deckCards
            .filter((dc) => dc.card.type === 'agenda')
            .map((c) => c.card.code);

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

        return saveDeck;
    };

    const cardsByCode = cards;

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
                header: 'Quantity',
                cell: (info) => {
                    const max = info.row.original.deckLimit + 1;
                    const deckCard = deckCards.find(
                        (dc) => dc.card.code === info.row.original.code
                    );
                    const count = deckCard?.count || 0;

                    return (
                        <ButtonGroup className='rounded-md border' radius='md'>
                            {[...Array(max).keys()].map((digit) => (
                                <SmallButton
                                    size='xs'
                                    className='w-1'
                                    key={digit}
                                    value={digit}
                                    color={count === digit ? 'primary' : null}
                                    onClick={() => {
                                        let deckCard = deckCards.find(
                                            (dc) => dc.card.code === info.row.original.code
                                        );

                                        if (!deckCard) {
                                            deckCard = {
                                                card: cardsByCode[info.row.original.code],
                                                count: digit
                                            };

                                            deckCards.push(deckCard);
                                        }

                                        deckCard.count = digit;

                                        const newDeckCards = [
                                            ...deckCards.filter((dc) => dc.count > 0)
                                        ];

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

    const factionsByCode = factions;

    let cardTypes = useMemo(() => {
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

    if (isLoading || isFactionsLoading) {
        return <LoadingSpinner text={'Loading, please wait...'} />;
    } else if (isError || isFactionsError) {
        return (
            <AlertPanel variant='danger'>
                An error occurred loading data from the server. Please try again later.
            </AlertPanel>
        );
    }

    console.info(deckCards);

    return (
        <div className='grid grid-cols-2 gap-4'>
            <div>
                <div className='mb-2'>
                    <Button color='default' className='mr-2' onClick={() => onBackClick()}>
                        Back
                    </Button>
                    <Button
                        color='primary'
                        isLoading={isAddLoading || isSaveLoading}
                        onClick={async () => {
                            setError('');
                            setSuccess('');

                            const deckToSave = buildSaveDeck();

                            try {
                                const response = deckToSave._id
                                    ? await saveDeck(deckToSave).unwrap()
                                    : await addDeck(deckToSave).unwrap();
                                if (!response.success) {
                                    setError(response.message);
                                } else {
                                    setSuccess('Deck added successfully.');
                                }
                            } catch (err) {
                                const apiError = err;
                                setError(
                                    apiError.data.message ||
                                        'An error occured adding the deck. Please try again later.'
                                );
                            }
                        }}
                    >
                        Save
                    </Button>
                </div>
                {error && <AlertPanel variant='danger'>{error}</AlertPanel>}
                {success && <AlertPanel variant='success'>{success}</AlertPanel>}
                <div>
                    <Input
                        placeholder={'Enter a name'}
                        value={deckName}
                        onChange={(event) => setDeckName(event.target.value)}
                        label={'Deck Name'}
                    />
                    <div>
                        <ButtonGroup className='mt-3 rounded-md border' radius='md'>
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
                        <ButtonGroup
                            className='mb-3 mt-1 rounded-md border'
                            radius='md'
                            aria-label='First group'
                        >
                            {Constants.Factions.concat('neutral').map((faction) => {
                                return (
                                    <SmallButton
                                        key={faction}
                                        size='xs'
                                        color={
                                            factionFilter.some((f) => f === faction)
                                                ? 'primary'
                                                : null
                                        }
                                        onClick={() =>
                                            setFactionFilter(
                                                factionFilter.some((f) => f === faction)
                                                    ? factionFilter.filter((f) => f !== faction)
                                                    : factionFilter.concat(faction)
                                            )
                                        }
                                    >
                                        <span
                                            className={`icon icon-${faction} ${factionToTextColourMap[faction]}`}
                                        ></span>
                                    </SmallButton>
                                );
                            })}
                        </ButtonGroup>
                    </div>
                    <div className='h-[60vh]'>
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
        </div>
    );
};

export default DeckEditor;
