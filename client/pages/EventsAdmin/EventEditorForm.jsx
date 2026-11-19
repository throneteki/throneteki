import React, { useCallback, useState } from 'react';
import { getIn, setNestedObjectValues, useFormikContext } from 'formik';

import Field, { TextAreaField } from '../../Components/Site/Field';
import Group from '../../Components/Site/Group';
import SettingSwitch from '../../Components/Site/SettingSwitch';
import FormatSelect from '../../Components/Games/FormatSelect';
import VariantSelect from '../../Components/Games/VariantSelect';
import LegalitySelect from '../../Components/Games/LegalitySelect';
import GameTypes from '../../Components/Games/GameTypes';
import CustomLegalityEditor from './CustomLegalityEditor';

export const EventFormId = 'event-form';

const switchRowClass = 'flex w-full items-stretch border-b border-gold-hair';

const getUsernameList = (value) =>
    value
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);

const UsernameList = ({ label, initialNames, onChange, errorMessage }) => {
    const [text, setText] = useState(() => initialNames?.join('\n') ?? '');

    return (
        <TextAreaField
            label={label}
            description='One username per line'
            minRows={5}
            inputClassName='font-mono text-sm'
            value={text}
            onValueChange={(value) => {
                setText(value);
                onChange(getUsernameList(value));
            }}
            isInvalid={!!errorMessage}
            errorMessage={errorMessage}
        />
    );
};

const EventEditorForm = () => {
    const {
        values,
        errors,
        touched,
        validateForm,
        setTouched,
        submitForm,
        getFieldProps,
        setFieldValue
    } = useFormikContext();
    const options = values.eventGameOptions ?? {};

    const handleFormatChange = useCallback(
        (newFormat) => setFieldValue('format', newFormat),
        [setFieldValue]
    );

    const handleVariantChange = useCallback(
        (newVariant) => setFieldValue('variant', newVariant),
        [setFieldValue]
    );

    const handleLegalityChange = useCallback(
        (newLegality) => {
            setFieldValue('legality', newLegality);
            setFieldValue(
                'customLegality',
                newLegality !== 'custom' ? null : (values.customLegality ?? {})
            );
        },
        [setFieldValue, values.customLegality]
    );

    const handleSetCustomLegality = useCallback(
        (newCustomLegality) => setFieldValue('customLegality', newCustomLegality),
        [setFieldValue]
    );

    const getValidationProps = useCallback(
        (fieldName) => {
            const error = getIn(errors, fieldName);
            const touch = getIn(touched, fieldName);

            return {
                isInvalid: !!touch && !!error,
                errorMessage: touch ? error : undefined
            };
        },
        [errors, touched]
    );

    const numberField = (name, label, unit) => (
        <Field
            key={name}
            label={label}
            type='number'
            className='w-32'
            endContent={unit && <span className='text-sm text-ink-faint'>{unit}</span>}
            {...getFieldProps(`eventGameOptions.${name}`)}
            {...getValidationProps(`eventGameOptions.${name}`)}
        />
    );

    const optionSwitch = (name, label, hint, isDisabled, fields) => (
        <div key={name} className='border-b border-gold-hair'>
            <SettingSwitch
                label={label}
                hint={hint}
                isSelected={options[name]}
                isDisabled={isDisabled}
                onValueChange={(selected) => setFieldValue(`eventGameOptions.${name}`, selected)}
                className='flex w-full items-stretch'
            />
            {fields && options[name] && (
                <div className='flex flex-wrap items-start gap-3 px-0.5 pb-3'>
                    {fields.map((field) => numberField(field.name, field.label, field.unit))}
                </div>
            )}
        </div>
    );

    const listField = (name, label) => (
        <UsernameList
            label={label}
            initialNames={values[name]}
            onChange={(names) => setFieldValue(name, names)}
            errorMessage={touched[name] ? errors[name] : undefined}
        />
    );

    const isMelee = values.format === 'melee';

    return (
        <form
            id={EventFormId}
            className='contents'
            onSubmit={async (e) => {
                e.preventDefault();
                // Formik doesn't mark nested fields such as eventGameOptions.x as touched on submit
                const errors = await validateForm();
                setTouched(setNestedObjectValues(errors, true));
                if (Object.keys(errors).length === 0) {
                    submitForm();
                }
            }}
        >
            <Group title='Details'>
                <div className='flex flex-col gap-4'>
                    <Field
                        label='Name'
                        placeholder='Such as Winter Court Regionals'
                        className='max-w-xl'
                        {...getFieldProps('name')}
                        {...getValidationProps('name')}
                    />
                    <div className='grid grid-cols-1 gap-3 sm:grid-cols-3'>
                        <FormatSelect
                            label='Format'
                            selected={values.format}
                            onSelected={handleFormatChange}
                            {...getValidationProps('format')}
                        />
                        <VariantSelect
                            label='Variant'
                            format={values.format}
                            selected={values.variant}
                            onSelected={handleVariantChange}
                            {...getValidationProps('variant')}
                            disallowEmptySelection
                        />
                        <LegalitySelect
                            label='Card list'
                            format={values.format}
                            variant={values.variant}
                            selected={values.legality}
                            onSelected={handleLegalityChange}
                            {...getValidationProps('legality')}
                            disallowEmptySelection
                            allowCustom
                        />
                    </div>
                    <GameTypes />
                </div>
            </Group>

            {values.legality === 'custom' && (
                <CustomLegalityEditor
                    format={values.format}
                    variant={values.variant}
                    legality={values.customLegality}
                    setLegality={handleSetCustomLegality}
                />
            )}

            <Group title='Rules'>
                <div className='grid grid-cols-1 gap-x-8 border-t border-gold-hair md:grid-cols-2'>
                    <SettingSwitch
                        label='Lock decks'
                        hint='Once a player starts their first game in the event, they can’t switch or edit that deck'
                        isSelected={values.lockDecks}
                        onValueChange={(selected) => setFieldValue('lockDecks', selected)}
                        className={switchRowClass}
                    />
                    <SettingSwitch
                        label='Set the game options'
                        hint='Every game in the event uses the options below, and players can’t change them'
                        isSelected={values.useEventGameOptions}
                        onValueChange={(selected) => setFieldValue('useEventGameOptions', selected)}
                        className={switchRowClass}
                    />
                </div>
            </Group>

            {values.useEventGameOptions && (
                <Group title='Game options'>
                    <div className='flex flex-col gap-4'>
                        <div className='grid grid-cols-1 gap-x-8 border-t border-gold-hair md:grid-cols-2'>
                            {optionSwitch(
                                'spectators',
                                'Always allow spectators',
                                'When off, the player who creates each game decides'
                            )}
                            {optionSwitch('showHand', 'Show hands to spectators')}
                            {optionSwitch(
                                'muteSpectators',
                                'Mute spectators',
                                'Spectators can’t post in the chat'
                            )}
                            {optionSwitch(
                                'gamePrivate',
                                'Private',
                                'Hidden from the games list, so only people with the link can join'
                            )}
                            {optionSwitch(
                                'useGameTimeLimit',
                                'Game time limit',
                                'When time runs out, the player with the most power wins',
                                false,
                                [{ name: 'gameTimeLimit', label: 'Length', unit: 'min' }]
                            )}
                            {optionSwitch(
                                'useChessClocks',
                                'Chess clocks',
                                'Each player has their own clock',
                                false,
                                [
                                    { name: 'chessClockTimeLimit', label: 'Clock', unit: 'min' },
                                    {
                                        name: 'chessClockDelay',
                                        label: 'Delay per move',
                                        unit: 'sec'
                                    }
                                ]
                            )}
                            {isMelee &&
                                optionSwitch(
                                    'randomSeats',
                                    'Random seats',
                                    'Players are seated in a random order'
                                )}
                            {isMelee &&
                                optionSwitch(
                                    'allowMultipleWinners',
                                    'Allow more than one winner',
                                    'When time runs out, everyone tied for the most power wins'
                                )}
                        </div>
                        <div className='flex flex-wrap items-start gap-4'>
                            <Field
                                label='Password'
                                description='Leave empty for none'
                                className='w-full sm:w-64'
                                {...getFieldProps('eventGameOptions.password')}
                                {...getValidationProps('eventGameOptions.password')}
                            />
                            {isMelee && numberField('maxPlayers', 'Players per game')}
                        </div>
                    </div>
                </Group>
            )}

            <Group
                title='Who can take part'
                description='For judged games and streams. Anyone can still join a game as a player once it exists.'
            >
                <div className='grid grid-cols-1 gap-x-8 gap-y-4 md:grid-cols-2'>
                    <div className='flex flex-col gap-3'>
                        <SettingSwitch
                            label='Only listed players create games'
                            isSelected={values.restrictTableCreators}
                            onValueChange={(selected) =>
                                setFieldValue('restrictTableCreators', selected)
                            }
                        />
                        {values.restrictTableCreators &&
                            listField('validTableCreators', 'Can create games')}
                    </div>
                    <div className='flex flex-col gap-3'>
                        <SettingSwitch
                            label='Only listed players watch'
                            isSelected={values.restrictSpectators}
                            onValueChange={(selected) =>
                                setFieldValue('restrictSpectators', selected)
                            }
                        />
                        {values.restrictSpectators && listField('validSpectators', 'Can watch')}
                    </div>
                </div>
            </Group>
        </form>
    );
};

export default EventEditorForm;
