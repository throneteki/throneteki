import React, { useEffect, useState } from 'react';
import Panel from '../Components/Site/Panel';
import DeckList from '../Components/Decks/DeckList';
import { useGetRestrictedListQuery } from '../redux/middleware/api';
import { Select, SelectItem } from '@heroui/react';
import { useDispatch } from 'react-redux';
import { navigate } from '../redux/reducers/navigation';

const Decks = () => {
    const dispatch = useDispatch();
    const { data: restrictedLists } = useGetRestrictedListQuery([]);

    const [restrictedList, setRestrictedList] = useState();

    useEffect(() => {
        if (!restrictedList && restrictedLists) {
            setRestrictedList(restrictedLists[0]._id);
        }
    }, [restrictedList, restrictedLists]);

    return (
        <div className='m-2 lg:mx-auto lg:w-4/5'>
            <Panel className='h-full' title='Decks'>
                <div className='flex flex-col gap-2'>
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
                    <DeckList
                        restrictedList={restrictedList}
                        onDeckSelected={(deck) => dispatch(navigate(`/decks/edit/${deck._id}/`))}
                    />
                </div>
            </Panel>
        </div>
    );
};

export default Decks;
