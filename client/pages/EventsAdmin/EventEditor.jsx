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
import { Button, Input, Select, SelectItem, Switch, Textarea } from '@nextui-org/react';
import { toastr } from 'react-redux-toastr';

const formatListTextForCards = (cards, cardCodes) => {
    if (!cardCodes || !cards) {
        return '';
    }

    const allCards = Object.values(cards);
    const cardCodeToNameIndex = allCards.reduce((index, card) => {
        index[card.code] = card.label;
        return index;
    }, {});

    return cardCodes.map((cardCode) => `${cardCodeToNameIndex[cardCode]}\n`).join('');
};

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

    const standardRL = useMemo(
        () =>
            restrictedLists &&
            restrictedLists.find((rl) => rl.official && rl.cardSet === 'redesign'),
        [restrictedLists]
    );
    const valyrianRL = useMemo(
        () =>
            restrictedLists &&
            restrictedLists.find((rl) => rl.official && rl.cardSet === 'original'),
        [restrictedLists]
    );

    const formats = useMemo(
        () => [
            { name: standardRL?.name, value: 'standard' },
            { name: valyrianRL?.name, value: 'valyrian' },
            { name: 'Draft', value: 'draft' },
            { name: 'Custom Joust', value: 'custom-joust' }
        ],
        [standardRL?.name, valyrianRL?.name]
    );

    const [name, setName] = useState(event?.name);
    const [format, setFormat] = useState(event?.format || 'standard');
    const [restricted, setRestricted] = useState(event?.restricted || []);
    const [restrictedListText, setRestrictedListText] = useState(
        (event && formatListTextForCards(cards, event.restricted)) || ''
    );
    const [banned, setBanned] = useState(event?.banned || []);
    const [bannedListText, setBannedListText] = useState(
        (event && formatListTextForCards(cards, event.banned)) || ''
    );
    const [pods, setPods] = useState(event?.pods);
    const [podsText, setPodsText] = useState(event?.pods ? JSON.stringify(event.pods) : '');
    const [lockDecks, setLockDecks] = useState(!!event?.lockDecks);
    const [useEventGameOptions, setUseEventGameOptions] = useState(!!event?.useEventGameOptions);
    const [spectators, setSpectators] = useState();
    const [muteSpectators, setMuteSpectators] = useState();
    const [showHand, setShowHand] = useState();
    const [useGameTimeLimit, setUseGameTimeLimit] = useState();
    const [useChessClocks, setUseChessClocks] = useState();
    const [gameTimeLimit, setGameTimeLimit] = useState();
    const [chessClockTimeLimit, setChessClockTimeLimit] = useState();
    const [delayToStartClock, setDelayToStartClock] = useState();
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

    const onUseGameTimeLimitClick = useCallback((event) => {
        setUseGameTimeLimit(event.target.checked);

        //deactivate chessclock when timelimit is used
        if (event.target.checked) {
            setUseChessClocks(false);
        }
    }, []);

    const onUseChessClocksClick = useCallback((event) => {
        setUseChessClocks(event.target.checked);
        //deactivate other timeLimit when chessClocks are used
        if (event.target.checked) {
            setUseGameTimeLimit(false);
        }
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

    const handleAddCard = useCallback(
        (event, text, list) => {
            event.preventDefault();

            if (!cardToAdd || !cardToAdd.label) {
                return;
            }

            let cardText = text;
            cardText += `${cardToAdd.label}\n`;

            let cards = list;

            cards.push(cardToAdd.code);

            return { cardText, cards };
        },
        [cardToAdd]
    );

    const handlePodListChange = useCallback((event) => {
        let parsedPodObject = undefined;
        try {
            parsedPodObject = JSON.parse(event.target.value);
        } finally {
            setPodsText(event.target.value);
            setPods(parsedPodObject ? parsedPodObject : []);
        }
    }, []);

    const getEventFromState = useCallback(() => {
        let defaultRestrictedList = null;
        if (format === 'standard') {
            defaultRestrictedList = standardRL.name;
        } else if (format === 'valyrian') {
            defaultRestrictedList = valyrianRL.name;
        }

        return {
            _id: eventId,
            name: name,
            draftOptions: {
                draftCubeId,
                numOfRounds
            },
            format: format,
            useDefaultRestrictedList: ['standard', 'valyrian'].includes(format),
            defaultRestrictedList,
            useEventGameOptions: useEventGameOptions,
            eventGameOptions: {
                spectators,
                muteSpectators,
                showHand,
                useGameTimeLimit,
                gameTimeLimit,
                useChessClocks,
                chessClockTimeLimit,
                delayToStartClock,
                password
            },
            restricted: restricted,
            banned: banned,
            pods: pods,
            restrictSpectators: restrictSpectators,
            restrictTableCreators: restrictTableCreators,
            validSpectators: validSpectators,
            lockDecks: lockDecks,
            validTableCreators: validTableCreators
        };
    }, [
        banned,
        chessClockTimeLimit,
        delayToStartClock,
        draftCubeId,
        eventId,
        format,
        gameTimeLimit,
        lockDecks,
        muteSpectators,
        name,
        numOfRounds,
        password,
        pods,
        restrictSpectators,
        restrictTableCreators,
        restricted,
        showHand,
        spectators,
        standardRL?.name,
        useChessClocks,
        useEventGameOptions,
        useGameTimeLimit,
        validSpectators,
        validTableCreators,
        valyrianRL?.name
    ]);

    const handleSaveClick = useCallback(
        async (event) => {
            event.preventDefault();

            try {
                await saveEvent(getEventFromState()).unwrap();

                toastr.success('Event saved successfully', '', { closeDuration: 5000 });
            } catch (err) {
                console.info(err);
                toastr.error('Error saving event');
            }
        },
        [getEventFromState, saveEvent]
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
            let cards = Object.values(cards);

            let matchingCards = cards.filter((card) => {
                if (pack) {
                    return pack.code === card.packCode && card.name.toLowerCase() === cardName;
                }

                return card.name.toLowerCase() === cardName;
            });

            matchingCards.sort((a, b) => compareCardByReleaseDate(a, b));

            return matchingCards[0];
        },
        [compareCardByReleaseDate, packs]
    );

    const handleCardListChange = useCallback(
        (event) => {
            let split = event.target.value.split('\n');
            const cards = [];

            for (const line of split) {
                const card = parseCardLine(line);
                if (card) {
                    cards.push(card.code);
                }
            }

            return cards;
        },
        [parseCardLine]
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
            setDelayToStartClock(event.eventGameOptions.delayToStartClock);
            setPassword(event.eventGameOptions.password);
        }
        setRestrictSpectators(event.restrictSpectators);
        setRestrictTableCreators(event.restrictTableCreators);

        setValidTableCreators(event.validTableCreators || []);
        setValidTableCreatorsText(formatListTextForUsers(event.validTableCreators || []));

        setValidSpectators(event.validSpectators || []);
        setValidSpectatorsText(formatListTextForUsers(event.validSpectators || []));
    }, [event]);

    if (
        isLoading ||
        isCardsLoading ||
        isRestrictedListsLoading ||
        isPacksLoading ||
        isDraftCubesLoading
    ) {
        return <div>Loading...</div>;
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
        <div>
            <Panel title='Event Editor'>
                <form className='flex gap-2 flex-col'>
                    <Panel title='Event Details'>
                        <div className='flex gap-2 flex-col'>
                            <div className='grid grid-cols-2 gap-2'>
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
                            <div className='grid grid-cols-2 gap-2'>
                                <Switch
                                    className='col-span-2'
                                    name='spectators'
                                    onChange={(event) => setSpectators(event.target.checked)}
                                    isSelected={spectators}
                                >
                                    Allow spectators
                                </Switch>
                                {spectators && (
                                    <>
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
                                            onChange={(event) => setShowHand(event.target.checked)}
                                            isSelected={showHand}
                                        >
                                            Show hands to spectators
                                        </Switch>
                                    </>
                                )}
                                <Switch
                                    name='useGameTimeLimit'
                                    className='col-span-2'
                                    onChange={onUseGameTimeLimitClick}
                                    isSelected={useGameTimeLimit}
                                >
                                    Use a time limit (in minutes)
                                </Switch>
                                {useGameTimeLimit && (
                                    <Input
                                        className='col-span-2 w-1/2'
                                        name='gameTimeLimit'
                                        label='Timelimit in minutes'
                                        placeholder='Timelimit in minutes'
                                        type='number'
                                        onChange={(event) => setGameTimeLimit(event.target.value)}
                                        value={gameTimeLimit}
                                    />
                                )}
                                <Switch
                                    name='useChessClocks'
                                    className='col-span-2'
                                    onChange={onUseChessClocksClick}
                                    isSelected={useChessClocks}
                                >
                                    Use chess clocks with a time limit per player
                                </Switch>
                                {useChessClocks && (
                                    <>
                                        <Input
                                            name='chessClockTimeLimit'
                                            label='Timelimit in minutes'
                                            placeholder='Timelimit in minutes'
                                            type='number'
                                            onChange={(event) =>
                                                setChessClockTimeLimit(event.target.value)
                                            }
                                            value={chessClockTimeLimit}
                                        />
                                        <Input
                                            name='delayToStartClock'
                                            label='Delay to start the clock in seconds'
                                            placeholder='Delay to start the clock in seconds'
                                            type='number'
                                            onChange={(event) =>
                                                setDelayToStartClock(event.target.value)
                                            }
                                            value={delayToStartClock}
                                        />
                                    </>
                                )}
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
                        <div>
                            <Select
                                label='Draft Cube'
                                labelClass='col-sm-3'
                                fieldClass='col-sm-9'
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
                                labelClass='col-sm-3'
                                fieldClass='col-sm-9'
                                type='text'
                                value={numOfRounds}
                                onChange={(event) =>
                                    setNumOfRounds(
                                        Number(event.target ? event.target.value : event.value)
                                    )
                                }
                            />
                        </div>
                    )}
                    {format === 'custom-joust' && (
                        <div>
                            <Panel title='Custom Restricted/Banned List'>
                                {/* <Typeahead
                                    label='Card'
                                    labelClass={'col-sm-3 col-xs-2'}
                                    fieldClass='col-sm-4 col-xs-5'
                                    labelKey={'label'}
                                    options={allCards}
                                    onChange={(selectedCards) => setCardToAdd(selectedCards[0])}
                                >
                                    <div className='col-xs-1 no-x-padding'>
                                        <div className='btn-group'>
                                            <button
                                                className='btn btn-primary dropdown-toggle'
                                                data-toggle='dropdown'
                                                aria-haspopup='true'
                                                aria-expanded='false'
                                            >
                                                Add <span className='caret' />
                                            </button>
                                            <ul className='dropdown-menu'>
                                                <li>
                                                    <a
                                                        href='#'
                                                        onClick={(event) => {
                                                            let { cardText, cards } = handleAddCard(
                                                                event,
                                                                restrictedListText,
                                                                restricted
                                                            );
                                                            setRestrictedListText(cardText);
                                                            setRestricted(cards);
                                                        }}
                                                    >
                                                        Add to restricted
                                                    </a>
                                                </li>
                                                <li>
                                                    <a
                                                        href='#'
                                                        onClick={(event) => {
                                                            let { cardText, cards } = handleAddCard(
                                                                event,
                                                                bannedListText,
                                                                banned
                                                            );
                                                            setBannedListText(cardText);
                                                            setBanned(cards);
                                                        }}
                                                    >
                                                        Add to banned
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </Typeahead> */}
                                <Textarea
                                    label='Restricted List'
                                    labelClass='col-sm-3'
                                    fieldClass='col-sm-9'
                                    rows='10'
                                    value={restrictedListText}
                                    onChange={(event) => {
                                        const cards = handleCardListChange(event);

                                        setRestrictedListText(event.target.value);
                                        setRestricted(cards);
                                    }}
                                />
                                <Textarea
                                    label='Banned List'
                                    labelClass='col-sm-3'
                                    fieldClass='col-sm-9'
                                    rows='4'
                                    value={bannedListText}
                                    onChange={(event) => {
                                        const cards = handleCardListChange(event);

                                        setBannedListText(event.target.value);
                                        setBanned(cards);
                                    }}
                                />
                                <Textarea
                                    label='Banned Pods'
                                    labelClass='col-sm-3'
                                    fieldClass='col-sm-9'
                                    rows='4'
                                    value={podsText}
                                    onChange={handlePodListChange}
                                />
                            </Panel>
                        </div>
                    )}
                    <div className='flex gap-2'>
                        <Button
                            isLoading={isSaveLoading}
                            color='primary'
                            type='submit'
                            onClick={handleSaveClick}
                        >
                            Save
                        </Button>
                        <Button
                            type='button'
                            color='primary'
                            onClick={() => dispatch(navigate('/events'))}
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            </Panel>
        </div>
    );
};

export default EventEditor;
