import React, { useEffect, useState } from 'react';
import Panel from '../Components/Site/Panel';
import DeckList from '../Components/Decks/DeckList';
import { useGetRestrictedListQuery } from '../redux/middleware/api';
import { Select, SelectItem } from '@heroui/react';
import { useDispatch } from 'react-redux';
import { navigate } from '../redux/reducers/navigation';
import Page from './Page';
import { GameFormats } from '../constants';

const Decks = () => {
    const dispatch = useDispatch();
    const { data: restrictedLists } = useGetRestrictedListQuery([]);

    const [restrictedList, setRestrictedList] = useState();
    const [gameFormat, setGameFormat] = useState(GameFormats[0].name);

    useEffect(() => {
        if (!gameFormat) {
            setGameFormat(GameFormats[0].name);
        }
    }, [gameFormat, setGameFormat]);
    useEffect(() => {
        if (!restrictedList && restrictedLists) {
            setRestrictedList(restrictedLists[0]._id);
        }
    }, [restrictedList, restrictedLists]);

    return (
        <Page>
            <Panel title='Decks'>
                <div className='flex flex-col gap-2'>
                    <div className='flex gap-2'>
                        <Select
                            label={'Game format'}
                            className='md:w-2/6'
                            onChange={(e) => setGameFormat(e.target.value)}
                            selectedKeys={new Set([gameFormat])}
                        >
                            {GameFormats.map((gf) => (
                                <SelectItem key={gf.name} value={gf.name}>
                                    {gf.label}
                                </SelectItem>
                            ))}
                        </Select>
                        <Select
                            label={'Game mode'}
                            className='md:w-2/6'
                            onChange={(e) => setRestrictedList(e.target.value)}
                            selectedKeys={restrictedList ? new Set([restrictedList]) : null}
                        >
                            {restrictedLists?.map((rl) => (
                                <SelectItem key={rl._id} value={rl._id}>
                                    {rl.name}
                                </SelectItem>
                            ))}
                        </Select>
                    </div>
                    <DeckList
                        gameFormat={gameFormat}
                        restrictedList={restrictedList}
                        onDeckSelected={(deck) => dispatch(navigate(`/decks/edit/${deck._id}/`))}
                    />
                </div>
            </Panel>
        </Page>
    );
};

export default Decks;
