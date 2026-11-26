import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button } from '@heroui/react';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import ComboField from '../../Components/Site/ComboField';
import Group from '../../Components/Site/Group';
import LoadingSpinner from '../../Components/Site/LoadingSpinner';
import SelectField from '../../Components/Site/SelectField';
import CardImage from '../../Components/Images/CardImage';
import CardHoverable from '../../Components/Images/CardHoverable';
import ThronesIcon from '../../Components/GameBoard/ThronesIcon';
import {
    useGetCardsQuery,
    useGetPacksQuery,
    useGetRestrictedListQuery
} from '../../redux/middleware/api';

const emptyList = { restricted: [], banned: [], pods: [] };

const CardRow = ({ card, onRemove }) => (
    <li className='flex items-center gap-2 border-b border-gold-hair py-1.5 text-sm text-ink'>
        <ThronesIcon icon={card.faction} className='shrink-0 text-ink-dim' />
        <CardHoverable code={card.code} className='min-w-0 flex-1 truncate'>
            {card.label}
        </CardHoverable>
        {onRemove && (
            <button
                type='button'
                aria-label={`Remove ${card.label}`}
                onClick={onRemove}
                className='flex size-6 shrink-0 items-center justify-center text-ink-faint hover:text-danger'
            >
                <FontAwesomeIcon icon={faXmark} />
            </button>
        )}
    </li>
);

const ListColumn = ({ title, count, empty, children }) => (
    <div className='flex min-w-0 flex-col'>
        <h4 className='flex items-baseline gap-2 border-b border-gold-line pb-1.5 text-sm font-semibold text-ink'>
            {title}
            <span className='text-xs font-normal text-ink-faint'>{count}</span>
        </h4>
        {count === 0 ? <p className='py-2 text-sm text-ink-faint'>{empty}</p> : children}
    </div>
);

const CustomLegalityEditor = ({ format, variant, legality, setLegality }) => {
    const { data: restrictedLists, isLoading: isRLLoading } = useGetRestrictedListQuery();
    const { data: cards, isLoading: isCardsLoading } = useGetCardsQuery();
    const { data: packs, isLoading: isPacksLoading } = useGetPacksQuery();

    const [list, setList] = useState(() => ({
        restricted: legality?.restricted ?? [],
        banned: legality?.banned ?? [],
        pods: legality?.pods ?? []
    }));
    const [importSelect, setImportSelect] = useState();
    const [cardToAdd, setCardToAdd] = useState();
    const [draftPod, setDraftPod] = useState([]);

    useEffect(() => {
        setLegality({ name: 'Custom', ...list });
    }, [list, setLegality]);

    const releaseDate = useCallback(
        (card) => packs?.find((pack) => pack.code === card.packCode)?.releaseDate,
        [packs]
    );

    const sortedCards = useMemo(() => {
        if (!cards) {
            return [];
        }

        return Object.values(cards).sort((a, b) => {
            if (a.faction !== b.faction) {
                return a.faction > b.faction ? 1 : -1;
            }

            if (a.name !== b.name) {
                return a.name > b.name ? 1 : -1;
            }

            const dateA = releaseDate(a);
            const dateB = releaseDate(b);
            if (!dateA || !dateB) {
                return dateA ? -1 : dateB ? 1 : 0;
            }

            return new Date(dateA) - new Date(dateB);
        });
    }, [cards, releaseDate]);

    const cardsFor = useCallback(
        (codes) => sortedCards.filter((card) => codes.includes(card.code)),
        [sortedCards]
    );

    const cardItems = useMemo(
        () =>
            sortedCards.map((card) => ({
                id: card.code,
                label: card.label,
                content: (
                    <span className='flex items-center gap-2'>
                        <CardImage code={card.code} size='small' />
                        {card.label}
                    </span>
                )
            })),
        [sortedCards]
    );

    const officialLegalities = useMemo(
        () => restrictedLists?.filter((rl) => rl.format === format && rl.variant === variant),
        [format, restrictedLists, variant]
    );

    const isEmpty = list.banned.length === 0 && list.restricted.length === 0 && !list.pods.length;

    const importExisting = () => {
        const existing = restrictedLists?.find((rl) => rl._id === importSelect);
        if (!existing) {
            return;
        }

        setList({
            restricted: existing.restricted ?? [],
            banned: existing.banned ?? [],
            pods: existing.pods ?? []
        });
        setImportSelect(undefined);
    };

    const addTo = (key) =>
        setList((current) => ({ ...current, [key]: [...current[key], cardToAdd] }));
    const removeFrom = (key, code) =>
        setList((current) => ({ ...current, [key]: current[key].filter((c) => c !== code) }));

    if (isCardsLoading || isPacksLoading) {
        return (
            <Group title='Card list'>
                <LoadingSpinner className='py-6' />
            </Group>
        );
    }

    return (
        <Group
            title='Card list'
            description='Which cards are banned or restricted in this event. Start from an official list, then change it.'
        >
            <div className='flex flex-col gap-5'>
                <div className='flex flex-wrap items-end gap-2'>
                    <SelectField
                        label='Start from'
                        placeholder={isEmpty ? 'Choose a list' : 'Clear the list first'}
                        value={importSelect || null}
                        onChange={setImportSelect}
                        isDisabled={isRLLoading || !isEmpty || !officialLegalities?.length}
                        className='w-full sm:w-64'
                        items={(officialLegalities || []).map((l) => {
                            const label = `${l.version}${l.active ? ' (current)' : ''}`;
                            return {
                                id: l._id,
                                label,
                                content: (
                                    <div className='flex flex-col'>
                                        <span className='text-base'>{label}</span>
                                        <span className='text-xs'>{l.issuer}</span>
                                    </div>
                                )
                            };
                        })}
                    />
                    <Button
                        variant='tertiary'
                        onPress={importExisting}
                        isDisabled={!importSelect || !isEmpty}
                    >
                        Copy list
                    </Button>
                    <Button
                        variant='ghost'
                        className='text-danger sm:ms-auto'
                        onPress={() => setList(emptyList)}
                        isDisabled={isEmpty}
                    >
                        Clear all
                    </Button>
                </div>

                <div className='flex flex-wrap items-end gap-2'>
                    <ComboField
                        label='Card'
                        placeholder='Type a card name'
                        className='w-full sm:w-96'
                        selectedKey={cardToAdd}
                        onSelectionChange={setCardToAdd}
                        items={cardItems}
                    />
                    <Button
                        variant='tertiary'
                        isDisabled={!cardToAdd || list.banned.includes(cardToAdd)}
                        onPress={() => addTo('banned')}
                    >
                        Ban
                    </Button>
                    <Button
                        variant='tertiary'
                        isDisabled={!cardToAdd || list.restricted.includes(cardToAdd)}
                        onPress={() => addTo('restricted')}
                    >
                        Restrict
                    </Button>
                    <Button
                        variant='tertiary'
                        isDisabled={!cardToAdd || draftPod.includes(cardToAdd)}
                        onPress={() => setDraftPod(draftPod.concat(cardToAdd))}
                    >
                        Add to new pod
                    </Button>
                </div>

                {draftPod.length > 0 && (
                    <div className='border border-dashed border-gold-line px-4 py-3'>
                        <div className='flex flex-wrap items-center gap-2'>
                            <h4 className='text-sm font-semibold text-ink'>
                                New pod {list.pods.length + 1}
                            </h4>
                            <span className='text-xs text-ink-faint'>
                                A deck can include only one card from a pod. Add at least two.
                            </span>
                            <div className='ms-auto flex gap-1'>
                                <Button
                                    size='sm'
                                    variant='tertiary'
                                    onPress={() => setDraftPod([])}
                                >
                                    Discard
                                </Button>
                                <Button
                                    size='sm'
                                    variant='primary'
                                    isDisabled={draftPod.length < 2}
                                    onPress={() => {
                                        setList((current) => ({
                                            ...current,
                                            pods: [...current.pods, { cards: draftPod }]
                                        }));
                                        setDraftPod([]);
                                    }}
                                >
                                    Save pod
                                </Button>
                            </div>
                        </div>
                        <ul className='mt-2'>
                            {cardsFor(draftPod).map((card) => (
                                <CardRow
                                    key={card.code}
                                    card={card}
                                    onRemove={() =>
                                        setDraftPod(draftPod.filter((c) => c !== card.code))
                                    }
                                />
                            ))}
                        </ul>
                    </div>
                )}

                <div className='grid grid-cols-1 gap-x-8 gap-y-5 md:grid-cols-3'>
                    <ListColumn title='Banned' count={list.banned.length} empty='No banned cards.'>
                        <ul>
                            {cardsFor(list.banned).map((card) => (
                                <CardRow
                                    key={card.code}
                                    card={card}
                                    onRemove={() => removeFrom('banned', card.code)}
                                />
                            ))}
                        </ul>
                    </ListColumn>
                    <ListColumn
                        title='Restricted'
                        count={list.restricted.length}
                        empty='No restricted cards.'
                    >
                        <ul>
                            {cardsFor(list.restricted).map((card) => (
                                <CardRow
                                    key={card.code}
                                    card={card}
                                    onRemove={() => removeFrom('restricted', card.code)}
                                />
                            ))}
                        </ul>
                    </ListColumn>
                    <ListColumn title='Pods' count={list.pods.length} empty='No pods.'>
                        <div className='flex flex-col gap-3 pt-2'>
                            {list.pods.map((pod, index) => (
                                <div key={index}>
                                    <div className='flex items-center justify-between text-xs text-ink-faint'>
                                        <span>
                                            Pod {index + 1}
                                            {pod.restricted &&
                                                `, not with ${cards?.[pod.restricted]?.label ?? pod.restricted}`}
                                        </span>
                                        <button
                                            type='button'
                                            className='text-ink-faint hover:text-danger'
                                            onClick={() =>
                                                setList((current) => ({
                                                    ...current,
                                                    pods: current.pods.filter((_, i) => i !== index)
                                                }))
                                            }
                                        >
                                            Remove
                                        </button>
                                    </div>
                                    <ul>
                                        {cardsFor(pod.cards).map((card) => (
                                            <CardRow key={card.code} card={card} />
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </ListColumn>
                </div>
            </div>
        </Group>
    );
};

export default CustomLegalityEditor;
