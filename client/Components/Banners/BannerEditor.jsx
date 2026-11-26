import React, { useEffect, useMemo, useRef, useState } from 'react';
import classNames from 'classnames';
import Field from '../Site/Field';
import { Button, Spinner } from '@heroui/react';
import RadioField from '../Site/RadioField';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import moment from 'moment';
import Group from '../Site/Group';
import EventSelect from '../Games/EventSelect';
import BannerSlide from './BannerSlide';
import { prepareBannerImage } from './prepareBannerImage';
import { endOfDay, startOfDay, toDateInput } from './bannerDates';
import { AcceptedImageFiles } from '../../imageEncoding';
import { bannerImageUrl } from '../../util';
import {
    BannerHeight,
    BannerWidth,
    MaxBannerTitleLength,
    MaxBannerUrlLength
} from '../../../shared/banners';
import {
    bannersChanged,
    useAddBannerMutation,
    useSaveBannerMutation,
    useUploadBannerImageMutation
} from '../../redux/middleware/api';

const errorMessage = (err, fallback) => {
    if (err?.status === 413) {
        return 'That image is too large';
    }

    return err?.data?.message || (typeof err === 'string' ? err : err?.message) || fallback;
};

const clickAction = (banner) => {
    if (banner.linkUrl) {
        return 'link';
    }

    return banner.eventId ? 'event' : 'none';
};

const initialFields = (banner) => {
    if (!banner) {
        return {
            title: '',
            action: 'link',
            linkUrl: '',
            eventId: null,
            eventDate: '',
            showFrom: toDateInput(new Date()),
            showUntil: ''
        };
    }

    return {
        title: banner.title,
        action: clickAction(banner),
        linkUrl: banner.linkUrl || '',
        eventId: banner.eventId,
        eventDate: banner.eventDate || '',
        showFrom: toDateInput(banner.showFrom),
        // show_until is the start of the day after the last day shown
        showUntil: toDateInput(new Date(new Date(banner.showUntil).getTime() - 1))
    };
};

const BannerEditor = ({ banner, onDone }) => {
    const [fields, setFields] = useState(() => initialFields(banner));
    const [pendingImage, setPendingImage] = useState();
    const [isPreparing, setIsPreparing] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    // Kept once a new banner is created, so retrying a failed image upload doesn't add it again
    const [savedId, setSavedId] = useState(banner?._id);
    const fileInput = useRef();
    const dispatch = useDispatch();

    const [addBanner, { isLoading: isAdding }] = useAddBannerMutation();
    const [saveBanner, { isLoading: isSaving }] = useSaveBannerMutation();
    const [uploadImage, { isLoading: isUploading }] = useUploadBannerImageMutation();
    const isSubmitting = isAdding || isSaving || isUploading;
    const isBusy = isPreparing || isSubmitting;

    const pendingImageUrl = useMemo(
        () => pendingImage && URL.createObjectURL(pendingImage),
        [pendingImage]
    );
    useEffect(
        () => () => pendingImageUrl && URL.revokeObjectURL(pendingImageUrl),
        [pendingImageUrl]
    );

    const imageUrl = pendingImageUrl || (banner?.image ? bannerImageUrl(banner.image) : undefined);

    const setField = (name) => (value) => setFields((current) => ({ ...current, [name]: value }));

    const onEventDateChange = (value) =>
        setFields((current) => ({
            ...current,
            eventDate: value,
            showUntil:
                !current.showUntil || current.showUntil === current.eventDate
                    ? value
                    : current.showUntil
        }));

    const validationError = useMemo(() => {
        if (!imageUrl) {
            return 'Add an image';
        }

        if (!fields.title.trim()) {
            return 'Enter a description of the image';
        }

        if (fields.action === 'link' && !fields.linkUrl.trim()) {
            return 'Enter the address the banner links to';
        }

        if (fields.action === 'event' && !fields.eventId) {
            return 'Choose the event the banner starts a game for';
        }

        if (!fields.showFrom || !fields.showUntil) {
            return 'Choose when the banner starts and stops showing';
        }

        if (moment(fields.showUntil).isBefore(fields.showFrom)) {
            return 'The banner must stop showing on or after the day it starts';
        }

        return undefined;
    }, [fields, imageUrl]);

    const prepareFile = async (file) => {
        if (!file) {
            return;
        }

        setIsPreparing(true);
        try {
            const { image, upscaled } = await prepareBannerImage(file);
            setPendingImage(image);
            if (upscaled) {
                toast.warning(
                    `That image is smaller than ${BannerWidth} by ${BannerHeight} pixels, so it may look blurry`
                );
            }
        } catch (err) {
            toast.error(err.message);
        } finally {
            setIsPreparing(false);
        }
    };

    const saveBannerAndImage = async () => {
        const body = {
            title: fields.title.trim(),
            linkUrl: fields.action === 'link' ? fields.linkUrl.trim() : null,
            eventId: fields.action === 'event' ? fields.eventId : null,
            eventDate: fields.eventDate || null,
            showFrom: startOfDay(fields.showFrom),
            showUntil: endOfDay(fields.showUntil)
        };

        let saved;
        try {
            saved = savedId
                ? await saveBanner({ id: savedId, banner: body }).unwrap()
                : await addBanner(body).unwrap();
            setSavedId(saved._id);
        } catch (err) {
            toast.error(errorMessage(err, 'An error occurred saving the banner'));
            return false;
        }

        if (pendingImage) {
            try {
                await uploadImage({ id: saved._id, image: pendingImage }).unwrap();
            } catch (err) {
                toast.error(
                    errorMessage(err, 'The banner was saved, but its image could not be uploaded')
                );
                return false;
            }
        }

        return true;
    };

    const onSave = async () => {
        const saved = await saveBannerAndImage();
        dispatch(bannersChanged());

        if (saved) {
            toast.success('Banner saved. The lobby can take up to a minute to show changes.');
            onDone();
        }
    };

    return (
        <Group
            title={savedId ? 'Edit banner' : 'New banner'}
            description={`Images are cropped from the centre to ${BannerWidth} by ${BannerHeight} pixels. Days run midnight to midnight UTC.`}
        >
            <form
                className='flex flex-col gap-5 border border-gold-line bg-well px-4 py-4 sm:px-5'
                onSubmit={(event) => {
                    event.preventDefault();
                    if (!validationError && !isBusy) {
                        onSave();
                    }
                }}
            >
                <input
                    ref={fileInput}
                    type='file'
                    accept={AcceptedImageFiles}
                    hidden
                    onChange={(event) => {
                        const file = event.target.files?.[0];
                        event.target.value = '';
                        prepareFile(file);
                    }}
                />
                <div
                    onDragOver={(event) => {
                        event.preventDefault();
                        setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={(event) => {
                        event.preventDefault();
                        setIsDragging(false);
                        prepareFile(event.dataTransfer.files?.[0]);
                    }}
                    className={classNames(
                        'flex flex-col gap-2',
                        isDragging && 'outline outline-2 outline-offset-4 outline-gold'
                    )}
                >
                    {imageUrl ? (
                        <>
                            <BannerSlide banner={{ title: fields.title }} imageUrl={imageUrl} />
                            <div className='flex flex-wrap items-center justify-center gap-2 text-sm text-ink-faint'>
                                <span>How it will look in the lobby.</span>
                                <Button
                                    size='sm'
                                    variant='tertiary'
                                    isPending={isPreparing}
                                    isDisabled={isBusy}
                                    onPress={() => fileInput.current?.click()}
                                >
                                    {isPreparing && <Spinner color='current' size='sm' />}
                                    Replace image
                                </Button>
                            </div>
                        </>
                    ) : (
                        <button
                            type='button'
                            disabled={isBusy}
                            onClick={() => fileInput.current?.click()}
                            className='mx-auto flex aspect-[6/1] w-full max-w-[calc(18vh*6)] min-h-24 flex-col items-center justify-center gap-1 border border-dashed border-gold-line text-ink-dim transition-colors hover:border-gold hover:text-ink'
                        >
                            {isPreparing ? (
                                <Spinner color='current' size='sm' />
                            ) : (
                                <>
                                    <span className='text-sm'>
                                        Choose an image or drop one here
                                    </span>
                                    <span className='text-xs text-ink-faint'>
                                        {BannerWidth} by {BannerHeight} pixels or larger
                                    </span>
                                </>
                            )}
                        </button>
                    )}
                </div>
                <div className='grid grid-cols-1 gap-x-5 gap-y-4 md:grid-cols-2'>
                    <Field
                        label='Description'
                        description='Read out by screen readers in place of the image'
                        maxLength={MaxBannerTitleLength}
                        value={fields.title}
                        onValueChange={setField('title')}
                        isRequired
                    />
                    <Field
                        label='Event date'
                        type='date'
                        description='Banners show soonest event first'
                        value={fields.eventDate}
                        onValueChange={onEventDateChange}
                    />
                    <Field
                        label='First day shown'
                        type='date'
                        value={fields.showFrom}
                        onValueChange={setField('showFrom')}
                        isRequired
                    />
                    <Field
                        label='Last day shown'
                        type='date'
                        description='Follows the event date until you change it'
                        value={fields.showUntil}
                        onValueChange={setField('showUntil')}
                        isRequired
                    />
                </div>
                <div className='flex flex-col gap-3'>
                    <RadioField
                        label='When clicked'
                        orientation='horizontal'
                        value={fields.action}
                        onChange={setField('action')}
                        options={[
                            { value: 'link', label: 'Open a link' },
                            { value: 'event', label: 'Start a game for an event' },
                            { value: 'none', label: 'Nothing' }
                        ]}
                    />
                    {fields.action === 'link' && (
                        <Field
                            aria-label='Link'
                            type='url'
                            placeholder='https://'
                            description='Such as the sign-up page. Opens in a new tab.'
                            className='max-w-xl'
                            maxLength={MaxBannerUrlLength}
                            value={fields.linkUrl}
                            onValueChange={setField('linkUrl')}
                            isRequired
                        />
                    )}
                    {fields.action === 'event' && (
                        <EventSelect
                            label={null}
                            aria-label='Event'
                            placeholder='Choose an event'
                            className='max-w-xl'
                            selected={fields.eventId}
                            onSelected={(event) => setField('eventId')(event?._id ?? null)}
                        />
                    )}
                </div>
                <div className='flex flex-wrap items-center justify-end gap-2 border-t border-gold-hair pt-4'>
                    {validationError && (
                        <span className='w-full text-sm text-ink-faint sm:me-auto sm:w-auto'>
                            {validationError}
                        </span>
                    )}
                    <Button variant='tertiary' isDisabled={isBusy} onPress={onDone}>
                        Cancel
                    </Button>
                    <Button
                        type='submit'
                        variant='primary'
                        isDisabled={!!validationError || isPreparing}
                        isPending={isSubmitting}
                    >
                        {isSubmitting && <Spinner color='current' size='sm' />}
                        {savedId ? 'Save changes' : 'Add banner'}
                    </Button>
                </div>
            </form>
        </Group>
    );
};

export default BannerEditor;
