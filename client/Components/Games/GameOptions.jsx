import React from 'react';
import { Input, Switch } from '@heroui/react';

const GameOptions = ({ formProps }) => {
    const options = [
        { name: 'allowSpectators', label: 'Allow spectators' },
        { name: 'showHand', label: 'Show hands to spectators' },
        { name: 'muteSpectators', label: 'Mute spectators' },
        { name: 'useGameTimeLimit', label: 'Use a time limit (in minutes)' },
        { name: 'gamePrivate', label: 'Private (requires game link)' },
        {
            name: 'useChessClocks',
            label: 'Use chess clocks with a time limit per player (in minutes)'
        }
    ];

    return (
        <>
            <div>
                <div className='font-bold'>Options</div>
                <div className='mt-2 grid md:grid-cols-2 lg:grid-cols-3'>
                    {options.map((option) => (
                        <div key={option.name}>
                            <Switch
                                className='mb-2'
                                classNames={{ label: 'text-sm' }}
                                name={option.name}
                                onChange={formProps.handleChange}
                                value='true'
                                isSelected={formProps.values[option.name]}
                            >
                                {option.label}
                            </Switch>
                        </div>
                    ))}
                </div>
            </div>
            {formProps.values.useGameTimeLimit && (
                <div>
                    <Input
                        label={'Time Limit'}
                        className='lg:max-w-28'
                        type='text'
                        placeholder={'Enter time limit'}
                        {...formProps.getFieldProps('gameTimeLimit')}
                        errorMessage={formProps.errors.gameTimeLimit}
                    />
                </div>
            )}
            {formProps.values.useChessClocks && (
                <div className='mt-2'>
                    <Input
                        label={'Chess Clock Limit'}
                        className='lg:max-w-32 mb-2'
                        type='text'
                        placeholder={'Enter time limit'}
                        {...formProps.getFieldProps('gameChessClockLimit')}
                        errorMessage={formProps.errors.gameChessClockLimit}
                    />
                </div>
            )}
        </>
    );
};

export default GameOptions;
