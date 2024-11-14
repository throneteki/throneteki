import React, { useCallback, useState } from 'react';

import { useDispatch } from 'react-redux';
import {
    useGetCardsQuery,
    useGetDraftCubeQuery,
    useGetPacksQuery,
    useSaveDraftCubeMutation
} from '../../redux/middleware/api';
import Panel from '../../Components/Site/Panel';
import { navigate } from '../../redux/reducers/navigation';
import { Input, Textarea } from '@nextui-org/react';
import LoadingSpinner from '../../Components/Site/LoadingSpinner';

const calculateMaxPacks = (rarities) => {
    const maxPacksPerRarity = rarities.map((rarity) => {
        if (rarity.numPerPack === 0) {
            return 0;
        }

        const totalCards = rarity.cards.reduce(
            (total, cardQuantity) => total + cardQuantity.count,
            0
        );

        return Math.floor(totalCards / rarity.numPerPack);
    });
    return Math.min(...maxPacksPerRarity);
};

const calculateTotalperPack = (rarities) => {
    return rarities.reduce((total, rarity) => total + rarity.numPerPack, 0);
};

const formatRaritiesText = ({ cards, rarities }) => {
    if (!cards || !rarities) {
        return '';
    }

    const allCards = Object.values(cards);
    const cardCodeToNameIndex = allCards.reduce((index, card) => {
        index[card.code] = card.label;
        return index;
    }, {});

    return rarities
        .map((rarity) => {
            const cards = rarity.cards.map(
                (cardQuantity) =>
                    `${cardQuantity.count}x ${cardCodeToNameIndex[cardQuantity.cardCode]}`
            );
            return `${rarity.name}: ${rarity.numPerPack}\n${cards.join('\n')}`;
        })
        .join('\n\n');
};

const formatStarterDeckText = ({ cards, starterDeck }) => {
    if (!cards || !starterDeck) {
        return '';
    }

    const allCards = Object.values(cards);
    const cardCodeToNameIndex = allCards.reduce((index, card) => {
        index[card.code] = card.label;
        return index;
    }, {});

    return starterDeck
        .map(
            (cardQuantity) => `${cardQuantity.count}x ${cardCodeToNameIndex[cardQuantity.cardCode]}`
        )
        .join('\n');
};

const DraftCubeEditor = ({ draftCubeId }) => {
    const {
        data: draftCube,
        isLoading,
        error
    } = useGetDraftCubeQuery(draftCubeId, { skip: !draftCubeId });
    const { data: cards, isLoading: isCardsLoading } = useGetCardsQuery();
    const { data: packs, isLoading: isPacksLoading } = useGetPacksQuery();
    const [saveDraftCube, { isLoading: isSaveLoading }] = useSaveDraftCubeMutation();

    const [rarities, setRarities] = useState(draftCube?.packDefinitions[0]?.rarities || []);
    const [name, setName] = useState(draftCube?.name || '');
    const [maxPacks, setMaxPacks] = useState(calculateMaxPacks(rarities));
    const [totalPerPack, setTotalPerPack] = useState(calculateTotalperPack(rarities));
    const [raritiesText, setRaritiesText] = useState(
        formatRaritiesText({ rarities: rarities, cards: cards })
    );
    const [starterDeck, setStarterDeck] = useState(draftCube?.starterDeck || []);
    const [starterDeckText, setStarterDeckText] = useState(
        formatStarterDeckText({
            starterDeck: draftCube?.starterDeck || [],
            cards: cards
        })
    );
    const dispatch = useDispatch();

    const getDraftCubeFromState = useCallback(() => {
        return {
            _id: draftCube._id,
            name: name,
            packDefinitions: [
                {
                    rarities: rarities
                }
            ],
            starterDeck: starterDeck
        };
    }, [draftCube?._id, name, rarities, starterDeck]);

    const handleSaveClick = useCallback(
        async (event) => {
            event.preventDefault();

            try {
                await saveDraftCube(getDraftCubeFromState()).unwrap();

                setTimeout(() => {}, 5000);
            } catch (err) {
                // Empty
            }
        },
        [getDraftCubeFromState, saveDraftCube]
    );

    const compareCardByReleaseDate = useCallback(
        (a, b) => {
            let packA = packs.find((pack) => pack.code === a.packCode);
            let packB = packs.find((pack) => pack.code === b.packCode);

            if (!packA.releaseDate && packB.releaseDate) {
                return 1;
            }

            if (!packB.releaseDate && packA.releaseDate) {
                return -1;
            }

            return new Date(packA.releaseDate) < new Date(packB.releaseDate) ? -1 : 1;
        },
        [packs]
    );

    const parseCardLine = useCallback(
        (line) => {
            const pattern = /^([^()]+)(\s+\((.+)\))?$/;

            let match = line.trim().match(pattern);
            if (!match) {
                return null;
            }

            let cardName = match[1].trim().toLowerCase();
            let packName = match[3] && match[3].trim().toLowerCase();
            let pack =
                packName &&
                packs.find(
                    (pack) =>
                        pack.code.toLowerCase() === packName || pack.name.toLowerCase() === packName
                );
            let cardsValues = Object.values(cards);

            let matchingCards = cardsValues.filter((card) => {
                if (pack) {
                    return pack.code === card.packCode && card.name.toLowerCase() === cardName;
                }

                return card.name.toLowerCase() === cardName;
            });

            matchingCards.sort((a, b) => compareCardByReleaseDate(a, b));

            return matchingCards[0];
        },
        [cards, compareCardByReleaseDate, packs]
    );

    const parseCardQuantityLine = useCallback(
        (line) => {
            const pattern = /^(\d+)x?\s+(.+)$/;

            let match = line.trim().match(pattern);
            if (!match) {
                return { count: 0 };
            }

            let count = parseInt(match[1]);
            let card = parseCardLine(match[2]);

            if (!card) {
                return { count: 0 };
            }

            return { count: count, cardCode: card.code };
        },
        [parseCardLine]
    );

    const handleRarityListChange = useCallback(
        (event) => {
            const raritySections = event.target.value.trim().split(/\n\n+/);
            const updatedRarities = [];

            for (const raritySection of raritySections) {
                const lines = raritySection.split('\n');
                if (lines.length === 0) {
                    continue;
                }

                const rarityDefinition = lines[0];

                if (!rarityDefinition.includes(':')) {
                    continue;
                }

                const rarity = {
                    name: rarityDefinition.split(':')[0].trim(),
                    numPerPack: parseInt(rarityDefinition.split(':')[1].trim()) || 0,
                    cards: []
                };
                for (const line of lines.slice(1)) {
                    const cardQuantity = parseCardQuantityLine(line);
                    if (cardQuantity.count > 0) {
                        rarity.cards.push(cardQuantity);
                    }
                }

                updatedRarities.push(rarity);
            }

            setMaxPacks(calculateMaxPacks(updatedRarities));
            setRarities(updatedRarities);
            setRaritiesText(event.target.value);
            setTotalPerPack(calculateTotalperPack(updatedRarities));
        },
        [parseCardQuantityLine]
    );

    const handleStarterDeckChange = (event) => {
        const cardLines = event.target.value.split(/\n+/);
        const updatedStarterDeck = [];

        for (const cardLine of cardLines) {
            const cardQuantity = parseCardQuantityLine(cardLine);
            if (cardQuantity.count > 0) {
                updatedStarterDeck.push(cardQuantity);
            }
        }

        setStarterDeck(updatedStarterDeck);
        setStarterDeckText(event.target.value);
    };

    if (isCardsLoading || isPacksLoading || isLoading) {
        return <LoadingSpinner label='Loading draft cube...' />;
    }

    return (
        <div>
            <Panel title='Draft cube editor'>
                <form className='form form-horizontal'>
                    <Input
                        name='name'
                        label='Cube Name'
                        labelClass='col-sm-3'
                        fieldClass='col-sm-9'
                        placeholder='Cube Name'
                        type='text'
                        onChange={(event) => setName(event.target.value)}
                        value={name}
                    />
                    <div className='form-group'>
                        <div className='control-label col-sm-3' />
                        <div className='col-sm-9'>
                            <strong>{`Max ${maxPacks} packs of ${totalPerPack} cards`}</strong>
                        </div>
                    </div>
                    <Textarea
                        label='Card Rarities'
                        labelClass='col-sm-3'
                        fieldClass='col-sm-9'
                        rows='10'
                        value={raritiesText}
                        onChange={handleRarityListChange}
                    />
                    <Textarea
                        label='Starter Deck'
                        labelClass='col-sm-3'
                        fieldClass='col-sm-9'
                        rows='10'
                        value={starterDeckText}
                        onChange={handleStarterDeckChange}
                    />

                    <div className='form-group'>
                        <div className='col-sm-offset-3 col-sm-8'>
                            <button
                                type='submit'
                                className='btn btn-primary'
                                onClick={handleSaveClick}
                            >
                                Save {isSaveLoading && <span className='spinner button-spinner' />}
                            </button>
                            <button
                                type='button'
                                className='btn btn-primary'
                                onClick={() => dispatch(navigate('/events'))}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </form>
            </Panel>
        </div>
    );
};

export default DraftCubeEditor;
