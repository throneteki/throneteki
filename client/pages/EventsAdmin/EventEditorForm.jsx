import React, { useCallback } from 'react';
import Panel from '../../Components/Site/Panel';
import { navigate } from '../../redux/reducers/navigation';
import { Button, Input, Switch, Textarea } from '@heroui/react';
import CustomLegalityEditor from './CustomLegalityEditor';
import { getIn, setNestedObjectValues, useFormikContext } from 'formik';
import FormatSelect from '../../Components/Games/FormatSelect';
import VariantSelect from '../../Components/Games/VariantSelect';
import LegalitySelect from '../../Components/Games/LegalitySelect';
import GameTypes from '../../Components/Games/GameTypes';

const getUsernameList = (value) =>
    value
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);

const EventEditorForm = ({ isNew, isSaving, dispatch }) => {
    const {
        values,
        errors,
        touched,
        isSubmitting,
        validateForm,
        setTouched,
        submitForm,
        handleChange,
        getFieldProps,
        setFieldValue
    } = useFormikContext();

    const handleFormatChange = useCallback(
        (newFormat) => {
            setFieldValue('format', newFormat);
        },
        [setFieldValue]
    );

    const handleVariantChange = useCallback(
        (newVariant) => {
            setFieldValue('variant', newVariant);
        },
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
                errorMessage: error
            };
        },
        [errors, touched]
    );

    return (
        <form
            className='flex gap-2 flex-col'
            onSubmit={async (e) => {
                e.preventDefault();
                // Working around Formik bug of not marking nested object (like eventGameOptions.x) as touched on submit
                const errors = await validateForm();
                setTouched(setNestedObjectValues(errors, true));
                if (Object.keys(errors).length === 0) {
                    submitForm();
                }
            }}
        >
            <Panel title='Event Details'>
                <div className='flex gap-2 flex-col'>
                    <div className='flex flex-col md:flex-row gap-2 items-center'>
                        <Input
                            label='Event Name'
                            placeholder='Event Name'
                            type='text'
                            {...getFieldProps('name')}
                            {...getValidationProps('name')}
                        />
                        <FormatSelect
                            label='Format'
                            selected={values.format}
                            onSelected={handleFormatChange}
                            {...getValidationProps('format')}
                            disallowEmptySelection
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
                            label='Legality'
                            format={values.format}
                            variant={values.variant}
                            selected={values.legality}
                            onSelected={handleLegalityChange}
                            {...getValidationProps('legality')}
                            disallowEmptySelection
                            allowCustom
                        />
                    </div>
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
                        <div className='flex flex-col gap-1'>
                            <Switch
                                name='lockDecks'
                                onChange={handleChange}
                                isSelected={values.lockDecks}
                            >
                                Lock decks for this event
                            </Switch>
                            <div>
                                Deck selections & edits will be locked after a player starts their
                                first game with this event.
                            </div>
                        </div>
                        <div className='flex flex-col gap-1'>
                            <Switch
                                name='useEventGameOptions'
                                onChange={handleChange}
                                isSelected={values.useEventGameOptions}
                            >
                                Custom Game Options
                            </Switch>
                            <div>Forces specific game options for games under this event.</div>
                        </div>
                    </div>
                    <GameTypes />
                </div>
            </Panel>

            {values.useEventGameOptions && (
                <Panel title='Event Game Options'>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
                        <Input
                            label='Password'
                            placeholder='Password'
                            type='text'
                            {...getFieldProps('eventGameOptions.password')}
                            {...getValidationProps('eventGameOptions.password')}
                        />
                        <div>
                            <Switch
                                name='eventGameOptions.spectators'
                                onChange={handleChange}
                                isSelected={values.eventGameOptions?.spectators}
                            >
                                Allow spectators
                            </Switch>
                            {values.eventGameOptions?.spectators && (
                                <div className='flex flex-col gap-2 border-l-1 pl-2 pt-2 border-default-200'>
                                    <Switch
                                        name='eventGameOptions.muteSpectators'
                                        onChange={handleChange}
                                        isSelected={values.eventGameOptions?.muteSpectators}
                                    >
                                        Mute spectators
                                    </Switch>
                                    <Switch
                                        name='eventGameOptions.showHand'
                                        onChange={handleChange}
                                        isSelected={values.eventGameOptions?.showHand}
                                    >
                                        Show hands to spectators
                                    </Switch>
                                </div>
                            )}
                        </div>
                        <div>
                            <Switch
                                name='eventGameOptions.useGameTimeLimit'
                                onChange={handleChange}
                                isSelected={values.eventGameOptions?.useGameTimeLimit}
                            >
                                Use game time limit
                            </Switch>
                            {values.eventGameOptions?.useGameTimeLimit && (
                                <div className='border-l-1 pl-2 pt-2 border-default-200'>
                                    <Input
                                        label='Limit (minutes)'
                                        type='number'
                                        {...getFieldProps('eventGameOptions.gameTimeLimit')}
                                        {...getValidationProps('eventGameOptions.gameTimeLimit')}
                                    />
                                </div>
                            )}
                        </div>
                        <div>
                            <Switch
                                name='eventGameOptions.useChessClocks'
                                onChange={handleChange}
                                isSelected={values.eventGameOptions?.useChessClocks}
                            >
                                Use chess clocks (time limit per player)
                            </Switch>
                            {values.eventGameOptions?.useChessClocks && (
                                <div className='flex flex-row gap-2 border-l-1 pl-2 pt-2 border-default-200'>
                                    <Input
                                        label='Limit (minutes)'
                                        type='number'
                                        {...getFieldProps('eventGameOptions.chessClockTimeLimit')}
                                        {...getValidationProps(
                                            'eventGameOptions.chessClockTimeLimit'
                                        )}
                                    />
                                    <Input
                                        label='Delay (seconds)'
                                        type='number'
                                        {...getFieldProps('eventGameOptions.chessClockDelay')}
                                        {...getValidationProps('eventGameOptions.chessClockDelay')}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                    {values.format === 'melee' && (
                        <div className='my-2 border-t-1 border-default-200'>
                            <h2 className='text-lg py-2 font-bold'>Melee Options</h2>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
                                <Switch
                                    name='eventGameOptions.randomSeats'
                                    onChange={handleChange}
                                    isSelected={values.eventGameOptions?.randomSeats}
                                >
                                    Random Seats
                                </Switch>
                                <Switch
                                    name='eventGameOptions.allowMultipleWinners'
                                    onChange={handleChange}
                                    isSelected={values.eventGameOptions?.allowMultipleWinners}
                                >
                                    Allow Multiple Winners
                                </Switch>
                            </div>
                        </div>
                    )}
                </Panel>
            )}

            <Panel title='Settings for Judges/Streamers'>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
                    <div className='flex flex-col gap-1'>
                        <Switch
                            name='restrictTableCreators'
                            onChange={handleChange}
                            isSelected={values.restrictTableCreators}
                        >
                            Enable creator whitelist
                        </Switch>
                        {values.restrictTableCreators && (
                            <>
                                <div>Separate username per line</div>
                                <Textarea
                                    label='Valid Creators'
                                    rows='10'
                                    value={values.validTableCreators?.join('\n') ?? ''}
                                    onValueChange={(value) =>
                                        setFieldValue('validTableCreators', getUsernameList(value))
                                    }
                                    isInvalid={
                                        !!(errors.validTableCreators && touched.validTableCreators)
                                    }
                                    errorMessage={errors.validTableCreators}
                                />
                            </>
                        )}
                    </div>
                    <div className='flex flex-col gap-1'>
                        <Switch
                            name='restrictSpectators'
                            onChange={handleChange}
                            isSelected={values.restrictSpectators}
                        >
                            Enable spectator whitelist
                        </Switch>
                        {values.restrictSpectators && (
                            <>
                                <div>Separate username per line</div>
                                <Textarea
                                    label='Valid Spectators'
                                    rows='10'
                                    value={values.validSpectators?.join('\n') ?? ''}
                                    onValueChange={(value) =>
                                        setFieldValue('validSpectators', getUsernameList(value))
                                    }
                                    isInvalid={
                                        !!(errors.validSpectators && touched.validSpectators)
                                    }
                                    errorMessage={errors.validSpectators}
                                />
                            </>
                        )}
                    </div>
                </div>
            </Panel>

            {values.legality === 'custom' && (
                <CustomLegalityEditor
                    format={values.format}
                    variant={values.variant}
                    legality={values.customLegality}
                    setLegality={handleSetCustomLegality}
                />
            )}

            <div className='flex gap-2'>
                <Button isLoading={isSaving || isSubmitting} color='success' type='submit'>
                    {isNew ? 'Create' : 'Save'}
                </Button>
                <Button color='primary' onPress={() => dispatch(navigate('/events'))}>
                    Back
                </Button>
            </div>
        </form>
    );
};

export default EventEditorForm;
