import React from 'react';
import { Input, Switch } from '@heroui/react';
import { useFormikContext } from 'formik';

const GameOptions = ({ isDisabled }) => {
    const { values, errors, touched, handleChange, getFieldProps } = useFormikContext();
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
                                onChange={handleChange}
                                isSelected={values[option.name]}
                                isDisabled={isDisabled}
                            >
                                {option.label}
                            </Switch>
                        </div>
                    ))}
                </div>
            </div>
            <div className='flex flex-row gap-2 flex-wrap'>
                {values.useGameTimeLimit && (
                    <div>
                        <span className='relative text-foreground-500'>Time Limit</span>
                        <div className='flex gap-2'>
                            <Input
                                label={'Limit (minutes)'}
                                className='max-w-32'
                                type='number'
                                {...getFieldProps('gameTimeLimit')}
                                isInvalid={errors.gameTimeLimit && touched.gameTimeLimit}
                                errorMessage={errors.gameTimeLimit}
                                isDisabled={isDisabled}
                            />
                        </div>
                    </div>
                )}
                {values.useChessClocks && (
                    <div>
                        <span className='relative text-foreground-500'>Chess Clock</span>
                        <div className='flex gap-2'>
                            <Input
                                label={'Limit (minutes)'}
                                className='max-w-32'
                                type='number'
                                {...getFieldProps('chessClockTimeLimit')}
                                isInvalid={
                                    errors.chessClockTimeLimit && touched.chessClockTimeLimit
                                }
                                errorMessage={errors.chessClockTimeLimit}
                                isDisabled={isDisabled}
                            />
                            <Input
                                label={'Delay (seconds)'}
                                className='max-w-32'
                                type='number'
                                {...getFieldProps('chessClockDelay')}
                                isInvalid={errors.chessClockDelay && touched.chessClockDelay}
                                errorMessage={errors.chessClockDelay}
                                isDisabled={isDisabled}
                            />
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default GameOptions;
