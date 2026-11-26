import React, { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button, Spinner } from '@heroui/react';
import RadioField, { RadioOption, tileClassName } from '../Site/RadioField';
import { toast } from 'react-toastify';
import Group from '../Site/Group';
import HudSettings from './HudSettings';
import SettingReveal from './SettingReveal';
import { customBackgroundUrl } from '../../util';
import { setUser } from '../../redux/reducers/auth';
import {
    useRemoveBackgroundMutation,
    useUploadBackgroundMutation
} from '../../redux/middleware/api';
import { prepareBackground } from './prepareBackground';
import { AcceptedImageFiles } from '../../imageEncoding';
import { BuiltInBackgrounds } from '../../backgrounds';
import { DefaultBackground, MaxBackgroundBytes } from '../../../shared/backgrounds';

const previewClassName = 'mb-1 aspect-video w-full rounded-sm border border-white/10 object-cover';

const uploadErrorMessage = (err) => {
    if (err.status === 413) {
        return `That image is too large. Backgrounds can be up to ${MaxBackgroundBytes / 1024 / 1024}MB.`;
    }

    return (
        err.data?.message ||
        err.message ||
        'An error occured uploading your background. Please try again later.'
    );
};

const AppearanceSettings = ({ user, formProps }) => {
    const { values, setFieldValue } = formProps;
    const dispatch = useDispatch();
    const fileInput = useRef();
    const [isPreparing, setIsPreparing] = useState(false);
    const [uploadBackground, { isLoading: isUploading }] = useUploadBackgroundMutation();
    const [removeBackground, { isLoading: isRemoving }] = useRemoveBackgroundMutation();
    const isUploadBusy = isPreparing || isUploading;
    const isBusy = isUploadBusy || isRemoving;

    const chooseFile = () => fileInput.current?.click();

    const onFileChosen = async (event) => {
        const file = event.target.files?.[0];
        event.target.value = '';
        if (!file) {
            return;
        }

        // Replacing the image while another background is chosen keeps that choice
        const selectCustom = !user.customBackground || values.background === 'custom';

        setIsPreparing(true);
        try {
            const image = await prepareBackground(file);
            const response = await uploadBackground({ username: user.username, image }).unwrap();
            dispatch(setUser(response.user));
            if (selectCustom) {
                setFieldValue('background', 'custom');
            }

            if (user.settings?.background === 'custom') {
                toast.success('Background updated');
            } else if (selectCustom) {
                toast.success('Background uploaded. Save your changes to use it.');
            } else {
                toast.success('Background replaced. Choose Custom and save to use it.');
            }
        } catch (err) {
            toast.error(uploadErrorMessage(err));
        } finally {
            setIsPreparing(false);
        }
    };

    const onRemoveClick = async () => {
        try {
            const response = await removeBackground(user.username).unwrap();
            dispatch(setUser(response.user));

            const background =
                values.background === 'custom' ? DefaultBackground : values.background;
            if (formProps.initialValues.background === 'custom') {
                // The server also moved the saved choice off the removed image, so move the form's saved
                // value with it, keeping any other unsaved edits
                formProps.resetForm({
                    values: { ...formProps.initialValues, background: DefaultBackground },
                    touched: formProps.touched,
                    errors: formProps.errors,
                    submitCount: formProps.submitCount
                });
                formProps.setValues({ ...values, background });
            } else if (background !== values.background) {
                setFieldValue('background', background);
            }
            toast.success('Background removed');
        } catch (err) {
            toast.error(
                err.data?.message ||
                    'An error occured removing your background. Please try again later.'
            );
        }
    };

    return (
        <>
            <HudSettings value={values.hud} onChange={(hud) => setFieldValue('hud', hud)} />
            <Group
                title='Game board background'
                description='You can also upload your own image to play on. Large images are resized to fit the screen.'
                className='flex flex-col gap-3'
            >
                <RadioField
                    aria-label='Game board background'
                    value={values.background}
                    onChange={(value) => setFieldValue('background', value)}
                    optionsClassName='grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4'
                >
                    {BuiltInBackgrounds.map((background) => (
                        <RadioOption
                            key={background.name}
                            value={background.name}
                            className={tileClassName}
                            contentClassName='items-start'
                        >
                            <span className='flex min-w-0 flex-1 flex-col'>
                                <img
                                    src={background.imageUrl}
                                    alt=''
                                    className={previewClassName}
                                />
                                {background.label}
                            </span>
                        </RadioOption>
                    ))}
                    {user.customBackground ? (
                        <RadioOption
                            value='custom'
                            className={tileClassName}
                            contentClassName='items-start'
                        >
                            <span className='flex min-w-0 flex-1 flex-col'>
                                <img
                                    src={customBackgroundUrl(user.customBackground)}
                                    alt=''
                                    className={previewClassName}
                                />
                                Custom
                            </span>
                        </RadioOption>
                    ) : (
                        <button
                            type='button'
                            disabled={isBusy}
                            onClick={chooseFile}
                            className='flex flex-col gap-1 rounded-sm border border-dashed border-gold-line p-2 text-left hover:bg-quiet disabled:opacity-50'
                        >
                            <span className='flex aspect-video w-full items-center justify-center rounded-sm bg-well text-sm text-ink-dim'>
                                {isUploadBusy ? 'Uploading...' : 'Upload an image'}
                            </span>
                            Custom
                        </button>
                    )}
                </RadioField>
                <SettingReveal show={!!user.customBackground}>
                    <div className='flex flex-wrap gap-2'>
                        <Button
                            size='sm'
                            isPending={isUploadBusy}
                            isDisabled={isBusy}
                            onPress={chooseFile}
                            variant='tertiary'
                        >
                            {isUploadBusy && <Spinner color='current' size='sm' />}Replace image
                        </Button>
                        <Button
                            size='sm'
                            isPending={isRemoving}
                            isDisabled={isBusy}
                            onPress={onRemoveClick}
                            variant='danger-soft'
                        >
                            {isRemoving && <Spinner color='current' size='sm' />}Remove image
                        </Button>
                    </div>
                </SettingReveal>
                <input
                    ref={fileInput}
                    type='file'
                    accept={AcceptedImageFiles}
                    hidden
                    onChange={onFileChosen}
                />
            </Group>
        </>
    );
};

export default AppearanceSettings;
