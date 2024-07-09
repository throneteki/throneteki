import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { validateDeck } from '../../../deck-helper';

import Input from '../Form/Input';
import Select from '../Form/Select';
import Typeahead from '../Form/Typeahead';
import TextArea from '../Form/TextArea';
import RestrictedListDropdown from './RestrictedListDropdown';
import { lookupCardByName } from './DeckParser';
import {
    useGetCardsQuery,
    useGetEventsQuery,
    useGetFactionsQuery,
    useGetPacksQuery,
    useGetRestrictedListQuery
} from '../../redux/middleware/api';
import DeckWrapper from '../../../deck-helper/DeckWrapper';
import { navigate } from '../../redux/reducers/navigation';

const isAllianceAgenda = (agenda) => {
    return agenda && agenda.code === '06018';
};

const formatCardListItem = (card) => {
    if (card.card.custom) {
        let typeCode = card.card.type;
        let typeName = typeCode[0].toUpperCase() + typeCode.slice(1);
        return card.count + ' Custom ' + typeName + ' - ' + card.card.name;
    }

    return card.count + ' ' + card.card.label;
};

const addCard = (list, card, number) => {
    if (list[card.code]) {
        list[card.code].count += number;
    } else {
        list.push({ count: number, card: card });
    }
};

const DeckEditor = ({ deck, onDeckUpdated, onDeckSave, isSaveLoading, onRestrictedListChange }) => {
    const dispatch = useDispatch();

    const { data: events, isLoading } = useGetEventsQuery();
    const { data: packs, isLoading: isPacksLoading } = useGetPacksQuery();
    const { data: factions, isLoading: isFactionsLoading } = useGetFactionsQuery();
    const { data: restrictedLists, isLoading: isRestrictedListLoading } =
        useGetRestrictedListQuery();
    const { data: cards, isLoading: isCardsLoading } = useGetCardsQuery();

    const [bannerCards, setBannerCards] = useState(deck?.bannerCards || []);
    const [cardList, setCardList] = useState('');
    const [deckName, setDeckName] = useState(deck?.name || 'New Deck');
    const [drawCards, setDrawCards] = useState(deck?.drawCards || []);
    const [faction, setFaction] = useState(deck?.faction || (factions && factions['baratheon']));
    const [numberToAdd, setNumberToAdd] = useState(1);
    const [plotCards, setPlotCards] = useState(deck?.plotCards || []);
    const [showBanners, setShowBanners] = useState(
        deck?.agenda ? isAllianceAgenda(deck?.agenda) : false
    );
    const [selectedBanner, setSelectedBanner] = useState({});
    const [cardToAdd, setCardToAdd] = useState();
    const [eventId, setEventId] = useState(deck?.eventId);
    const [deckId, _] = useState(deck?._id);
    const [agenda, setAgenda] = useState(deck?.agenda);
    const [currentRestrictedList, setCurrentRestrictedList] = useState(
        restrictedLists && restrictedLists[0]
    );

    useEffect(() => {
        onRestrictedListChange && onRestrictedListChange(currentRestrictedList);
    }, [currentRestrictedList, onRestrictedListChange]);

    const currentDeck = useMemo(() => {
        let retDeck = {
            _id: deckId,
            name: deckName,
            faction: faction,
            agenda: agenda,
            bannerCards: bannerCards,
            plotCards: plotCards,
            drawCards: drawCards,
            eventId: eventId,
            status: {}
        };

        const wrappedDeck = new DeckWrapper(retDeck);

        retDeck.plotCount = wrappedDeck.countPlotCards();
        retDeck.drawCount = wrappedDeck.countDrawCards();

        if ((!restrictedLists && !currentRestrictedList) || !packs) {
            retDeck.status = {};
        } else {
            for (const restrictedList of restrictedLists) {
                retDeck.status[restrictedList._id] = validateDeck(retDeck, {
                    packs: packs,
                    restrictedLists: [restrictedList]
                });
            }
        }

        return retDeck;
    }, [
        agenda,
        bannerCards,
        currentRestrictedList,
        deckId,
        deckName,
        drawCards,
        eventId,
        faction,
        packs,
        plotCards,
        restrictedLists
    ]);

    const agendas = useMemo(
        () =>
            (cards &&
                Object.values(cards).reduce((acc, card) => {
                    if (card.type === 'agenda') {
                        acc[card.code] = card;
                    }
                    return acc;
                }, {})) ||
            [],
        [cards]
    );

    const banners = useMemo(
        () =>
            cards &&
            Object.values(cards).filter((card) => {
                return card.traits.some((t) => t.toLowerCase() === 'banner');
            }),
        [cards]
    );

    useEffect(() => {
        if (!packs || !currentRestrictedList || !restrictedLists) {
            return;
        }

        onDeckUpdated && onDeckUpdated(currentDeck);
    }, [currentDeck, currentRestrictedList, onDeckUpdated, packs, restrictedLists]);

    const onRemoveBanner = useCallback(
        (banner) => {
            const banners = bannerCards.filter((card) => {
                return card.code !== banner.code;
            });

            setBannerCards(banners);
        },
        [bannerCards]
    );

    const onSaveClick = useCallback(
        (event) => {
            event.preventDefault();

            onDeckSave && onDeckSave(currentDeck);
        },
        [currentDeck, onDeckSave]
    );

    const onCancelClick = useCallback(() => {
        dispatch(navigate('/decks'));
    }, [dispatch]);

    const onAddBanner = useCallback(
        (event) => {
            event.preventDefault();

            if (!selectedBanner || !selectedBanner.code) {
                return;
            }

            // Don't allow more than 2 banners
            if (bannerCards.length >= 2) {
                return;
            }

            // Don't allow duplicate banners
            if (
                bannerCards.some((banner) => {
                    return banner.code === selectedBanner.code;
                })
            ) {
                return;
            }

            let banners = bannerCards;
            banners.push(selectedBanner);

            setBannerCards(banners);
        },
        [bannerCards, setBannerCards, selectedBanner]
    );

    const onAddCard = useCallback(
        (event) => {
            event.preventDefault();

            if (!cardToAdd || !cardToAdd.label) {
                return;
            }

            let newCardList = cardList;
            newCardList += `${numberToAdd}  ${cardToAdd.label}\n`;

            if (cardToAdd.type === 'plot') {
                let plots = [...plotCards];
                addCard(plots, cardToAdd, parseInt(numberToAdd));
                setPlotCards(plots);
            } else {
                let cards = [...drawCards];
                addCard(cards, cardToAdd, parseInt(numberToAdd));
                setDrawCards(cards);
            }

            setCardList(newCardList);
        },
        [cardToAdd, drawCards, numberToAdd, plotCards, cardList]
    );

    const parseCardLine = useCallback(
        (line) => {
            const pattern = /^(\d+)x?\s+(.+)$/;

            let match = line.trim().match(pattern);
            if (!match) {
                return { count: 0 };
            }

            let count = parseInt(match[1]);
            let card = lookupCardByName({
                cardName: match[2],
                cards: Object.values(cards),
                packs: packs
            });

            return { count: count, card: card };
        },
        [cards, packs]
    );

    const onAgendaChange = useCallback(
        (selectedAgenda) => {
            setAgenda(selectedAgenda);
            setShowBanners(isAllianceAgenda(selectedAgenda));
            if (!showBanners) {
                setBannerCards([]);
            }
        },
        [showBanners]
    );

    const onCardListChange = useCallback(
        (event) => {
            let split = event.target.value.split('\n');

            let headerMark = split.findIndex((line) => line.match(/^Packs:/));
            if (headerMark >= 0) {
                // ThronesDB-style deck header found
                // extract deck title, faction, agenda, and banners
                let header = split.slice(0, headerMark).filter((line) => line !== '');
                split = split.slice(headerMark);

                if (header.length >= 2) {
                    setDeckName(header[0]);

                    let newFaction = Object.values(factions).find(
                        (faction) => faction.name === header[1].trim()
                    );
                    if (newFaction) {
                        setFaction(newFaction);
                    }

                    header = header.slice(2);
                    if (header.length >= 1) {
                        let rawAgenda, rawBanners;

                        if (
                            header.some((line) => {
                                return line.trim() === 'Alliance';
                            })
                        ) {
                            rawAgenda = 'Alliance';
                            rawBanners = header.filter((line) => line.trim() !== 'Alliance');
                        } else {
                            rawAgenda = header[0].trim();
                        }

                        let newAgenda = lookupCardByName({
                            cardName: rawAgenda,
                            cards: Object.values(cards),
                            packs: packs
                        });
                        if (newAgenda) {
                            setAgenda(newAgenda);
                        }

                        if (rawBanners) {
                            let newBanners = [];
                            for (let rawBanner of rawBanners) {
                                let banner = lookupCardByName({
                                    cardName: rawBanner,
                                    cards: Object.values(cards),
                                    packs: packs
                                });

                                if (banner) {
                                    newBanners.push(banner);
                                }
                            }

                            setBannerCards(newBanners);
                        }
                    }
                }
            }

            const newPlotCards = [];
            const newDrawCards = [];

            for (const line of split) {
                let { card, count } = parseCardLine(line);
                if (card) {
                    addCard(card.type === 'plot' ? newPlotCards : newDrawCards, card, count);
                }
            }

            setCardList(event.target.value);
            setPlotCards(newPlotCards);
            setDrawCards(newDrawCards);
            setShowBanners(isAllianceAgenda(agenda));
        },
        [agenda, cards, factions, packs, parseCardLine]
    );

    useEffect(() => {
        if (deck) {
            let cardList = '';
            for (const card of deck.drawCards) {
                cardList += formatCardListItem(card) + '\n';
            }

            for (const plot of deck.plotCards) {
                cardList += formatCardListItem(plot) + '\n';
            }

            setCardList(cardList);
        }
    }, [deck]);

    useEffect(() => {
        if (factions && !faction) {
            setFaction(factions['baratheon']);
        }
    }, [faction, factions]);

    let bannersToRender = useMemo(() => {
        if (bannerCards.length === 0) {
            return null;
        }

        return bannerCards.map((card) => {
            return (
                <div key={card.code}>
                    <span key={card.code} className='card-link col-sm-10'>
                        {card.label}
                    </span>
                    <span
                        className='glyphicon glyphicon-remove icon-danger btn col-sm-1'
                        aria-hidden='true'
                        onClick={() => onRemoveBanner(card)}
                    />
                </div>
            );
        });
    }, [bannerCards, onRemoveBanner]);

    let lockedDecksEvents = useMemo(() => {
        return (events?.events || []).filter((e) => e.lockDecks);
    }, [events]);

    if (
        !factions ||
        !agendas ||
        !cards ||
        !restrictedLists ||
        isPacksLoading ||
        isFactionsLoading ||
        isLoading ||
        isRestrictedListLoading ||
        isCardsLoading ||
        !packs
    ) {
        return <div>Please wait while loading from the server...</div>;
    }

    const cardsExcludingAgendas = Object.values(cards).filter((card) => !agendas[card.code]);

    return (
        <div>
            <div className='form-group'>
                <div className='col-xs-12 deck-buttons'>
                    <span className='col-xs-2'>
                        <button type='submit' className='btn btn-primary' onClick={onSaveClick}>
                            Save {isSaveLoading && <span className='spinner button-spinner' />}
                        </button>
                    </span>
                    <button type='button' className='btn btn-primary' onClick={onCancelClick}>
                        Cancel
                    </button>
                </div>
            </div>

            <div className='form-group'>
                <RestrictedListDropdown
                    currentRestrictedList={currentRestrictedList}
                    onChange={(restrictedList) => {
                        setCurrentRestrictedList(restrictedList);
                        onRestrictedListChange && onRestrictedListChange(restrictedList);
                    }}
                    restrictedLists={restrictedLists}
                />
            </div>

            <h4>
                Either type the cards manually into the box below, add the cards one by one using
                the card box and autocomplete or for best results, copy and paste a decklist from{' '}
                <a href='http://thronesdb.com' target='_blank' rel='noreferrer'>
                    Thrones DB
                </a>{' '}
                into the box below.
            </h4>
            <form className='form form-horizontal'>
                <Input
                    name='deckName'
                    label='Deck Name'
                    labelClass='col-sm-3'
                    fieldClass='col-sm-9'
                    placeholder='Deck Name'
                    type='text'
                    onChange={(event) => setDeckName(event.target.value)}
                    value={deckName}
                />
                <Select
                    name='faction'
                    label='Faction'
                    labelClass='col-sm-3'
                    fieldClass='col-sm-9'
                    options={Object.values(factions)}
                    onChange={(selectedFaction) => {
                        setFaction(selectedFaction);
                    }}
                    value={faction ? faction.value : undefined}
                />
                <Select
                    name='agenda'
                    label='Agenda'
                    labelClass='col-sm-3'
                    fieldClass='col-sm-9'
                    options={Object.values(agendas)}
                    onChange={onAgendaChange}
                    value={agenda ? agenda.code : undefined}
                    valueKey='code'
                    nameKey='label'
                    blankOption={{ label: '- Select -', code: '' }}
                />

                {showBanners && (
                    <div>
                        <Select
                            name='banners'
                            label='Banners'
                            labelClass='col-sm-3'
                            fieldClass='col-sm-9'
                            options={banners}
                            onChange={(banner) => setSelectedBanner(banner)}
                            value={selectedBanner ? selectedBanner.code : undefined}
                            valueKey='code'
                            nameKey='label'
                            blankOption={{ label: '- Select -', code: '' }}
                            button={{ text: 'Add', onClick: onAddBanner }}
                        />
                        <div className='col-sm-9 col-sm-offset-3 banner-list'>
                            {bannersToRender}
                        </div>
                    </div>
                )}
                <Typeahead
                    label='Card'
                    labelClass={'col-sm-3 col-xs-2'}
                    fieldClass='col-sm-4 col-xs-5'
                    labelKey={'label'}
                    options={cardsExcludingAgendas}
                    onChange={(selectedCards) => setCardToAdd(selectedCards[0])}
                >
                    <Input
                        name='numcards'
                        type='text'
                        label='Num'
                        labelClass='col-xs-1 no-x-padding'
                        fieldClass='col-xs-2'
                        value={numberToAdd.toString()}
                        onChange={(event) => setNumberToAdd(event.target.value)}
                        noGroup
                    >
                        <div className='col-xs-1 no-x-padding'>
                            <div className='btn-group'>
                                <button className='btn btn-primary' onClick={onAddCard}>
                                    Add
                                </button>
                            </div>
                        </div>
                    </Input>
                </Typeahead>
                <TextArea
                    label='Cards'
                    labelClass='col-sm-3'
                    fieldClass='col-sm-9'
                    rows='10'
                    value={cardList}
                    onChange={onCardListChange}
                />
                {eventId && (
                    <h4>
                        Please be aware: Assigning this deck to an event will mean that you will be
                        unable to modify or delete this deck for the duration of the event!
                    </h4>
                )}
                {lockedDecksEvents.length > 0 && (
                    <Select
                        name='event'
                        label='Event'
                        labelClass='col-sm-3'
                        fieldClass='col-sm-9'
                        options={lockedDecksEvents}
                        onChange={(selectedEvent) =>
                            setEventId(selectedEvent ? selectedEvent._id : undefined)
                        }
                        value={eventId ? eventId : undefined}
                        valueKey='_id'
                        nameKey='name'
                        blankOption={{ label: '- Select -', name: '', value: undefined }}
                    />
                )}
                <div className='form-group'>
                    <div className='col-sm-offset-3 col-sm-8'>
                        <button type='submit' className='btn btn-primary' onClick={onSaveClick}>
                            Save {isSaveLoading && <span className='spinner button-spinner' />}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default DeckEditor;
