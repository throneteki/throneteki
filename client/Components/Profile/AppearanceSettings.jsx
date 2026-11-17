import React, { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button, Radio, RadioGroup } from '@heroui/react';
import { toast } from 'react-toastify';
import CardImage from '../Images/CardImage';
import SettingsGroup from './SettingsGroup';
import { CardSizeOptions } from '../../constants';
import { customBackgroundUrl } from '../../util';
import { setUser } from '../../redux/reducers/auth';
import {
    useRemoveBackgroundMutation,
    useUploadBackgroundMutation
} from '../../redux/middleware/api';
import { AcceptedBackgroundFiles, prepareBackground } from './prepareBackground';
import { BuiltInBackgrounds } from '../../backgrounds';
import { DefaultBackground, MaxBackgroundBytes } from '../../../shared/backgrounds';

const previewCards = ['01144', '01089', '01160', 'cardback'];

const tileClassNames = {
    base: 'm-0 inline-flex w-full max-w-full cursor-pointer items-center gap-2 rounded-medium border-2 border-default-200 p-2 hover:bg-default-100/50 data-[selected=true]:border-primary',
    labelWrapper: 'ms-0 min-w-0 flex-1'
};

const backgroundTileClassNames = {
    ...tileClassNames,
    base: `${tileClassNames.base} items-start`
};

const previewClassName =
    'mb-1 aspect-video w-full rounded-small border border-default-200 object-cover';

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
            <SettingsGroup
                title='Card size'
                className='grid gap-3 p-3 sm:grid-cols-[11rem_minmax(0,1fr)]'
            >
                <RadioGroup
                    aria-label='Card size'
                    value={values.cardSize}
                    onValueChange={(value) => setFieldValue('cardSize', value)}
                    classNames={{ wrapper: 'grid grid-cols-2 gap-2 sm:grid-cols-1' }}
                >
                    {CardSizeOptions.map(({ name, label }) => (
                        <Radio key={name} value={name} classNames={tileClassNames}>
                            {label}
                        </Radio>
                    ))}
                </RadioGroup>
                <div
                    aria-hidden
                    className='flex items-center overflow-hidden rounded-medium bg-black/40 p-3 sm:h-[12.75rem]'
                >
                    <div className='mx-auto flex items-end gap-2'>
                        {previewCards.map((code) => (
                            <CardImage
                                key={code}
                                code={code}
                                size={values.cardSize}
                                className='shrink-0 transition-all'
                            />
                        ))}
                    </div>
                </div>
            </SettingsGroup>
            <SettingsGroup
                title='Game board background'
                description='You can also upload your own image to play on. Large images are resized to fit the screen.'
                className='flex flex-col gap-3 p-3'
            >
                <RadioGroup
                    aria-label='Game board background'
                    value={values.background}
                    onValueChange={(value) => setFieldValue('background', value)}
                    classNames={{ wrapper: 'grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4' }}
                >
                    {BuiltInBackgrounds.map((background) => (
                        <Radio
                            key={background.name}
                            value={background.name}
                            classNames={backgroundTileClassNames}
                        >
                            <img src={background.imageUrl} alt='' className={previewClassName} />
                            {background.label}
                        </Radio>
                    ))}
                    {user.customBackground ? (
                        <Radio value='custom' classNames={backgroundTileClassNames}>
                            <img
                                src={customBackgroundUrl(user.customBackground)}
                                alt=''
                                className={previewClassName}
                            />
                            Custom
                        </Radio>
                    ) : (
                        <button
                            type='button'
                            disabled={isBusy}
                            onClick={chooseFile}
                            className='flex flex-col gap-1 rounded-medium border-2 border-dashed border-default-300 p-2 text-left hover:bg-default-100/50 disabled:opacity-50'
                        >
                            <span className='flex aspect-video w-full items-center justify-center rounded-small bg-black/40 text-small text-default-500'>
                                {isUploadBusy ? 'Uploading...' : 'Upload an image'}
                            </span>
                            Custom
                        </button>
                    )}
                </RadioGroup>
                {user.customBackground && (
                    <div className='flex flex-wrap gap-2'>
                        <Button
                            size='sm'
                            variant='flat'
                            isLoading={isUploadBusy}
                            isDisabled={isBusy}
                            onPress={chooseFile}
                        >
                            Replace image
                        </Button>
                        <Button
                            size='sm'
                            variant='flat'
                            color='danger'
                            isLoading={isRemoving}
                            isDisabled={isBusy}
                            onPress={onRemoveClick}
                        >
                            Remove image
                        </Button>
                    </div>
                )}
                <input
                    ref={fileInput}
                    type='file'
                    accept={AcceptedBackgroundFiles}
                    hidden
                    onChange={onFileChosen}
                />
            </SettingsGroup>
        </>
    );
};

export default AppearanceSettings;
