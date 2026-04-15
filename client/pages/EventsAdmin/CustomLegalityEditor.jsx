import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Panel from '../../Components/Site/Panel';
import {
    Autocomplete,
    AutocompleteItem,
    Button,
    Chip,
    Divider,
    Select,
    SelectItem
} from '@heroui/react';
import LoadingSpinner from '../../Components/Site/LoadingSpinner';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CardImage from '../../Components/Images/CardImage';
import {
    useGetCardsQuery,
    useGetPacksQuery,
    useGetRestrictedListQuery
} from '../../redux/middleware/api';
import ThronesIcon from '../../Components/GameBoard/ThronesIcon';
import CardHoverable from '../../Components/Images/CardHoverable';

const CustomLegalityEditor = ({ format, variant, legality: initial, setLegality }) => {
    const { data: restrictedLists, isLoading: isRLLoading } = useGetRestrictedListQuery();
    const { data: cards, isLoading: isCardsLoading } = useGetCardsQuery();
    const { data: packs, isLoading: isPacksLoading } = useGetPacksQuery();
    const allCards = useMemo(() => cards && Object.values(cards), [cards]);

    const [importSelect, setImportSelect] = useState();

    const [restricted, setRestricted] = useState(initial?.restricted ?? []);
    const [banned, setBanned] = useState(initial?.banned ?? []);
    const [pods, setPods] = useState(initial?.pods ?? []);
    const [draftPod, setDraftPod] = useState([]);

    const [cardToAdd, setCardToAdd] = useState();

    useEffect(() => {
        setLegality({
            name: 'Custom',
            restricted: initial?.restricted ?? [],
            banned: initial?.banned ?? [],
            pods: initial?.pods ?? []
        });
    }, [initial?.banned, initial?.pods, initial?.restricted, setLegality]);

    const setRestrictedAndSync = useCallback(
        (val) => {
            setRestricted(val);
            setLegality((prev) => ({ restricted: val, ...prev }));
        },
        [setLegality]
    );

    const setBannedAndSync = useCallback(
        (val) => {
            setBanned(val);
            setLegality((prev) => ({ banned: val, ...prev }));
        },
        [setLegality]
    );

    const setPodsAndSync = useCallback(
        (val) => {
            setPods(val);
            setLegality((prev) => ({ pods: val, ...prev }));
        },
        [setLegality]
    );

    const compareByFactionNameRelease = useCallback(
        (a, b) => {
            if (a.faction > b.faction) {
                return 1;
            } else if (a.faction < b.faction) {
                return -1;
            } else if (a.name > b.name) {
                return 1;
            } else if (a.name < b.name) {
                return -1;
            }
            if (!isPacksLoading) {
                const packA = packs.find((pack) => pack.code === a.packCode);
                const packB = packs.find((pack) => pack.code === b.packCode);

                if (!packA.releaseDate && packB.releaseDate) {
                    return 1;
                }

                if (!packB.releaseDate && packA.releaseDate) {
                    return -1;
                }

                return new Date(packA.releaseDate) < new Date(packB.releaseDate) ? -1 : 1;
            }
            return 0;
        },
        [isPacksLoading, packs]
    );

    const cardChipList = useCallback(
        (codes, onClose) =>
            allCards
                .filter((card) => codes.includes(card.code))
                .sort(compareByFactionNameRelease)
                .map((card, index) => (
                    <Chip
                        key={index}
                        startContent={<ThronesIcon icon={card.faction} />}
                        onClose={onClose ? () => onClose(card.code, index) : null}
                        radius='sm'
                        className='text-wrap h-auto mb-1'
                    >
                        <CardHoverable code={card.code}>{card.label}</CardHoverable>
                    </Chip>
                )),
        [allCards, compareByFactionNameRelease]
    );

    const officialLegalities = useMemo(
        () => restrictedLists?.filter((rl) => rl.format === format && rl.variant === variant),
        [format, restrictedLists, variant]
    );

    const importExisting = useCallback(() => {
        if (!importSelect) return;
        const existing = restrictedLists.find((rl) => rl._id === importSelect);
        if (!existing) return;
        setRestrictedAndSync(existing.restricted, existing.banned, existing.pods);
        setBannedAndSync(existing.banned, existing.restricted, existing.pods);
        setPodsAndSync(existing.pods, existing.restricted, existing.banned);
        setImportSelect(undefined);
    }, [importSelect, restrictedLists, setBannedAndSync, setPodsAndSync, setRestrictedAndSync]);

    const clearList = useCallback(() => {
        setRestrictedAndSync([], [], []);
        setBannedAndSync([], [], []);
        setPodsAndSync([], [], []);
    }, [setBannedAndSync, setPodsAndSync, setRestrictedAndSync]);

    const canImport = useMemo(
        () => banned.length === 0 && restricted.length === 0 && pods.length === 0,
        [banned.length, pods.length, restricted.length]
    );

    const canClear = useMemo(
        () => banned.length > 0 || restricted.length > 0 || pods.length > 0,
        [banned.length, pods.length, restricted.length]
    );

    return (
        <Panel title='Custom Legality List'>
            {isCardsLoading || isPacksLoading ? (
                <LoadingSpinner />
            ) : (
                <div className='flex flex-col gap-2'>
                    <div className='flex gap-2 items-center'>
                        <Select
                            label='Legality'
                            selectedKeys={importSelect ? [importSelect] : []}
                            onChange={(e) => setImportSelect(e.target.value)}
                            isDisabled={!canImport || officialLegalities?.length === 0}
                            className='max-w-64'
                            isLoading={isRLLoading}
                        >
                            {officialLegalities?.map((l) => {
                                const label = `${l.version}${l.active ? ' (Active)' : ''}`;
                                return (
                                    <SelectItem key={l._id} value={l._id} textValue={label}>
                                        <div className='flex flex-col'>
                                            <span className='text-md'>{label}</span>
                                            <span className='text-xs'>{l.issuer}</span>
                                        </div>
                                    </SelectItem>
                                );
                            })}
                        </Select>
                        <Button onPress={importExisting} isDisabled={!importSelect || !canImport}>
                            Import
                        </Button>
                        <Button onPress={clearList} isDisabled={!canClear}>
                            Clear
                        </Button>
                    </div>
                    <Divider />
                    <div className='flex flex-wrap gap-2 items-center'>
                        <Autocomplete
                            label='Select a card'
                            className='max-w-96'
                            onSelectionChange={(value) => setCardToAdd(value)}
                            value={cardToAdd}
                        >
                            {allCards.sort(compareByFactionNameRelease).map((card) => (
                                <AutocompleteItem
                                    key={card.code}
                                    value={card.code}
                                    startContent={<CardImage code={card.code} size='small' />}
                                >
                                    {card.label}
                                </AutocompleteItem>
                            ))}
                        </Autocomplete>
                        <div className='flex flex-wrap gap-2'>
                            <Button
                                startContent={<FontAwesomeIcon icon={faPlus} />}
                                isDisabled={!cardToAdd || banned.includes(cardToAdd)}
                                onPress={() => {
                                    if (cardToAdd) {
                                        setBannedAndSync(banned.concat(cardToAdd));
                                    }
                                }}
                            >
                                Add to Banned
                            </Button>
                            <Button
                                startContent={<FontAwesomeIcon icon={faPlus} />}
                                isDisabled={!cardToAdd || restricted.includes(cardToAdd)}
                                onPress={() => {
                                    if (cardToAdd) {
                                        setRestrictedAndSync(restricted.concat(cardToAdd));
                                    }
                                }}
                            >
                                Add to Restricted
                            </Button>
                            <Button
                                startContent={<FontAwesomeIcon icon={faPlus} />}
                                isDisabled={!cardToAdd || draftPod.includes(cardToAdd)}
                                onPress={() => {
                                    if (cardToAdd) {
                                        setDraftPod(draftPod.concat(cardToAdd));
                                    }
                                }}
                            >
                                {draftPod.length > 0 ? 'Add to Draft Pod' : 'Add new Pod'}
                            </Button>
                        </div>
                    </div>
                    {draftPod.length > 0 && (
                        <div className='flex flex-col gap-2 bg-default-50 p-2 rounded-lg'>
                            <h1 className='text-medium'>Draft Pod</h1>
                            <div className='flex flex-wrap gap-1'>
                                {cardChipList(draftPod, (code) =>
                                    setDraftPod(draftPod.filter((c) => c !== code))
                                )}
                            </div>
                            <Button
                                isDisabled={draftPod.length < 2}
                                startContent={<FontAwesomeIcon icon={faPlus} />}
                                onPress={() => {
                                    if (draftPod.length > 0) {
                                        const newPods = pods.concat({ cards: draftPod });
                                        setPodsAndSync(newPods);
                                        setDraftPod([]);
                                    }
                                }}
                            >
                                {`Add as Pod #${pods.length + 1}`}
                            </Button>
                        </div>
                    )}
                    {banned.length > 0 && (
                        <div className='flex flex-col gap-2 bg-default-50 p-2 rounded-lg'>
                            <h1 className='text-large'>Banned List</h1>
                            <div className='columns-2 md:columns-3 lg:columns-4 flex flex-col gap-x-1'>
                                {cardChipList(banned, (code) =>
                                    setBannedAndSync(banned.filter((c) => c !== code))
                                )}
                            </div>
                        </div>
                    )}
                    {restricted.length > 0 && (
                        <div className='flex flex-col gap-2 bg-default-50 p-2 rounded-lg'>
                            <h1 className='text-large'>Restricted List</h1>
                            <div className='columns-2 md:columns-3 lg:columns-4 gap-x-1'>
                                {cardChipList(restricted, (code) =>
                                    setRestrictedAndSync(restricted.filter((c) => c !== code))
                                )}
                            </div>
                        </div>
                    )}
                    {pods.length > 0 && (
                        <div className='flex flex-col gap-2 bg-default-50 p-2 rounded-lg'>
                            <h1 className='text-large'>Pod List</h1>
                            <div className='columns-2 md:columns-3 lg:columns-4 gap-x-1'>
                                {pods.map((pod, index) => (
                                    <Chip
                                        key={index}
                                        onClose={() => {
                                            const newPods = [...pods];
                                            newPods.splice(index, 1);
                                            setPodsAndSync(newPods);
                                        }}
                                        className='h-full rounded-xl bg-default-100 py-2 mb-1'
                                    >
                                        <h1 className='text-medium'>Pod #{index + 1}</h1>
                                        <div className='flex flex-col'>
                                            {cardChipList(pod.cards)}
                                        </div>
                                    </Chip>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </Panel>
    );
};

export default CustomLegalityEditor;
