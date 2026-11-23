import React, { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Formik } from 'formik';
import { Button } from '@heroui/react';
import classNames from 'classnames';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import AlertPanel from '../Components/Site/AlertPanel';
import { useSaveProfileMutation, useVerifyAuthenticationQuery } from '../redux/middleware/api';
import { avatarUpdated, setAuthTokens, setUser } from '../redux/reducers/auth';
import { defaultActionWindows } from '../constants';
import { DefaultBackground } from '../../shared/backgrounds';
import { normalizeHud } from '../hud';
import { estimateBoardMeasure, fitSizedHud } from '../Components/GameBoard/boardScales';
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

// A fixed size is shown, and saved, as the fitted sizes that look the same on this screen
const fittedHud = (settings) => {
    const hud = normalizeHud(settings);
    return fitSizedHud(
        hud,
        estimateBoardMeasure(hud, { width: window.innerWidth, height: window.innerHeight })
    );
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
        keyboardShortcuts: keyboardShortcutsEnabled(settings),
        hud: fittedHud(settings),
        background:
            !settings.background || (settings.background === 'custom' && !user.customBackground)
                ? DefaultBackground
                : settings.background
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
                                    background: values.background,
                                    hud: values.hud
                                }
                            }
                        }).unwrap();
                        toast.success('Profile saved successfully');

                        dispatch(setUser(ret.data?.user ?? ret.user));
                        if (avatarMayChange) {
                            dispatch(avatarUpdated());
                        }
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
                {(formProps) => {
                    const dirtySections = sectionsWithFields(
                        changedFields(formProps.values, formProps.initialValues)
                    );
                    const errorSections =
                        formProps.submitCount > 0
                            ? sectionsWithFields(Object.keys(formProps.errors))
                            : [];

                    let status = 'No unsaved changes';
                    let statusClass = 'text-default-500';
                    if (errorSections.length > 0) {
                        const names = ProfileSections.filter((s) => errorSections.includes(s.key))
                            .map((s) => s.label)
                            .join(', ');
                        status = `Check the highlighted fields in ${names}`;
                        statusClass = 'text-danger';
                    } else if (formProps.dirty) {
                        status = 'You have unsaved changes';
                        statusClass = 'text-warning';
                    }

                    return (
                        <form
                            onSubmit={formProps.handleSubmit}
                            className='grid items-start gap-3 lg:grid-cols-[13rem_minmax(0,1fr)]'
                        >
                            <ProfileNav
                                user={user}
                                activeSection={activeSection.key}
                                dirtySections={dirtySections}
                                errorSections={errorSections}
                            />
                            <section className='rounded-large border-2 border-primary bg-black/75 shadow-lg'>
                                <header className='border-b border-default-200 px-4 py-3'>
                                    <h1 className='text-large font-bold'>{activeSection.label}</h1>
                                    <p className='text-small text-default-500'>
                                        {activeSection.description}
                                    </p>
                                </header>
                                <div className='flex max-w-4xl flex-col gap-6 p-4'>
                                    <SectionComponent user={user} formProps={formProps} />
                                </div>
                                <div className='sticky bottom-0 z-10 flex flex-wrap items-center justify-end gap-2 rounded-b-large border-t border-default-200 bg-black px-4 py-3'>
                                    <span
                                        className={classNames(
                                            'w-full text-small sm:mr-auto sm:w-auto',
                                            statusClass
                                        )}
                                    >
                                        {status}
                                    </span>
                                    <Button
                                        variant='flat'
                                        isDisabled={!formProps.dirty || isSaveLoading}
                                        onPress={() => formProps.resetForm()}
                                    >
                                        Discard
                                    </Button>
                                    <Button
                                        color='success'
                                        type='submit'
                                        isDisabled={!formProps.dirty}
                                        isLoading={isSaveLoading}
                                    >
                                        Save changes
                                    </Button>
                                </div>
                            </section>
                        </form>
                    );
                }}
            </Formik>
        </Page>
    );
};

export default Profile;
