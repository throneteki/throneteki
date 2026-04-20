import React from 'react';
import { useCallback, useMemo, useState } from 'react';
import { getIn, useFormikContext } from 'formik';
import { Button, Input, Switch } from '@heroui/react';

import GameOptions from './GameOptions';
import GameTypes from './GameTypes';
import AlertPanel, { AlertType } from '../Site/AlertPanel';
import { GameFormats } from '../../constants';
import FormatSelect from './FormatSelect';
import VariantSelect from './VariantSelect';
import LegalitySelect from './LegalitySelect';
import EventSelect from './EventSelect';
import { GameNameMaxLength } from './NewGame';

const NewGameForm = ({ quickJoin, onClosed = () => true }) => {
    const {
        values,
        errors,
        touched,
        isSubmitting,
        handleChange,
        getFieldProps,
        setFieldValue,
        handleSubmit
    } = useFormikContext();
    const [isEventGameOptions, setIsEventGameOptions] = useState(false);
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
            if (newEvent) {
                if (!userCachedOptions) {
                    setUserCachedOptions({ ...values });
                }
                const gameOptions = {
                    ...userCachedOptions,
                    eventId: newEvent._id,
                    gameFormat: newEvent.format,
                    gameVariant: newEvent.variant,
                    gameLegality:
                        typeof newEvent.legality === 'object' ? 'custom' : newEvent.legality,
                    gameType: newEvent.gameType,
                    ...(newEvent.useEventGameOptions ? newEvent.eventGameOptions : {})
                };

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

    return (
        <form
            onSubmit={async (event) => {
                event.preventDefault();

                handleSubmit(event);
            }}
        >
            <div className='flex flex-col gap-2'>
                {quickJoin && (
                    <AlertPanel variant={AlertType.Info}>
                        Select the type of game you&apos;d like to play and either you&apos;ll join
                        the next one available, or one will be created for you with default options.
                    </AlertPanel>
                )}
                {!quickJoin && (
                    <>
                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2'>
                            <Input
                                label='Name'
                                endContent={<span>{GameNameMaxLength - values.name.length}</span>}
                                type='text'
                                placeholder='Game Name'
                                maxLength={GameNameMaxLength}
                                {...getFieldProps('name')}
                                {...getValidationProps('name')}
                            />
                            <Input
                                autoComplete='off'
                                label='Password'
                                type='password'
                                placeholder={'Enter a password'}
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
                        {GameFormats.find((f) => f.name === values.gameFormat)?.experimental && (
                            <AlertPanel
                                variant='warning'
                                message={`The ${values.gameFormat} format is experimental and may not work as expected. Please report any issues to the developers on Github.`}
                            />
                        )}
                        <GameOptions isDisabled={isEventGameOptions} />
                        {values.gameFormat === 'melee' && (
                            <div>
                                <div className='font-bold'>Melee Options</div>
                                <div className='flex gap-2'>
                                    <Input
                                        label={'Max. players'}
                                        className='max-w-32'
                                        type='number'
                                        {...getFieldProps('maxPlayers')}
                                        {...getValidationProps('maxPlayers')}
                                        isDisabled={isEventGameOptions}
                                    />
                                    <Switch
                                        classNames={{ label: 'text-sm' }}
                                        name={'randomSeats'}
                                        onChange={handleChange}
                                        isSelected={values.randomSeats}
                                        isDisabled={isEventGameOptions}
                                    >
                                        Random Seats
                                    </Switch>
                                    <Switch
                                        classNames={{ label: 'text-sm' }}
                                        name={'allowMultipleWinners'}
                                        onChange={handleChange}
                                        isSelected={values.allowMultipleWinners}
                                        isDisabled={isEventGameOptions}
                                    >
                                        Allow Multiple Winners
                                    </Switch>
                                </div>
                            </div>
                        )}
                    </>
                )}
                <GameTypes isDisabled={!!values.eventId} />
                <div className='flex gap-2'>
                    <Button
                        color='success'
                        type='submit'
                        isDisabled={!canStart}
                        isLoading={isSubmitting}
                    >
                        Start
                    </Button>
                    <Button color='primary' onPress={() => onClosed()}>
                        Cancel
                    </Button>
                </div>
            </div>
        </form>
    );
};

export default NewGameForm;
