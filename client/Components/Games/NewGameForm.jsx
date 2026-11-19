import React from 'react';
import Field from '../Site/Field';
import Group from '../Site/Group';
import Notice from '../Site/Notice';
import SettingSwitch from '../Site/SettingSwitch';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { getIn, useFormikContext } from 'formik';
import { Button, Spinner } from '@heroui/react';

import GameOptions from './GameOptions';
import GameTypes from './GameTypes';
import { GameFormats } from '../../constants';
import FormatSelect from './FormatSelect';
import VariantSelect from './VariantSelect';
import LegalitySelect from './LegalitySelect';
import EventSelect from './EventSelect';
import { GameNameMaxLength } from './NewGame';
import { useGetEventsQuery } from '../../redux/middleware/api';
import { toast } from 'react-toastify';

const NewGameForm = ({ quickJoin, defaultEventId, onClosed = () => true }) => {
    const { values, errors, touched, isSubmitting, getFieldProps, setFieldValue, handleSubmit } =
        useFormikContext();
    const [isEventGameOptions, setIsEventGameOptions] = useState(false);
    const [isEventSpectators, setIsEventSpectators] = useState(false);
    const [userCachedOptions, setUserCachedOptions] = useState();

    const handleFormatChange = useCallback(
        (newFormat) => {
            setFieldValue('gameFormat', newFormat);
        },
        [setFieldValue]
    );

    const handleVariantChange = useCallback(
        (newVariant) => {
            setFieldValue('gameVariant', newVariant);
        },
        [setFieldValue]
    );

    const handleLegalityChange = useCallback(
        (newLegalityId) => {
            setFieldValue('gameLegality', newLegalityId);
        },
        [setFieldValue]
    );

    const handleEventChange = useCallback(
        (newEvent) => {
            const isUsingEventGameOptions = newEvent?.useEventGameOptions ?? false;
            setIsEventGameOptions(isUsingEventGameOptions);
            const eventAllowsSpectators =
                (isUsingEventGameOptions && newEvent.eventGameOptions?.spectators === true) ||
                Array.isArray(newEvent?.validSpectators);
            setIsEventSpectators(eventAllowsSpectators);
            if (newEvent) {
                if (!userCachedOptions) {
                    setUserCachedOptions({ ...values });
                }
                const gameOptions = {
                    ...userCachedOptions,
                    eventId: newEvent._id,
                    gameFormat: newEvent.format,
                    gameVariant: newEvent.variant,
                    gameLegality: newEvent.legality,
                    gameType: newEvent.gameType,
                    ...(newEvent.useEventGameOptions ? newEvent.eventGameOptions : {})
                };
                delete gameOptions.spectators;
                if (eventAllowsSpectators) {
                    gameOptions.allowSpectators = true;
                }

                // Override with event options
                for (const [key, value] of Object.entries(gameOptions)) {
                    setFieldValue(key, value);
                }
            } else if (userCachedOptions) {
                for (const [key, value] of Object.entries({
                    eventId: undefined,
                    ...userCachedOptions
                })) {
                    setFieldValue(key, value);
                }
                setUserCachedOptions(undefined);
            }
        },
        [setFieldValue, userCachedOptions, values]
    );

    const { data: events, isError: eventsFailed } = useGetEventsQuery();
    const appliedDefaultEvent = useRef(false);

    useEffect(() => {
        if (!defaultEventId || (!events && !eventsFailed) || appliedDefaultEvent.current) {
            return;
        }

        appliedDefaultEvent.current = true;
        const event = events?.find((e) => e._id === defaultEventId);
        if (event) {
            handleEventChange(event);
        } else {
            toast.warning(
                eventsFailed
                    ? 'The events could not be loaded, so this game is not part of the event'
                    : 'That event is no longer available, so this game is not part of it'
            );
        }
    }, [defaultEventId, events, eventsFailed, handleEventChange]);

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

    const canStart = useMemo(
        () => values.gameFormat && values.gameVariant && values.gameLegality,
        [values.gameFormat, values.gameLegality, values.gameVariant]
    );

    const experimental = GameFormats.find((f) => f.name === values.gameFormat)?.experimental;
    const formatLabel = GameFormats.find((f) => f.name === values.gameFormat)?.label;
    const rowSwitch = (name, label) => (
        <SettingSwitch
            label={label}
            isSelected={values[name]}
            isDisabled={isEventGameOptions}
            onValueChange={(selected) => setFieldValue(name, selected)}
            className='flex w-full items-stretch border-b border-gold-hair'
        />
    );

    return (
        <form
            className='flex flex-col gap-7'
            onSubmit={(event) => {
                event.preventDefault();
                handleSubmit(event);
            }}
        >
            {!quickJoin && (
                <>
                    <Group title='Game'>
                        <div className='grid grid-cols-1 gap-3 md:grid-cols-3'>
                            <Field
                                label='Name'
                                endContent={
                                    <span className='text-xs tabular-nums text-ink-faint'>
                                        {GameNameMaxLength - values.name.length}
                                    </span>
                                }
                                type='text'
                                maxLength={GameNameMaxLength}
                                {...getFieldProps('name')}
                                {...getValidationProps('name')}
                            />
                            <Field
                                autoComplete='off'
                                label='Password'
                                type='password'
                                placeholder='None'
                                {...getFieldProps('password')}
                                isDisabled={isEventGameOptions}
                            />
                            <EventSelect
                                label='Event'
                                placeholder='None'
                                selected={values.eventId}
                                onSelected={handleEventChange}
                                {...getValidationProps('eventId')}
                            />
                        </div>
                        {values.eventId && (
                            <p className='mt-2 text-sm text-ink-faint'>
                                {isEventGameOptions
                                    ? 'The event sets the format, type and options.'
                                    : 'The event sets the format and type.'}
                            </p>
                        )}
                    </Group>
                    <Group title='Format'>
                        <div className='grid grid-cols-1 gap-3 md:grid-cols-3'>
                            <FormatSelect
                                label='Format'
                                selected={values.gameFormat}
                                onSelected={handleFormatChange}
                                {...getValidationProps('gameFormat')}
                                disallowEmptySelection
                                isDisabled={!!values.eventId}
                            />
                            <VariantSelect
                                label='Variant'
                                format={values.gameFormat}
                                selected={values.gameVariant}
                                onSelected={handleVariantChange}
                                {...getValidationProps('gameVariant')}
                                disallowEmptySelection
                                isDisabled={!!values.eventId}
                            />
                            <LegalitySelect
                                label='Legality'
                                format={values.gameFormat}
                                variant={values.gameVariant}
                                selected={values.gameLegality}
                                onSelected={handleLegalityChange}
                                {...getValidationProps('gameLegality')}
                                disallowEmptySelection
                                isDisabled={!!values.eventId}
                                allowCustom={!!values.eventId}
                            />
                        </div>
                        {experimental && (
                            <Notice kind='warning' className='mt-4'>
                                {formatLabel} is experimental and may not work as expected. Please
                                report problems on GitHub.
                            </Notice>
                        )}
                    </Group>
                </>
            )}
            <Group title='Type'>
                <GameTypes isDisabled={!!values.eventId} />
            </Group>
            {!quickJoin && (
                <Group title='Options'>
                    <GameOptions
                        isDisabled={isEventGameOptions}
                        isSpectatorsDisabled={isEventSpectators}
                    />
                </Group>
            )}
            {!quickJoin && values.gameFormat === 'melee' && (
                <Group title='Melee'>
                    <div className='flex flex-col gap-4'>
                        <Field
                            label='Most players'
                            className='w-40'
                            type='number'
                            {...getFieldProps('maxPlayers')}
                            {...getValidationProps('maxPlayers')}
                            isDisabled={isEventGameOptions}
                        />
                        <div className='grid grid-cols-1 gap-x-8 border-t border-gold-hair md:grid-cols-2'>
                            {rowSwitch('randomSeats', 'Random seats')}
                            {rowSwitch('allowMultipleWinners', 'Allow more than one winner')}
                        </div>
                    </div>
                </Group>
            )}
            <div className='flex justify-end gap-2'>
                <Button onPress={() => onClosed()} variant='tertiary'>
                    Cancel
                </Button>
                <Button
                    type='submit'
                    isDisabled={!canStart}
                    isPending={isSubmitting}
                    variant='primary'
                >
                    {isSubmitting && <Spinner color='current' size='sm' />}
                    {quickJoin ? 'Find a game' : 'Create game'}
                </Button>
            </div>
        </form>
    );
};

export default NewGameForm;
