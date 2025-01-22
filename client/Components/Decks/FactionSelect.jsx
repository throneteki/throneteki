import React from 'react';

import { Constants } from '../../constants';
import FactionImage from '../Images/FactionImage';
import { Button } from '@heroui/react';
import { useDispatch } from 'react-redux';
import { navigate } from '../../redux/reducers/navigation';

const FactionSelect = ({ onSelect }) => {
    const dispatch = useDispatch();
    const factions = Constants.Factions;

    return (
        <>
            <div>
                <div className='w-full text-center mt-5'>
                    <h3 className='text-bold text-large'>To start, select a faction:</h3>
                </div>
            </div>
            <div className='grid grid-cols-3 lg:grid-cols-4 gap-8 my-8'>
                {factions.map((faction) => (
                    <div key={faction.value} className='flex content-center justify-center'>
                        <div role='button' onClick={() => onSelect(faction)}>
                            <FactionImage size='lg' faction={faction.value} />
                        </div>
                    </div>
                ))}
            </div>

            <div className='flex justify-center'>
                <Button onClick={() => dispatch(navigate('/decks'))}>Cancel</Button>
            </div>
        </>
    );
};

export default FactionSelect;
