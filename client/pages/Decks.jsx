import React, { useEffect, useState } from 'react';
import Panel from '../Components/Site/Panel';
import DeckList from '../Components/Decks/DeckList';
import { useGetRestrictedListQuery } from '../redux/middleware/api';
import { Select, SelectItem } from "@heroui/react";
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
        <div>
            <Panel className='h-full' title='Decks'>
                <div className='mb-2 mt-2 w-full md:w-2/6'>
                    <Select
                        label={'Game mode'}
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
                    restrictedList={restrictedList}
                    onDeckSelected={(deck) => dispatch(navigate(`/decks/edit/${deck._id}/`))}
                />
            </Panel>
        </div>
    );
};

export default Decks;
