import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Button, Input, Radio, RadioGroup } from '@heroui/react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import moment from 'moment';
import Panel from '../Site/Panel';
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

    const onFileChosen = async (event) => {
        const file = event.target.files?.[0];
        event.target.value = '';
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
        <Panel title={savedId ? 'Edit banner' : 'Add banner'}>
            <div className='flex flex-col gap-3'>
                <div className='flex flex-wrap items-center gap-2'>
                    <Button
                        size='sm'
                        variant='flat'
                        isLoading={isPreparing}
                        isDisabled={isBusy}
                        onPress={() => fileInput.current?.click()}
                    >
                        {imageUrl ? 'Replace image' : 'Choose image'}
                    </Button>
                    <span className='text-sm text-default-500'>
                        Images are cropped from the centre to {BannerWidth} by {BannerHeight}{' '}
                        pixels.
                    </span>
                    <input
                        ref={fileInput}
                        type='file'
                        accept={AcceptedImageFiles}
                        hidden
                        onChange={onFileChosen}
                    />
                </div>
                {imageUrl && <BannerSlide banner={{ title: fields.title }} imageUrl={imageUrl} />}
                <div className='grid grid-cols-1 gap-2 md:grid-cols-2'>
                    <Input
                        label='Description'
                        description='Read out by screen readers in place of the image'
                        maxLength={MaxBannerTitleLength}
                        value={fields.title}
                        onValueChange={setField('title')}
                        isRequired
                    />
                    <RadioGroup
                        label='When clicked'
                        orientation='horizontal'
                        value={fields.action}
                        onValueChange={setField('action')}
                    >
                        <Radio value='link'>Open a link</Radio>
                        <Radio value='event'>Start a game for an event</Radio>
                        <Radio value='none'>Nothing</Radio>
                    </RadioGroup>
                    {fields.action === 'link' && (
                        <Input
                            label='Link'
                            type='url'
                            placeholder='https://'
                            description='Such as the sign up page'
                            maxLength={MaxBannerUrlLength}
                            value={fields.linkUrl}
                            onValueChange={setField('linkUrl')}
                            isRequired
                        />
                    )}
                    {fields.action === 'event' && (
                        <EventSelect
                            label='Event'
                            placeholder='Choose an event'
                            selected={fields.eventId}
                            onSelected={(event) => setField('eventId')(event?._id ?? null)}
                        />
                    )}
                    <Input
                        label='Event date'
                        type='date'
                        description='Orders the banners, soonest first'
                        value={fields.eventDate}
                        onValueChange={onEventDateChange}
                    />
                    <Input
                        label='Show from'
                        type='date'
                        value={fields.showFrom}
                        onValueChange={setField('showFrom')}
                        isRequired
                    />
                    <Input
                        label='Show until'
                        type='date'
                        description='The last day the banner is shown. Days run midnight to midnight UTC.'
                        value={fields.showUntil}
                        onValueChange={setField('showUntil')}
                        isRequired
                    />
                </div>
                {validationError && <span className='text-sm text-warning'>{validationError}</span>}
                <div className='flex gap-2'>
                    <Button
                        color='primary'
                        isDisabled={!!validationError || isPreparing}
                        isLoading={isSubmitting}
                        onPress={onSave}
                    >
                        Save
                    </Button>
                    <Button isDisabled={isBusy} onPress={onDone}>
                        Cancel
                    </Button>
                </div>
            </div>
        </Panel>
    );
};

export default BannerEditor;
