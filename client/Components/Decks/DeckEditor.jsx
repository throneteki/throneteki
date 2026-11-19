import React, { useEffect, useMemo, useState } from 'react';

import Field from '../Site/Field';

import { BannersForFaction, Constants } from '../../constants';
import ReactTable from '../Table/ReactTable';
import DeckSummary from './DeckSummary';
import Frame from '../Site/Frame';
import Notice from '../Site/Notice';
import { Button, ButtonGroup, Spinner } from '@heroui/react';
import SelectField from '../Site/SelectField';
import LoadingSpinner from '../Site/LoadingSpinner';
import {
    useAddDeckMutation,
    useGetEventQuery,
    useSaveDeckMutation
} from '../../redux/middleware/api';
import { navigate } from '../../redux/reducers/navigation';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import CardHoverable from '../Images/CardHoverable';
import FactionFilter from '../Table/FactionFilter';
import CardTypeFilter from '../Table/CardTypeFilter';
import ImportDeckModal from './ImportDeckModal';
import ThronesIcon from '../GameBoard/ThronesIcon';
import PoolInfo from './PoolInfo';
import FormatSelect from '../Games/FormatSelect';
import VariantSelect from '../Games/VariantSelect';
import LegalitySelect from '../Games/LegalitySelect';
import FactionSelect from '../Games/FactionSelect';
import DeckStatus from './DeckStatus';
import { validateDeck } from '../../../deck-helper';
import { formatDeckAsFullCards } from '../../../deck-helper/formatDeckAsFullCards';

const DeckEditor = ({ deck: initial, cards, packs, onBackClick }) => {
    const deck = useMemo(() => formatDeckAsFullCards(initial, { cards }), [cards, initial]);
    const dispatch = useDispatch();
    const [addDeck, { isLoading: isAddLoading }] = useAddDeckMutation();
    const [saveDeck, { isLoading: isSaveLoading }] = useSaveDeckMutation();
    const { data: lockedEvent } = useGetEventQuery(deck.eventId, { skip: !deck.eventId });
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
    const [faction, setFaction] = useState(deck.faction?.value);
    const [showImportModal, setShowImportModal] = useState(false);
    const [pageNumber, setPageNumber] = useState(0);

    const [gameFormat, setGameFormat] = useState(deck.format ?? 'joust');
    const [gameVariant, setGameVariant] = useState(null);
    const [gameLegality, setGameLegality] = useState(null);
    const [gameLegalityObj, setGameLegalityObj] = useState(null);
    const [cardsByCode, setCardsByCode] = useState(cards);

    useEffect(() => {
        if (deck.pool && cards) {
            const poolCards = deck.pool
                ?.map((cardCount) => cardCount.card.code)
                .filter((code) => cards[code])
                .map((code) => [code, cards[code]]);
            const poolByCode = Object.fromEntries(poolCards);
            setCardsByCode(poolByCode);
        } else {
            setCardsByCode(cards);
        }
    }, [deck.pool, cards]);

    useEffect(() => {
        if (lockedEvent) {
            setGameFormat(lockedEvent.format);
            setGameVariant(lockedEvent.variant);
            setGameLegality(lockedEvent.legality);
        }
    }, [lockedEvent]);

    const convertToCardCodes = (cardList) => {
        return cardList?.map((cardQuantity) => ({
            cardcode: cardQuantity.card.code,
            count: cardQuantity.count
        }));
    };

    const deckToSave = useMemo(() => {
        if (!cardsByCode || !packs) {
            return null;
        }

        // we need the full card objects for deck validation
        const fullCardsDeck = {
            _id: deck._id,
            name: deckName,
            faction: Constants.Factions.find((f) => f.value === faction),
            agenda: undefined,
            bannerCards: [],
            plotCards: [],
            drawCards: [],
            pool: undefined,
            format: deck.format,
            variant: deck.variant
        };

        const agendas = deckCards.filter((dc) => dc.card.type === 'agenda').map((c) => c.card);

        const alliance = agendas.find((a) => a.code === Constants.CardCodes.Alliance);
        if (alliance) {
            fullCardsDeck.agenda = alliance;
            fullCardsDeck.bannerCards = agendas.filter((a) => a.code !== fullCardsDeck.agenda.code);
        } else {
            fullCardsDeck.agenda = agendas[0];
        }

        fullCardsDeck.plotCards = deckCards.filter((dc) => dc.card.type === 'plot');

        fullCardsDeck.drawCards = deckCards.filter(
            (dc) => dc.card.type !== 'plot' && dc.card.type !== 'agenda'
        );

        fullCardsDeck.pool = deck.pool?.map((pc) => ({ card: pc.card, count: pc.count }));

        // only card codes are saved in the db
        const saveDeck = {
            ...fullCardsDeck,
            agenda: fullCardsDeck.agenda?.code,
            bannerCards: fullCardsDeck.bannerCards.map((card) => card.code),
            plotCards: convertToCardCodes(fullCardsDeck.plotCards),
            drawCards: convertToCardCodes(fullCardsDeck.drawCards),
            pool: convertToCardCodes(fullCardsDeck.pool)
        };

        if (!saveDeck.status) {
            saveDeck.status = {};
        }

        saveDeck.status = validateDeck(fullCardsDeck, {
            packs: packs,
            format: gameFormat,
            variant: gameVariant,
            legality: gameLegalityObj
        });

        return saveDeck;
    }, [
        cardsByCode,
        packs,
        deck._id,
        deck.format,
        deck.variant,
        deck.pool,
        deckName,
        deckCards,
        gameFormat,
        gameVariant,
        gameLegalityObj,
        faction
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
                    <ThronesIcon icon={info.getValue()} color={info.row.original.faction} />
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
                cell: (info) => <ThronesIcon icon={info.getValue()} />,
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

                    // show the dropdown either on small screens or if the deck limit is larger than 3 (e.g. for draft cards)
                    const showDropdown = max > 4;
                    const dropdownClass = showDropdown ? '' : 'sm:hidden';
                    const buttonsClass = showDropdown ? 'hidden' : 'max-sm:hidden';

                    const setCardQuantity = (code, quantity) => {
                        const newDeckCards = [...deckCards];
                        const dcIndex = newDeckCards.findIndex(({ card }) => card.code === code);
                        if (dcIndex < 0 && quantity === 0) {
                            return;
                        }
                        if (dcIndex >= 0) {
                            if (quantity === 0) {
                                newDeckCards.splice(dcIndex, 1);
                            } else {
                                newDeckCards[dcIndex] = {
                                    ...newDeckCards[dcIndex],
                                    count: quantity
                                };
                            }
                        } else {
                            newDeckCards.push({ card: cardsByCode[code], count: quantity });
                        }
                        setDeckCards(newDeckCards);
                    };
                    return (
                        <>
                            <SelectField
                                className={dropdownClass}
                                aria-label='Quantity'
                                value={count.toString()}
                                onChange={(value) =>
                                    setCardQuantity(info.row.original.code, parseInt(value))
                                }
                                items={[...Array(max).keys()].map((digit) => ({
                                    id: digit.toString(),
                                    label: digit
                                }))}
                            />
                            <ButtonGroup className={buttonsClass}>
                                {[...Array(max).keys()].map((digit) => (
                                    <Button
                                        size='sm'
                                        isIconOnly
                                        key={digit}
                                        variant={count === digit ? 'primary' : 'tertiary'}
                                        onPress={() =>
                                            setCardQuantity(info.row.original.code, digit)
                                        }
                                    >
                                        {digit}
                                    </Button>
                                ))}
                            </ButtonGroup>
                        </>
                    );
                },
                meta: {
                    colWidth: '10%',
                    className: 'min-w-20'
                },
                enableColumnFilter: false
            }
        ],
        [deckCards, cardsByCode]
    );

    const cardsMemo = useMemo(() => {
        if (!cards) {
            return { data: [] };
        }
        if (deck.pool) {
            const poolCards = deck.pool.map((cardCount) => {
                // if working with a draft pool, deck limit should be equal to the number of drafted copies
                // plot deck limits still apply but may be limited by fewer copies being drafted
                return {
                    ...cards[cardCount.card.code],
                    deckLimit:
                        cards[cardCount.card.code].type === 'plot'
                            ? Math.min(cards[cardCount.card.code].deckLimit, cardCount.count)
                            : cardCount.count
                };
            });
            return { data: poolCards };
        }
        return { data: Object.values(cards) };
    }, [cards, deck.pool]);

    useEffect(() => {
        setFaction(deck.faction.value);
    }, [deck.faction?.value]);

    const onSaveClick = async (andClose, savingDeck = deckToSave) => {
        try {
            savingDeck._id
                ? await saveDeck(savingDeck).unwrap()
                : await addDeck(savingDeck).unwrap();

            toast.success(`Deck ${savingDeck._id ? 'saved' : 'added'} successfully.`);

            if (andClose) {
                dispatch(navigate('/decks'));
            }
            return true;
        } catch (err) {
            toast.error(
                `An error occured ${savingDeck._id ? 'saving' : 'adding'}  the deck. Please try again later`
            );
        }
        return false;
    };

    const isSaving = isAddLoading || isSaveLoading;
    const count = (cardList) => cardList.reduce((acc, card) => acc + card.count, 0);

    return (
        <Frame
            title={deckName || 'Untitled deck'}
            actions={
                <>
                    <Button onPress={() => onBackClick()} variant='tertiary'>
                        Back
                    </Button>
                    <Button
                        onPress={() => setShowImportModal(true)}
                        isDisabled={deck.locked}
                        variant='tertiary'
                    >
                        Import
                    </Button>
                    <Button
                        isPending={isSaving}
                        isDisabled={deck.locked}
                        onPress={() => onSaveClick(true)}
                        variant='tertiary'
                    >
                        Save and close
                    </Button>
                    <Button
                        isPending={isSaving}
                        isDisabled={deck.locked}
                        onPress={() => onSaveClick(false)}
                        variant='primary'
                    >
                        {isSaving && <Spinner color='current' size='sm' />}Save
                    </Button>
                </>
            }
        >
            <div className='grid grid-cols-1 gap-x-10 gap-y-8 xl:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]'>
                <div className='flex min-w-0 flex-col gap-4'>
                    <div className='grid grid-cols-1 gap-3 sm:grid-cols-[2fr_1fr]'>
                        <Field
                            placeholder='Enter a name'
                            value={deckName}
                            onValueChange={setDeckName}
                            label='Deck name'
                            isDisabled={deck.locked}
                        />
                        <FactionSelect
                            label='Faction'
                            selected={faction}
                            onSelected={setFaction}
                            disallowEmptySelection
                            isDisabled={deck.locked}
                        />
                    </div>
                    <div className='grid grid-cols-1 gap-3 sm:grid-cols-3'>
                        <FormatSelect
                            label='Format'
                            selected={gameFormat}
                            onSelected={setGameFormat}
                            isDisabled={!!deck.format || deck.locked}
                            disallowEmptySelection
                        />
                        <VariantSelect
                            label='Variant'
                            format={gameFormat}
                            selected={gameVariant}
                            onSelected={setGameVariant}
                            isDisabled={!!deck.variant || deck.locked}
                            disallowEmptySelection
                        />
                        <LegalitySelect
                            label='Legality'
                            format={gameFormat}
                            variant={gameVariant}
                            selected={gameLegality}
                            onSelected={(legality, legalityObj) => {
                                setGameLegality(legality);
                                setGameLegalityObj(legalityObj);
                            }}
                            isDisabled={deck.locked}
                        />
                    </div>
                    <div className='flex min-h-14 flex-wrap items-center gap-x-6 gap-y-2 border-y border-gold-hair py-3 text-sm text-ink-dim'>
                        {deckToSave ? (
                            <>
                                <span>
                                    Plots{' '}
                                    <span className='tabular-nums text-ink'>
                                        {count(deckToSave.plotCards)}
                                    </span>
                                </span>
                                <span>
                                    Draw deck{' '}
                                    <span className='tabular-nums text-ink'>
                                        {count(deckToSave.drawCards)}
                                    </span>
                                </span>
                                {!!deck.pool && (
                                    <span>
                                        Pool{' '}
                                        <span className='tabular-nums text-ink'>
                                            {count(deck.pool)}
                                        </span>
                                    </span>
                                )}
                                <span className='flex items-center gap-1 sm:ms-auto'>
                                    <DeckStatus deck={deckToSave} />
                                    <PoolInfo isPool={!!deck.pool} />
                                </span>
                            </>
                        ) : (
                            <LoadingSpinner />
                        )}
                    </div>
                    {!deck.locked ? (
                        <>
                            <div className='flex flex-wrap gap-2'>
                                <CardTypeFilter
                                    filter={typeFilter}
                                    setFilter={setTypeFilter}
                                    types={Constants.CardTypes.filter(
                                        ({ value }) => value !== 'title'
                                    )}
                                />
                                <FactionFilter
                                    filter={factionFilter}
                                    setFilter={setFactionFilter}
                                    factions={Constants.Factions.concat({
                                        name: 'Neutral',
                                        value: 'neutral'
                                    })}
                                />
                            </div>
                            <div className='h-[60vh] min-h-96'>
                                <ReactTable
                                    dataLoadFn={() => ({
                                        data: cardsMemo,
                                        isLoading: false,
                                        isError: false
                                    })}
                                    defaultColumnFilters={{
                                        type: typeFilter,
                                        faction: factionFilter
                                    }}
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
                                />
                            </div>
                        </>
                    ) : (
                        <Notice kind='warning' title='Deck locked'>
                            This deck has been used for{' '}
                            {lockedEvent ? <b>{lockedEvent.name}</b> : 'an event'}, so it can&apos;t
                            be edited or deleted.
                        </Notice>
                    )}
                </div>
                <DeckSummary
                    deck={{
                        name: deckName,
                        deckCards: deckCards,
                        poolCards: deck.pool ? cardsMemo.data : undefined,
                        faction: Constants.Factions.find((f) => f.value === faction)
                    }}
                />
            </div>
            <ImportDeckModal
                isOpen={showImportModal}
                onOpenChange={(open) => setShowImportModal(open)}
                submitLabel='Import and save'
                onProcessed={async (newDeck) => {
                    newDeck._id = deck._id;
                    const success = await onSaveClick(false, newDeck);
                    if (success) {
                        const formattedDeck = formatDeckAsFullCards(newDeck, { cards });
                        setFaction(formattedDeck.faction?.value);
                        setDeckName(formattedDeck.name);
                        setDeckCards(
                            (formattedDeck.agenda ? [{ card: formattedDeck.agenda, count: 1 }] : [])
                                .concat(formattedDeck.drawCards || [])
                                .concat(formattedDeck.plotCards || [])
                                .concat(
                                    formattedDeck.bannerCards?.map((bc) => ({
                                        card: bc,
                                        count: 1
                                    })) || []
                                )
                        );
                        deck.pool = formattedDeck.pool;
                        setShowImportModal(false);
                    }
                }}
                message={
                    <Notice kind='warning'>
                        Importing replaces everything in the deck you&apos;re editing.
                    </Notice>
                }
            />
        </Frame>
    );
};

export default DeckEditor;
