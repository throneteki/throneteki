import React from 'react';
import { Input, Switch } from '@heroui/react';

const GameOptions = ({ formProps }) => {
    const options = [
        { name: 'allowSpectators', label: 'Allow spectators' },
        { name: 'showHand', label: 'Show hands to spectators' },
        { name: 'muteSpectators', label: 'Mute spectators' },
        { name: 'gamePrivate', label: 'Private (requires game link)' },
        { name: 'useGameTimeLimit', label: 'Use game time limit' },
        {
            name: 'useChessClocks',
            label: 'Use chess clocks (time limit per player)'
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
            <div className='flex gap-2'>
                {formProps.values.useGameTimeLimit && (
                    <div>
                        <span className='relative text-foreground-500'>Time Limit</span>
                        <div className='flex gap-2'>
                            <Input
                                label={'Limit (minutes)'}
                                className='lg:max-w-28'
                                type='number'
                                {...formProps.getFieldProps('gameTimeLimit')}
                                errorMessage={formProps.errors.gameTimeLimit}
                            />
                        </div>
                    </div>
                )}
                {formProps.values.useChessClocks && (
                    <div>
                        <span className='relative text-foreground-500'>Chess Clock</span>
                        <div className='flex gap-2'>
                            <Input
                                label={'Limit (minutes)'}
                                className='lg:max-w-32'
                                type='number'
                                {...formProps.getFieldProps('chessClockTimeLimit')}
                                errorMessage={formProps.errors.chessClockTimeLimit}
                            />
                            <Input
                                label={'Delay (seconds)'}
                                className='lg:max-w-32'
                                type='number'
                                {...formProps.getFieldProps('chessClockDelay')}
                                errorMessage={formProps.errors.chessClockDelay}
                            />
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default GameOptions;
