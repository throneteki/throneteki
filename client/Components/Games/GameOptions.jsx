import React from 'react';
import Field from '../Site/Field';
import SettingSwitch from '../Site/SettingSwitch';
import { useFormikContext } from 'formik';

const options = [
    { name: 'allowSpectators', label: 'Allow spectators' },
    { name: 'showHand', label: 'Show hands to spectators' },
    { name: 'muteSpectators', label: 'Mute spectators', hint: "Spectators can't post in the chat" },
    {
        name: 'gamePrivate',
        label: 'Private',
        hint: 'Hidden from the list, so only people with the link can join'
    },
    {
        name: 'useGameTimeLimit',
        label: 'Game time limit',
        hint: 'When time runs out, the player with the most power wins',
        fields: [{ name: 'gameTimeLimit', label: 'Length', unit: 'min' }]
    },
    {
        name: 'useChessClocks',
        label: 'Chess clocks',
        hint: 'Each player has their own clock',
        fields: [
            { name: 'chessClockTimeLimit', label: 'Clock', unit: 'min' },
            { name: 'chessClockDelay', label: 'Delay per move', unit: 'sec' }
        ]
    }
];

const GameOptions = ({ isDisabled, isSpectatorsDisabled = false }) => {
    const { values, errors, touched, setFieldValue, getFieldProps } = useFormikContext();

    return (
        <div className='grid grid-cols-1 gap-x-8 border-t border-gold-hair md:grid-cols-2'>
            {options.map((option) => (
                <div key={option.name} className='border-b border-gold-hair'>
                    <SettingSwitch
                        label={option.label}
                        hint={option.hint}
                        isSelected={values[option.name]}
                        isDisabled={
                            option.name === 'allowSpectators' ? isSpectatorsDisabled : isDisabled
                        }
                        onValueChange={(selected) => setFieldValue(option.name, selected)}
                        className='flex w-full items-stretch'
                    />
                    {option.fields && values[option.name] && (
                        <div className='flex flex-wrap items-start gap-3 px-0.5 pb-3'>
                            {option.fields.map((field) => (
                                <Field
                                    key={field.name}
                                    label={field.label}
                                    className='w-32'
                                    type='number'
                                    endContent={
                                        <span className='text-sm text-ink-faint'>{field.unit}</span>
                                    }
                                    {...getFieldProps(field.name)}
                                    isInvalid={!!(errors[field.name] && touched[field.name])}
                                    errorMessage={
                                        touched[field.name] ? errors[field.name] : undefined
                                    }
                                    isDisabled={isDisabled}
                                />
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default GameOptions;
