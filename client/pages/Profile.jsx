import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Formik } from 'formik';
import { Button } from '@heroui/react';
import * as yup from 'yup';
import AlertPanel from '../Components/Site/AlertPanel';
import Panel from '../Components/Site/Panel';
import CardSizeOption from '../Components/Profile/CardSizeOption';
import GameBackgroundOption from '../Components/Profile/GameBackgroundOption';
import { useSaveProfileMutation } from '../redux/middleware/api';
import ProfileMain from '../Components/Profile/ProfileMain';
import ActionWindowOptions from '../Components/Profile/ActionWindowOptions';
import TimerSettings from '../Components/Profile/TimerSettings';
import GameSettings from '../Components/Profile/GameSettings';
import BlankBg from '../assets/img/bgs/blank.png';
import Background1 from '../assets/img/bgs/background.png';
import Background2 from '../assets/img/bgs/background2.png';
import { setUser } from '../redux/reducers/auth';
import { toast } from 'react-toastify';

const backgrounds = [
    { name: 'none', label: 'None', imageUrl: BlankBg },
    { name: 'BG1', label: 'Standard', imageUrl: Background1 },
    { name: 'BG2', label: 'Winter', imageUrl: Background2 }
];

const cardSizes = [
    { name: 'small', label: 'Small' },
    { name: 'normal', label: 'Normal' },
    { name: 'large', label: 'Large' },
    { name: 'x-large', label: 'Extra-Large' }
];

const defaultActionWindows = {
    plot: false,
    draw: false,
    challengeBegin: false,
    attackersDeclared: true,
    defendersDeclared: true,
    dominance: false,
    standing: false,
    taxation: false
};

const Profile = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    const [selectedBackground, setSelectedBackground] = useState(
        user?.settings.background || 'BG1'
    );
    const [selectedCardSize, setSelectedCardSize] = useState(user?.settings.cardSize || 'normal');
    const topRef = useRef(null);

    const [saveProfile, { error: profileError }] = useSaveProfileMutation();

    useEffect(() => {
        if (profileError) {
            toast.error(
                profileError.message ||
                    'An error occured saving your profile. Please try again later.'
            );
        }
    }, [profileError]);

    useEffect(() => {
        setSelectedCardSize(user?.settings?.cardSize || 'normal');
        setSelectedBackground(user?.settings?.background || 'BG1');
    }, [user?.settings?.background, user?.settings?.cardSize]);

    if (!user) {
        return (
            <AlertPanel variant='error' message='You must be logged in to update your profile' />
        );
    }

    const schema = yup.object({
        // avatar: yup
        //     .mixed()
        //     .test(
        //         'fileSize',
        //         'Image must be less than 100KB in size',
        //         (value) => !value || value.size <= 100 * 1024
        //     )
        //     .test(
        //         'fileType',
        //         'Unsupported image format',
        //         (value) =>
        //             !value ||
        //             ['image/jpg', 'image/jpeg', 'image/gif', 'image/png'].includes(value.type)
        //     ),
        // username: yup
        //     .string()
        //     .required('You must specify a username')
        //     .min(3, 'Your username must be at least 3 characters long')
        //     .max(15, 'Your username cannot be more than 15 charcters')
        //     .matches(
        //         /^[A-Za-z0-9_-]+$/,
        //         'Usernames must only use the characters a-z, 0-9, _ and -'
        //     ),
        email: yup
            .string()
            .email('Please enter a valid email address')
            .required('You must specify an email address'),
        password: yup.string().min(6, 'Password must be at least 6 characters'),
        passwordAgain: yup
            .string()
            .oneOf([yup.ref('password'), null], 'The passwords you have entered do not match')
    });

    const settings = user.settings || {};

    const initialValues = {
        enableGravatar: !!user.enableGravatar,
        email: user.email,
        actionWindows: user.promptedActionWindows || defaultActionWindows,
        chooseOrder: !!settings.keywordSettings.chooseOrder,
        chooseCards: !!settings.keywordSettings.chooseCards,
        promptDupes: !!settings.promptDupes,
        windowTimer: settings.windowTimer || 5,
        timerAbilities: !!settings.timerSettings.abilities,
        timerEvents: settings.timerSettings.events
    };

    return (
        <div className='m-2 lg:w-3/4 mb-5 lg:mx-auto'>
            <Formik
                initialValues={initialValues}
                validationSchema={schema}
                onSubmit={async (values) => {
                    try {
                        const ret = await saveProfile({
                            username: user.username,
                            profile: {
                                email: values.email,
                                password: values.newPassword,
                                promptedActionWindows: values.actionWindows,
                                enableGravatar: values.enableGravatar,
                                settings: {
                                    promptDupes: values.promptDupes,
                                    windowTimer: values.windowTimer,
                                    keywordSettings: {
                                        chooseOrder: values.chooseOrder,
                                        chooseCards: values.chooseCards
                                    },
                                    timerSettings: {
                                        abilities: values.timerAbilities,
                                        events: values.timerEvents
                                    },
                                    background: selectedBackground,
                                    cardSize: selectedCardSize
                                }
                            }
                        }).unwrap();
                        toast.success('Profile saved successfully');

                        dispatch(setUser(ret.user));
                    } catch (err) {
                        toast.error(
                            err.message ||
                                'An error occured saving your profile. Please try again later.'
                        );
                    }

                    topRef?.current?.scrollIntoView(false);
                }}
            >
                {(formProps) => (
                    <form onSubmit={formProps.handleSubmit}>
                        <ProfileMain user={user} formProps={formProps} />
                        <div className='mt-2' ref={topRef}>
                            <ActionWindowOptions formProps={formProps} />
                        </div>
                        <div className='mt-2'>
                            <GameSettings formProps={formProps} />
                        </div>
                        <div className='mt-2 grid grid-cols-1 lg:grid-cols-2 gap-2'>
                            <TimerSettings formProps={formProps} />
                            <Panel title='Card Image Size'>
                                <div className='flex gap-2 items-end justify-center'>
                                    {cardSizes.map((cardSize) => (
                                        <CardSizeOption
                                            key={cardSize.name}
                                            label={cardSize.label}
                                            name={cardSize.name}
                                            onSelect={(cardSize) => setSelectedCardSize(cardSize)}
                                            selected={selectedCardSize === cardSize.name}
                                        />
                                    ))}
                                </div>
                            </Panel>
                        </div>
                        <div className='mt-2'>
                            <Panel title='Game Board Background'>
                                <div className='grid grid-cols-3 gap-2'>
                                    {backgrounds.map((background) => (
                                        <GameBackgroundOption
                                            imageUrl={background.imageUrl}
                                            key={background.name}
                                            label={background.label}
                                            name={background.name}
                                            onSelect={(background) =>
                                                setSelectedBackground(background)
                                            }
                                            selected={selectedBackground === background.name}
                                        />
                                    ))}
                                </div>
                            </Panel>
                        </div>
                        <div className='w-full sticky bottom-6 z-50 mt-2 flex justify-center'>
                            <Button className='w-1/2' color='success' type='submit'>
                                Save
                            </Button>
                        </div>
                    </form>
                )}
            </Formik>
        </div>
    );
};

export default Profile;
