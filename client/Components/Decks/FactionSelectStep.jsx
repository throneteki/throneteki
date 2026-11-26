import React from 'react';

import { Constants } from '../../constants';
import { Button } from '@heroui/react';
import { useDispatch } from 'react-redux';
import { navigate } from '../../redux/reducers/navigation';
import CardImage from '../Images/CardImage';
import Frame from '../Site/Frame';

const FactionSelectStep = ({ onSelect }) => {
    const dispatch = useDispatch();

    return (
        <Frame
            title='New deck'
            description='Choose the faction your deck is built around.'
            actions={
                <Button onPress={() => dispatch(navigate('/decks'))} variant='tertiary'>
                    Cancel
                </Button>
            }
        >
            <div className='grid grid-cols-2 justify-items-center gap-x-4 gap-y-6 sm:grid-cols-4'>
                {Constants.Factions.map((faction) => (
                    <button
                        key={faction.value}
                        type='button'
                        className='group flex flex-col items-center gap-2 rounded-sm p-1 text-ink-dim transition-colors hover:text-gold focus-visible:text-gold'
                        onClick={() => onSelect(faction)}
                    >
                        <CardImage
                            size='large'
                            code={faction.value}
                            className='transition-transform duration-150 group-hover:-translate-y-1'
                        />
                        <span className='font-display text-sm font-semibold'>{faction.name}</span>
                    </button>
                ))}
            </div>
        </Frame>
    );
};

export default FactionSelectStep;
