import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { useDispatch } from 'react-redux';
import {
    useGetCardsQuery,
    useGetDraftCubesQuery,
    useGetEventQuery,
    useGetPacksQuery,
    useGetRestrictedListQuery,
    useSaveEventMutation
} from '../../redux/middleware/api';
import Panel from '../../Components/Site/Panel';
import AlertPanel from '../../Components/Site/AlertPanel';
import { navigate } from '../../redux/reducers/navigation';
import {
    Autocomplete,
    AutocompleteItem,
    Button,
    Chip,
    Input,
    Select,
    SelectItem,
    Switch,
    Textarea
} from '@heroui/react';
import { toast } from 'react-toastify';
import LoadingSpinner from '../../Components/Site/LoadingSpinner';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CardImage from '../../Components/Images/CardImage';
import { Constants } from '../../constants';
import CardHover from '../../Components/Images/CardHover';

const formatListTextForUsers = (users) => {
    if (!users) {
        return '';
    }

    return users.map((user) => `${user}\n`).join('');
};

const EventEditor = ({ eventId }) => {
    const { data: cards, isLoading: isCardsLoading } = useGetCardsQuery();
    const { data: restrictedLists, isLoading: isRestrictedListsLoading } =
        useGetRestrictedListQuery();
    const { data: packs, isLoading: isPacksLoading } = useGetPacksQuery();
    const [saveEvent, { isLoading: isSaveLoading }] = useSaveEventMutation();
    const { data: draftCubes, isLoading: isDraftCubesLoading } = useGetDraftCubesQuery();
    const { data: event, isLoading, error } = useGetEventQuery(eventId, { skip: !eventId });

    const allCards = useMemo(() => cards && Object.values(cards), [cards]);

    const [name, setName] = useState(event?.name);
    const [format, setFormat] = useState(event?.format || 'standard');
    const [restrictedList, setRestrictedList] = useState(event?.format || 'standard');

    const [restricted, setRestricted] = useState(event?.restricted || []);
    const [banned, setBanned] = useState(event?.banned || []);
    const [pods, setPods] = useState(event?.pods || []);
    const [draftPod, setDraftPod] = useState([]);

    const [lockDecks, setLockDecks] = useState(!!event?.lockDecks);
    const [useEventGameOptions, setUseEventGameOptions] = useState(!!event?.useEventGameOptions);
    const [spectators, setSpectators] = useState();
    const [muteSpectators, setMuteSpectators] = useState();
    const [showHand, setShowHand] = useState();
    const [useGameTimeLimit, setUseGameTimeLimit] = useState();
    const [useChessClocks, setUseChessClocks] = useState();
    const [gameTimeLimit, setGameTimeLimit] = useState();
    const [chessClockTimeLimit, setChessClockTimeLimit] = useState();
    const [chessClockDelay, setChessClockDelay] = useState();
    const [password, setPassword] = useState();
    const [restrictTableCreators, setRestrictTableCreators] = useState(
        !!event?.restrictTableCreators
    );
    const [validTableCreators, setValidTableCreators] = useState(event?.validTableCreators || []);
    const [validTableCreatorsText, setValidTableCreatorsText] = useState(
        formatListTextForUsers(event?.validTableCreators)
    );
    const [restrictSpectators, setRestrictSpectators] = useState(!!event?.restrictSpectators);
    const [validSpectators, setValidSpectators] = useState(event?.validSpectators || []);
    const [validSpectatorsText, setValidSpectatorsText] = useState(
        formatListTextForUsers(event?.validSpectators)
    );
    const [cardToAdd, setCardToAdd] = useState();
    const [draftCubeId, setDraftCubeId] = useState(event?.draftOptions?.draftCubeId);
    const [numOfRounds, setNumOfRounds] = useState(event?.draftOptions?.numOfRounds || 3);

    const dispatch = useDispatch();

    const formats = [
        { name: 'Standard', value: 'standard' },
        { name: 'Valyrian', value: 'valyrian' },
        { name: 'Draft', value: 'draft' },
        { name: 'Custom Joust', value: 'custom-joust' }
    ];
    const formatRestrictedLists = useMemo(() => {
        let cardSet = null;
        if (format === 'standard') {
            cardSet = 'redesign';
        } else if (format === 'valyrian') {
            cardSet = 'original';
        }
        if (restrictedLists && cardSet) {
            return restrictedLists.filter((rl) => rl.official && rl.cardSet === cardSet);
        }
        return null;
    }, [restrictedLists, format]);

    const onUseGameTimeLimitClick = useCallback((event) => {
        setUseGameTimeLimit(event.target.checked);
    }, []);

    const onUseChessClocksClick = useCallback((event) => {
        setUseChessClocks(event.target.checked);
    }, []);

    const getUsernameList = useCallback((event) => {
        let split = event.target.value.split('\n');
        const userNames = [];

        for (const line of split) {
            const userName = line;
            if (userName) {
                userNames.push(userName);
            }
        }

        return userNames;
    }, []);

    const getEventFromState = useCallback(() => {
        return {
            _id: eventId,
            name: name,
            draftOptions: {
                draftCubeId,
                numOfRounds
            },
            format: format,
            useDefaultRestrictedList: ['standard', 'valyrian'].includes(format),
            defaultRestrictedList: restrictedList,
            useEventGameOptions: useEventGameOptions,
            eventGameOptions: {
                spectators,
                muteSpectators,
                showHand,
                useGameTimeLimit,
                gameTimeLimit,
                useChessClocks,
                chessClockTimeLimit,
                chessClockDelay,
                password
            },
            restricted: restricted,
            banned: banned,
            ...(pods.length > 0 && { pods }),
            restrictSpectators: restrictSpectators,
            restrictTableCreators: restrictTableCreators,
            validSpectators: validSpectators,
            lockDecks: lockDecks,
            validTableCreators: validTableCreators
        };
    }, [
        eventId,
        name,
        draftCubeId,
        numOfRounds,
        format,
        restrictedList,
        useEventGameOptions,
        spectators,
        muteSpectators,
        showHand,
        useGameTimeLimit,
        gameTimeLimit,
        useChessClocks,
        chessClockTimeLimit,
        chessClockDelay,
        password,
        restricted,
        banned,
        pods,
        restrictSpectators,
        restrictTableCreators,
        validSpectators,
        lockDecks,
        validTableCreators
    ]);

    const handleSaveClick = useCallback(async () => {
        try {
            await saveEvent(getEventFromState()).unwrap();

            toast.success('Event saved successfully');
        } catch (err) {
            toast.error('Error saving event');
        }
    }, [getEventFromState, saveEvent]);

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

    useEffect(() => {
        if (!event) {
            return;
        }

        setName(event.name);
        setFormat(event.format);
        setLockDecks(event.lockDecks);
        setUseEventGameOptions(event.useEventGameOptions);
        if (event.useEventGameOptions) {
            setSpectators(event.eventGameOptions.spectators);
            setMuteSpectators(event.eventGameOptions.muteSpectators);
            setUseGameTimeLimit(event.eventGameOptions.useGameTimeLimit);
            setGameTimeLimit(event.eventGameOptions.gameTimeLimit);
            setShowHand(event.eventGameOptions.showHand);
            setUseChessClocks(event.eventGameOptions.useChessClocks);
            setChessClockTimeLimit(event.eventGameOptions.chessClockTimeLimit);
            setChessClockDelay(event.eventGameOptions.chessClockDelay);
            setPassword(event.eventGameOptions.password);
        }
        setRestrictSpectators(event.restrictSpectators);
        setRestrictTableCreators(event.restrictTableCreators);

        setValidTableCreators(event.validTableCreators || []);
        setValidTableCreatorsText(formatListTextForUsers(event.validTableCreators || []));

        setValidSpectators(event.validSpectators || []);
        setValidSpectatorsText(formatListTextForUsers(event.validSpectators || []));
    }, [event]);

    const cardChipList = useCallback(
        (codes, onClose) =>
            allCards
                .filter((card) => codes.includes(card.code))
                .sort(compareByFactionNameRelease)
                .map((card, index) => (
                    <Chip
                        key={index}
                        startContent={
                            <span
                                className={`icon icon-${card.faction} ${Constants.FactionColorMaps[card.faction]}`}
                            ></span>
                        }
                        onClose={onClose ? () => onClose(card.code, index) : null}
                    >
                        <CardHover code={card.code}>{card.label}</CardHover>
                    </Chip>
                )),
        [allCards, compareByFactionNameRelease]
    );

    if (isLoading || isRestrictedListsLoading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return (
            <AlertPanel
                variant='danger'
                message={error.data?.message || 'An error occurred loading the event'}
            />
        );
    }

    return (
        <div className='m-2 lg:mx-auto lg:w-4/5'>
            <Panel title='Event Editor'>
                <form className='flex gap-2 flex-col'>
                    <Panel title='Event Details'>
                        <div className='flex gap-2 flex-col'>
                            <div className='flex flex-col md:flex-row gap-2'>
                                <Input
                                    name='name'
                                    label='Event Name'
                                    placeholder='Event Name'
                                    type='text'
                                    onChange={(event) => setName(event.target.value)}
                                    value={name}
                                />
                                <Select
                                    label='Format'
                                    items={formats}
                                    selectedKeys={[format]}
                                    onChange={(e) => setFormat(e.target.value)}
                                >
                                    {formats?.map((format) => (
                                        <SelectItem key={format.value} value={format.value}>
                                            {format.name}
                                        </SelectItem>
                                    ))}
                                </Select>
                                {formatRestrictedLists && (
                                    <Select
                                        label='Restricted List'
                                        items={formatRestrictedLists}
                                        selectedKeys={[restrictedList]}
                                        onChange={(e) => setRestrictedList(e.target.value)}
                                    >
                                        {formatRestrictedLists?.map((rl) => (
                                            <SelectItem key={rl._id} value={rl._id}>
                                                {rl.name}
                                            </SelectItem>
                                        ))}
                                    </Select>
                                )}
                            </div>
                            <Switch
                                name='lockDecks'
                                onChange={(event) => setLockDecks(event.target.checked)}
                                isSelected={lockDecks}
                            >
                                Prevent users from making changes to their decks for the duration of
                                the event
                            </Switch>
                            <Switch
                                name='useEventGameOptions'
                                onChange={(event) => setUseEventGameOptions(event.target.checked)}
                                isSelected={useEventGameOptions}
                            >
                                Use event game options
                            </Switch>
                        </div>
                    </Panel>
                    {useEventGameOptions && (
                        <Panel title='Event Game Options'>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
                                <div>
                                    <Switch
                                        name='spectators'
                                        onChange={(event) => setSpectators(event.target.checked)}
                                        isSelected={spectators}
                                    >
                                        Allow spectators
                                    </Switch>
                                    {spectators && (
                                        <div className='flex flex-col gap-2 border-l-1 pl-2 pt-2 border-default-200'>
                                            <Switch
                                                name='muteSpectators'
                                                onChange={(event) =>
                                                    setMuteSpectators(event.target.checked)
                                                }
                                                isSelected={muteSpectators}
                                            >
                                                Mute spectators
                                            </Switch>
                                            <Switch
                                                name='showHand'
                                                onChange={(event) =>
                                                    setShowHand(event.target.checked)
                                                }
                                                isSelected={showHand}
                                            >
                                                Show hands to spectators
                                            </Switch>
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <Switch
                                        name='useGameTimeLimit'
                                        onChange={onUseGameTimeLimitClick}
                                        isSelected={useGameTimeLimit}
                                    >
                                        Use game time limit
                                    </Switch>
                                    {useGameTimeLimit && (
                                        <div className='border-l-1 pl-2 pt-2 border-default-200'>
                                            <Input
                                                name='gameTimeLimit'
                                                label='Limit (minutes)'
                                                type='number'
                                                onChange={(event) =>
                                                    setGameTimeLimit(event.target.value)
                                                }
                                                value={gameTimeLimit}
                                            />
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <Switch
                                        name='useChessClocks'
                                        onChange={onUseChessClocksClick}
                                        isSelected={useChessClocks}
                                    >
                                        Use chess clocks (time limit per player)
                                    </Switch>
                                    {useChessClocks && (
                                        <div className='flex flex-row gap-2 border-l-1 pl-2 pt-2 border-default-200'>
                                            <Input
                                                name='chessClockTimeLimit'
                                                label='Limit (minutes)'
                                                type='number'
                                                onChange={(event) =>
                                                    setChessClockTimeLimit(event.target.value)
                                                }
                                                value={chessClockTimeLimit}
                                            />
                                            <Input
                                                name='chessClockDelay'
                                                label={'Delay (seconds)'}
                                                type='number'
                                                onChange={(event) =>
                                                    setChessClockDelay(event.target.value)
                                                }
                                                value={chessClockDelay}
                                            />
                                        </div>
                                    )}
                                </div>
                                <Input
                                    name='password'
                                    label='Password'
                                    placeholder='Password'
                                    type='text'
                                    onChange={(event) => setPassword(event.target.value)}
                                    value={password}
                                />
                            </div>
                        </Panel>
                    )}

                    <Panel title='Settings for Judges/Streamers'>
                        <div className='flex flex-col gap-2'>
                            <Switch
                                name='restrictTableCreators'
                                onChange={(event) => setRestrictTableCreators(event.target.checked)}
                                isSelected={restrictTableCreators}
                            >
                                Restrict table creators to those on the following list
                            </Switch>
                            {restrictTableCreators && (
                                <Textarea
                                    label='Valid Creators'
                                    rows='10'
                                    value={validTableCreatorsText}
                                    onChange={(event) => {
                                        setValidTableCreatorsText(event.target.value);
                                        setValidTableCreators(getUsernameList(event));
                                    }}
                                />
                            )}
                            <Switch
                                name='restrictSpectators'
                                onChange={(event) => setRestrictSpectators(event.target.checked)}
                                isSelected={restrictSpectators}
                            >
                                Restrict spectators to those on the following list
                            </Switch>
                            {restrictSpectators && (
                                <Textarea
                                    label='Valid Spectators'
                                    labelClass='col-sm-3'
                                    fieldClass='col-sm-9'
                                    rows='10'
                                    value={validSpectatorsText}
                                    onChange={(event) => {
                                        setValidSpectatorsText(event.target.value);
                                        setValidSpectators(getUsernameList(event));
                                    }}
                                />
                            )}
                        </div>
                    </Panel>
                    {format === 'draft' && (
                        <Panel title='Draft Settings'>
                            {isDraftCubesLoading ? (
                                <LoadingSpinner />
                            ) : (
                                <div className='flex flex-col gap-2'>
                                    <Select
                                        label='Draft Cube'
                                        options={draftCubes.map((draftCube) => ({
                                            value: draftCube._id,
                                            name: draftCube.name
                                        }))}
                                        value={draftCubeId}
                                        onChange={(value) => setDraftCubeId(value)}
                                    />
                                    <Input
                                        name='numOfRounds'
                                        label='Num of Rounds'
                                        type='text'
                                        value={numOfRounds}
                                        onChange={(event) =>
                                            setNumOfRounds(
                                                Number(
                                                    event.target ? event.target.value : event.value
                                                )
                                            )
                                        }
                                    />
                                </div>
                            )}
                        </Panel>
                    )}
                    {format === 'custom-joust' && (
                        <Panel title='Custom Restricted/Banned List'>
                            {isCardsLoading || isPacksLoading ? (
                                <LoadingSpinner />
                            ) : (
                                <div className='flex flex-col gap-2'>
                                    <div className='flex flex-wrap gap-2 items-center'>
                                        <Autocomplete
                                            label={'Select a card'}
                                            className='max-w-96'
                                            onSelectionChange={(value) => setCardToAdd(value)}
                                            value={cardToAdd}
                                        >
                                            {allCards
                                                .sort(compareByFactionNameRelease)
                                                .map((card) => (
                                                    <AutocompleteItem
                                                        key={card.code}
                                                        value={card.code}
                                                        startContent={
                                                            <CardImage code={card.code} size='sm' />
                                                        }
                                                    >
                                                        {card.label}
                                                    </AutocompleteItem>
                                                ))}
                                        </Autocomplete>
                                        <div className='flex flex-wrap gap-2'>
                                            <Button
                                                startContent={<FontAwesomeIcon icon={faPlus} />}
                                                isDisabled={
                                                    !cardToAdd || banned.includes(cardToAdd)
                                                }
                                                onPress={() => {
                                                    if (cardToAdd) {
                                                        setBanned(banned.concat(cardToAdd));
                                                    }
                                                }}
                                            >
                                                Add to Banned
                                            </Button>
                                            <Button
                                                startContent={<FontAwesomeIcon icon={faPlus} />}
                                                isDisabled={
                                                    !cardToAdd || restricted.includes(cardToAdd)
                                                }
                                                onPress={() => {
                                                    if (cardToAdd) {
                                                        setRestricted(restricted.concat(cardToAdd));
                                                    }
                                                }}
                                            >
                                                Add to Restricted
                                            </Button>
                                            <Button
                                                startContent={<FontAwesomeIcon icon={faPlus} />}
                                                isDisabled={
                                                    !cardToAdd || draftPod.includes(cardToAdd)
                                                }
                                                onPress={() => {
                                                    if (cardToAdd) {
                                                        setDraftPod(draftPod.concat(cardToAdd));
                                                    }
                                                }}
                                            >
                                                {draftPod.length > 0
                                                    ? `Add to Draft Pod`
                                                    : 'Add new Pod'}
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
                                                        // TODO: Add "restricted" to pod
                                                        const newPod = {
                                                            cards: draftPod
                                                        };
                                                        setPods(pods.concat(newPod));
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
                                            <div className='columns-1 sm:columns-2 md:columns-3 lg:columns-4 flex flex-col gap-1'>
                                                {cardChipList(banned, (code) =>
                                                    setBanned(banned.filter((c) => c !== code))
                                                )}
                                            </div>
                                        </div>
                                    )}
                                    {restricted.length > 0 && (
                                        <div className='flex flex-col gap-2 bg-default-50 p-2 rounded-lg'>
                                            <h1 className='text-large'>Restricted List</h1>
                                            <div className='columns-1 sm:columns-2 md:columns-3 lg:columns-4 flex flex-col gap-1'>
                                                {cardChipList(restricted, (code) =>
                                                    setRestricted(
                                                        restricted.filter((c) => c !== code)
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    )}
                                    {pods.length > 0 && (
                                        <div className='flex flex-col gap-2 bg-default-50 p-2 rounded-lg'>
                                            <h1 className='text-large'>Pod List</h1>
                                            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2'>
                                                {pods.map((pod, index) => (
                                                    <Chip
                                                        key={index}
                                                        onClose={() => {
                                                            let temp = [...pods];
                                                            temp.splice(index, 1);
                                                            setPods(temp);
                                                        }}
                                                        className='h-full rounded-xl bg-default-100 py-2'
                                                    >
                                                        <h1 className='text-medium'>
                                                            Pod #{index + 1}
                                                        </h1>
                                                        <div className='flex flex-col gap-1'>
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
                    )}
                    <div className='flex gap-2'>
                        <Button
                            isLoading={isSaveLoading}
                            color='primary'
                            type='submit'
                            onPress={handleSaveClick}
                        >
                            Save
                        </Button>
                        <Button
                            type='button'
                            color='default'
                            onPress={() => dispatch(navigate('/events'))}
                        >
                            Back
                        </Button>
                    </div>
                </form>
            </Panel>
        </div>
    );
};

export default EventEditor;
