import React, { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Formik } from 'formik';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import Notice from '../Components/Site/Notice';
import { useSaveProfileMutation, useVerifyAuthenticationQuery } from '../redux/middleware/api';
import { avatarUpdated, setAuthTokens, setUser } from '../redux/reducers/auth';
import { defaultActionWindows } from '../constants';
import { DefaultBackground } from '../../shared/backgrounds';
import Page from './Page';
import { keyboardShortcutsEnabled } from '../Components/GameBoard/keyboardShortcuts';
import BannerNav from '../Components/Site/BannerNav';
import Frame from '../Components/Site/Frame';
import SaveBar from '../Components/Site/SaveBar';
import {
    getProfileSection,
    ProfileSections,
    sectionsWithFields
} from '../Components/Profile/ProfileSections';
import AccountSettings, { isEmailChanged } from '../Components/Profile/AccountSettings';
import IntegrationSettings from '../Components/Profile/IntegrationSettings';
import GameplaySettings from '../Components/Profile/GameplaySettings';
import AppearanceSettings from '../Components/Profile/AppearanceSettings';
import SessionsSettings from '../Components/Profile/SessionsSettings';
import BlockListSettings from '../Components/Profile/BlockListSettings';

const sectionComponents = {
    account: AccountSettings,
    integrations: IntegrationSettings,
    gameplay: GameplaySettings,
    appearance: AppearanceSettings,
    sessions: SessionsSettings,
    blocklist: BlockListSettings
};

const bannerItems = (dirtySections = [], errorSections = []) =>
    ProfileSections.map((section) => ({
        key: section.key,
        label: section.label,
        path: `/profile/${section.key}`,
        mark: errorSections.includes(section.key)
            ? 'Has errors'
            : dirtySections.includes(section.key)
              ? 'Unsaved changes'
              : undefined
    }));

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
            <Notice kind='error' isBoxed className='mx-auto mt-10 max-w-xl'>
                Log in to change your profile.
            </Notice>
        );
    }

    if (isLoadingUser) {
        return <p className='py-6 text-center text-sm text-ink-dim'>Loading...</p>;
    }

    const SectionComponent = sectionComponents[activeSection.key];

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
        cardSize: settings.cardSize || 'normal',
        background:
            !settings.background || (settings.background === 'custom' && !user.customBackground)
                ? DefaultBackground
                : settings.background
    };

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
                                    cardSize: values.cardSize
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
                    let tone = 'quiet';
                    if (errorSections.length > 0) {
                        const names = ProfileSections.filter((s) => errorSections.includes(s.key))
                            .map((s) => s.label)
                            .join(', ');
                        status = `Check the highlighted fields in ${names}`;
                        tone = 'danger';
                    } else if (formProps.dirty) {
                        status = 'You have unsaved changes';
                        tone = 'warning';
                    }

                    const bannerNav = (
                        <BannerNav
                            label='Profile sections'
                            items={bannerItems(dirtySections, errorSections)}
                            current={activeSection.key}
                        />
                    );

                    if (activeSection.savesImmediately) {
                        return (
                            <div>
                                {bannerNav}
                                <Frame
                                    title={activeSection.label}
                                    description={activeSection.description}
                                >
                                    <SectionComponent user={user} />
                                </Frame>
                            </div>
                        );
                    }

                    return (
                        <form onSubmit={formProps.handleSubmit}>
                            {bannerNav}
                            <Frame
                                title={activeSection.label}
                                description={activeSection.description}
                                footer={
                                    <SaveBar
                                        status={status}
                                        tone={tone}
                                        isDirty={formProps.dirty}
                                        isSaving={isSaveLoading}
                                        onDiscard={() => formProps.resetForm()}
                                    />
                                }
                            >
                                <SectionComponent user={user} formProps={formProps} />
                            </Frame>
                        </form>
                    );
                }}
            </Formik>
        </Page>
    );
};

export default Profile;
