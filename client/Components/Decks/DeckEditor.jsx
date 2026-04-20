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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock } from '@fortawesome/free-solid-svg-icons';

const SmallButton = extendVariants(Button, {
    variants: {
        size: {
            xs: 'px-2 min-w-8 h-8 text-small gap-unit-1 border'
        }
    }
});

const DeckEditor = ({ deck, cards, packs, onBackClick }) => {
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
            agenda: deck.agenda && cardsByCode[deck.agenda.code],
            bannerCards: [],
            plotCards: [],
            drawCards: [],
            pool: undefined,
            format: deck.format,
            variant: deck.variant
        };

        fullCardsDeck.bannerCards = deckCards
            .filter((dc) => dc.card.code !== deck.agenda?.code && dc.card.type === 'agenda')
            .map((c) => c.card);

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
        deck.agenda,
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
                            <Select
                                className={dropdownClass}
                                onChange={(e) =>
                                    setCardQuantity(
                                        info.row.original.code,
                                        parseInt(e.target.value)
                                    )
                                }
                                defaultSelectedKeys={['0']}
                                selectedKeys={[count.toString()]}
                                classNames={{ trigger: 'h-8 min-h-8' }}
                                aria-label='Qty'
                            >
                                {[...Array(max).keys()].map((digit) => (
                                    <SelectItem key={digit.toString()} textValue={digit.toString()}>
                                        {digit}
                                    </SelectItem>
                                ))}
                            </Select>
                            <ButtonGroup className={buttonsClass}>
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

    return (
        <div className='flex flex-col gap-3'>
            <div className='flex flex-wrap gap-2'>
                <Button color='default' onPress={() => onBackClick()}>
                    Back
                </Button>
                <Button
                    color='primary'
                    isLoading={isAddLoading || isSaveLoading}
                    isDisabled={deck.locked}
                    onPress={() => onSaveClick(true)}
                >
                    Save & Close
                </Button>
                <Button
                    color='primary'
                    isLoading={isAddLoading || isSaveLoading}
                    isDisabled={deck.locked}
                    onPress={() => onSaveClick(false)}
                >
                    Save
                </Button>
                <Button onPress={() => setShowImportModal(true)} isDisabled={deck.locked}>
                    Import
                </Button>
            </div>
            <div className='columns-1 xl:columns-2 gap-4'>
                <div className='flex flex-col gap-2 break-inside-avoid'>
                    <div className='flex gap-2'>
                        <Input
                            className='md:basis-2/3'
                            placeholder='Enter a name'
                            value={deckName}
                            onValueChange={setDeckName}
                            label='Deck Name'
                            isDisabled={deck.locked}
                        />
                        <FactionSelect
                            className='md:basis-1/3'
                            label='Faction'
                            selected={faction}
                            onSelected={setFaction}
                            disallowEmptySelection
                            isDisabled={deck.locked}
                        />
                    </div>
                    <div className='flex flex-col md:flex-row gap-2'>
                        <FormatSelect
                            label='Format'
                            selected={gameFormat}
                            onSelected={setGameFormat}
                            isDisabled={!!deck.format || deck.locked}
                            disallowEmptySelection
                            className='md:basis-1/3'
                        />
                        <VariantSelect
                            label='Variant'
                            format={gameFormat}
                            selected={gameVariant}
                            onSelected={setGameVariant}
                            isDisabled={!!deck.variant || deck.locked}
                            disallowEmptySelection
                            className='md:basis-1/3'
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
                            className='md:basis-1/3'
                        />
                    </div>
                    <Card>
                        {deckToSave ? (
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
                                    <DeckStatus deck={deckToSave} />
                                    <PoolInfo isPool={!!deck.pool} />
                                </div>
                            </CardBody>
                        ) : (
                            <LoadingSpinner />
                        )}
                    </Card>
                    {!deck.locked ? (
                        <>
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
                                factions={Constants.Factions.concat({
                                    name: 'Neutral',
                                    value: 'neutral'
                                })}
                            />
                            <div className='min-h-96 h-[50vh]'>
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
                                    classNames={{
                                        td: 'max-sm:px-2',
                                        th: 'max-sm:px-2'
                                    }}
                                />
                            </div>
                        </>
                    ) : (
                        <AlertPanel
                            variant='warning'
                            title={
                                <span>
                                    <FontAwesomeIcon icon={faLock} /> Deck Locked
                                </span>
                            }
                            size='md'
                        >
                            This deck has been used/locked for{' '}
                            {lockedEvent ? <b>{lockedEvent.name}</b> : 'an event'}, and cannot be
                            edited or deleted.
                        </AlertPanel>
                    )}
                </div>
                <DeckSummary
                    className='break-inside-avoid'
                    deck={{
                        name: deckName,
                        deckCards: deckCards,
                        poolCards: deck.pool ? cardsMemo.data : undefined,
                        faction: Constants.Factions.find((f) => f.value === faction)
                    }}
                />

                <ImportDeckModal
                    isOpen={showImportModal}
                    onOpenChange={(open) => setShowImportModal(open)}
                    submitLabel='Submit & Save'
                    onProcessed={async (newDeck) => {
                        newDeck._id = deck._id;
                        const success = await onSaveClick(false, newDeck);
                        if (success) {
                            setFaction(newDeck.faction?.value);
                            setDeckName(newDeck.name);
                            setDeckCards(
                                (newDeck.agenda ? [{ card: newDeck.agenda, count: 1 }] : [])
                                    .concat(newDeck.drawCards || [])
                                    .concat(newDeck.plotCards || [])
                                    .concat(
                                        newDeck.bannerCards?.map((bc) => ({
                                            card: bc,
                                            count: 1
                                        })) || []
                                    )
                            );
                            deck.pool = newDeck.pool;
                            setShowImportModal(false);
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
