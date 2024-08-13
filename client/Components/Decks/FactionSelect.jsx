import React from 'react';

import { Constants } from '../../constants';
import FactionImage from '../Images/FactionImage';

const FactionSelect = ({ onSelect }) => {
    const factions = Constants.Factions;

    return (
        <>
            <div>
                <div className='w-full text-center mb-3'>
                    <h4>To start, select a faction</h4>
                </div>
            </div>
            <div className='grid grid-cols-4'>
                {factions.map((faction) => (
                    <div key={faction} className='mt-2 mb-2 flex content-center'>
                        <div
                            role='button'
                            onClick={() => onSelect({ value: faction, name: faction })}
                        >
                            <FactionImage size='lg' faction={faction} />
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};

export default FactionSelect;
