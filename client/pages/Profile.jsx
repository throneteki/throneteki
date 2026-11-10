import React, { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Formik } from 'formik';
import { Button } from '@heroui/react';
import classNames from 'classnames';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import HudSettings from '../Components/Profile/HudSettings';
import { normalizeHud } from '../hud';
import { hudStore } from '../hudStore';
import Page from './Page';
import { keyboardShortcutsEnabled } from '../Components/GameBoard/keyboardShortcuts';
import ProfileNav from '../Components/Profile/ProfileNav';
import {
    getProfileSection,
    ProfileSections,
    sectionsWithFields
} from '../Components/Profile/ProfileSections';
import AccountSettings, { isEmailChanged } from '../Components/Profile/AccountSettings';
import IntegrationSettings from '../Components/Profile/IntegrationSettings';
import GameplaySettings from '../Components/Profile/GameplaySettings';
import AppearanceSettings from '../Components/Profile/AppearanceSettings';

const sectionComponents = {
    account: AccountSettings,
    integrations: IntegrationSettings,
    gameplay: GameplaySettings,
    appearance: AppearanceSettings
};

const changedFields = (values, initialValues) =>
    Object.keys(values).filter(
        (field) => JSON.stringify(values[field]) !== JSON.stringify(initialValues[field])
    );

const Profile = ({ section }) => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    const formRef = useRef();
    const activeSection = getProfileSection(section);

    const [saveProfile, { isLoading: isSaveLoading }] = useSaveProfileMutation();
    // The user in the store comes from the login token, which can be out of date (e.g. after unsubscribing from an
    // email), so load the account as it is now before building the form
    const { data: currentUser, isFetching: isLoadingUser } = useVerifyAuthenticationQuery('', {
        skip: !user,
        refetchOnMountOrArgChange: true
    });
    const emailUpdates = (currentUser ?? user)?.emailUpdates !== false;

    useEffect(() => {
        if (saveError) {
            toast.error(
                saveError.message || 'An error occured saving your profile. Please try again later.'
            );
        }
    }, [saveError]);

    useEffect(() => {
        setSelectedBackground(user?.settings?.background || 'BG1');
    }, [user?.settings?.background, user?.settings?.hud]);

    if (!user) {
        return (
            <AlertPanel variant='error' message='You must be logged in to update your profile' />
        );
    }

    if (isLoadingUser) {
        return <p className='py-6 text-center'>Loading...</p>;
    }

    const schema = yup.object({
        email: yup
            .string()
            .email('Please enter a valid email address')
            .required('You must specify an email address'),
        currentPassword: yup
            .string()
            .test(
                'currentPasswordRequired',
                'Enter your current password to change your email address or password',
                function (value) {
                    const { email, password } = this.parent;

                    return !(password || isEmailChanged(email, user.email)) || !!value;
                }
            ),
        password: yup.string().min(6, 'Password must be at least 6 characters'),
        passwordAgain: yup
            .string()
            .oneOf([yup.ref('password'), null], 'The passwords you have entered do not match')
    });

    const settings = user.settings || {};

    const initialValues = {
        enableGravatar: !!user.enableGravatar,
        emailUpdates: (currentUser ?? user)?.emailUpdates !== false,
        email: user.email,
        currentPassword: '',
        password: '',
        passwordAgain: '',
        actionWindows: user.promptedActionWindows || defaultActionWindows,
        chooseOrder: !!settings.keywordSettings?.chooseOrder,
        chooseCards: !!settings.keywordSettings?.chooseCards,
        promptDupes: !!settings.promptDupes,
        hideInterrupts: settings.hideInterrupts ?? true,
        hideReactions: settings.hideReactions ?? true,
        hud: normalizeHud(settings)
    };

    const SectionComponent = sectionComponents[activeSection.key];

    return (
        <Page>
            <Formik
                innerRef={formRef}
                initialValues={initialValues}
                validationSchema={schema}
                onSubmit={async (values, { resetForm }) => {
                    const saved = formRef.current.initialValues;
                    const savedEmailUpdates = saved.emailUpdates;
                    const avatarMayChange =
                        values.enableGravatar !== saved.enableGravatar ||
                        isEmailChanged(values.email, saved.email);

                    try {
                        const ret = await saveProfile({
                            username: user.username,
                            profile: {
                                email: values.email,
                                currentPassword: values.currentPassword,
                                password: values.password,
                                promptedActionWindows: values.actionWindows,
                                enableGravatar: values.enableGravatar,
                                // Only sent when changed here, so saving a page loaded before
                                // unsubscribing from an email doesn't turn emails back on
                                emailUpdates:
                                    values.emailUpdates !== savedEmailUpdates
                                        ? values.emailUpdates
                                        : undefined,
                                settings: {
                                    promptDupes: values.promptDupes,
                                    hideInterrupts: values.hideInterrupts,
                                    hideReactions: values.hideReactions,
                                    keyboardShortcuts: values.keyboardShortcuts,
                                    keywordSettings: {
                                        chooseOrder: values.chooseOrder,
                                        chooseCards: values.chooseCards
                                    },
                                    background: selectedBackground,
                                    hud: values.hud
                                }
                            }
                        }).unwrap();
                        toast.success('Profile saved successfully');

                        dispatch(setUser(ret.data?.user ?? ret.user));
                        hudStore.reset();
                        if (ret.data?.token && ret.data?.refreshToken) {
                            dispatch(setAuthTokens(ret.data.token, ret.data.refreshToken));
                        }

                        resetForm({
                            values: {
                                ...values,
                                currentPassword: '',
                                password: '',
                                passwordAgain: ''
                            }
                        });
                    } catch (err) {
                        toast.error(
                            err.data?.message ||
                                err.message ||
                                'An error occured saving your profile. Please try again later.'
                        );
                    }
                }}
            >
                {(formProps) => (
                    <form onSubmit={formProps.handleSubmit} className='flex flex-col gap-2'>
                        <ProfileMain user={user} formProps={formProps} />
                        <ActionWindowOptions formProps={formProps} />
                        <GameSettings formProps={formProps} />
                        <HudSettings
                            value={formProps.values.hud}
                            onChange={(hud) => formProps.setFieldValue('hud', hud)}
                        />
                        <Panel title='Game Board Background'>
                            <div className='grid sm:grid-cols-3 gap-2'>
                                {backgrounds.map((background) => (
                                    <GameBackgroundOption
                                        imageUrl={background.imageUrl}
                                        key={background.name}
                                        label={background.label}
                                        name={background.name}
                                        onSelect={(background) => setSelectedBackground(background)}
                                        selected={selectedBackground === background.name}
                                    />
                                ))}
                            </div>
                        </Panel>
                        <div className='w-full sticky bottom-6 z-50 mt-2 flex justify-center'>
                            <Button
                                className='w-1/2'
                                color='success'
                                type='submit'
                                isLoading={isSaveLoading}
                            >
                                Save
                            </Button>
                        </div>
                    </form>
                )}
            </Formik>
        </Page>
    );
};

export default Profile;
