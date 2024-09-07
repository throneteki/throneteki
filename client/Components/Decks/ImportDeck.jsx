import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';

import { Button, Input, Spinner, Textarea } from '@nextui-org/react';
import Panel from '../Site/Panel';
import {
    useAddDeckMutation,
    useGetCardsQuery,
    useGetFactionsQuery,
    useGetPacksQuery
} from '../../redux/middleware/api';
import { lookupCardByName } from './DeckParser';
import AlertPanel from '../Site/AlertPanel';

const ImportDeck = () => {
    const [deckText, setDeckText] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const {
        data: factions,
        isLoading: isFactionsLoading,
        isError: isFactionsError
    } = useGetFactionsQuery({});
    const { data: cards, isLoading: isCardsLoading, isError: isCardsError } = useGetCardsQuery({});
    const { data: packs, isLoading: isPacksLoading, isError: isPacksError } = useGetPacksQuery({});
    const [addDeck, { isLoading: isAddLoading }] = useAddDeckMutation();

    const parseCardLine = (line) => {
        const pattern = /^(\d+)x?\s+(.+)$/;

        const match = line.trim().match(pattern);
        if (!match) {
            return { count: 0 };
        }

        const count = parseInt(match[1]);
        const card = lookupCardByName({
            cardName: match[2],
            cards: Object.values(cards),
            packs: packs
        });

        return { count: count, card: card };
    };

    const addCard = (list, card, number) => {
        const cardCode = parseInt(card.code);
        if (list[cardCode]) {
            list[cardCode].count += number;
        } else {
            list.push({ count: number, card: card });
        }
    };

    const processDeck = async () => {
        let split = deckText.split('\n');
        let deckName, faction, agenda, bannerCards;

        const headerMark = split.findIndex((line) => line.match(/^Packs:/));
        if (headerMark >= 0) {
            // ThronesDB-style deck header found
            // extract deck title, faction, agenda, and banners
            let header = split.slice(0, headerMark).filter((line) => line !== '');
            split = split.slice(headerMark);

            if (header.length >= 2) {
                deckName = header[0];

                const newFaction = Object.values(factions).find(
                    (faction) => faction.name === header[1].trim()
                );
                if (newFaction) {
                    faction = newFaction;
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

                    const newAgenda = lookupCardByName({
                        cardName: rawAgenda,
                        cards: Object.values(cards),
                        packs: packs
                    });
                    if (newAgenda) {
                        agenda = newAgenda;
                    }

                    if (rawBanners) {
                        const banners = [];
                        for (const rawBanner of rawBanners) {
                            const banner = lookupCardByName({
                                cardName: rawBanner,
                                cards: Object.values(cards),
                                packs: packs
                            });
                            if (banner) {
                                banners.push(banner);
                            }
                        }

                        bannerCards = banners;
                    }
                }
            }
        } else {
            setError('Invalid deck. Ensure you have exported a plain text deck from ThronesDb.');
        }

        const plotCards = [];
        const drawCards = [];

        for (const line of split) {
            const { card, count } = parseCardLine(line);
            if (card) {
                addCard(card.type === 'plot' ? plotCards : drawCards, card, count);
            }
        }

        if (!deckName) {
            return;
        }

        const deck = {
            name: deckName,
            faction: faction,
            agenda: agenda,
            bannerCards: bannerCards?.map((banner) => banner.code),
            plotCards: plotCards,
            drawCards: drawCards
        };

        try {
            await addDeck(deck).unwrap();
            setSuccess('Deck added successfully.');
        } catch (err) {
            setError(err.message || 'An error occured adding the deck. Please try again later.');
        }
    };

    let content;

    if (isFactionsLoading || isCardsLoading || isPacksLoading) {
        content = <Spinner text='Loading data, please wait...' />;
    } else if (isFactionsError || isCardsError || isPacksError) {
        <AlertPanel variant='danger'>
            {'An error occured loading the card data. Please try again later.'}
        </AlertPanel>;
    } else {
        content = (
            <form
                onSubmit={(event) => {
                    event.preventDefault();

                    setError('');

                    processDeck();
                }}
            >
                <div className='mb-3'>
                    <label>
                        Export your deck as plain text from{' '}
                        <a href='https://thronesdb.com' target='_blank' rel='noreferrer'>
                            ThronesDB
                        </a>{' '}
                        and paste it into this box
                    </label>
                    <Textarea minRows={20} value={deckText} onValueChange={setDeckText} />
                </div>

                <Button type='submit' color='primary' disabled={!deckText || isAddLoading}>
                    Submit &nbsp;
                    {isAddLoading && <FontAwesomeIcon icon={faCircleNotch} spin />}
                </Button>
            </form>
        );
    }

    return (
        <div className='container'>
            <Panel title={'Import Deck'}>
                {error && <AlertPanel variant='danger'>{error}</AlertPanel>}
                {success && <AlertPanel variant='success'>{success}</AlertPanel>}
                {content}
            </Panel>
        </div>
    );
};

export default ImportDeck;
