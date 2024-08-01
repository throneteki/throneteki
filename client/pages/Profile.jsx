import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import RangeSlider from 'react-bootstrap-range-slider';
import AlertPanel from '../Components/Site/AlertPanel';
import Panel from '../Components/Site/Panel';
import Form from '../Components/Form/Form';
import Checkbox from '../Components/Form/Checkbox';
import CardSizeOption from '../Components/Profile/CardSizeOption';
import GameBackgroundOption from '../Components/Profile/GameBackgroundOption';
import Avatar from '../Components/Site/Avatar';
import {
    useSaveProfileMutation,
    useUnlinkPatreonMutation,
    useUpdateAvatarMutation
} from '../redux/middleware/api';
import { toastr } from 'react-redux-toastr';

const backgrounds = [
    { name: 'none', label: 'None', imageUrl: 'img/blank.png' },
    { name: 'BG1', label: 'Standard', imageUrl: 'img/background.png' },
    { name: 'BG2', label: 'Winter', imageUrl: 'img/background3.png' }
];

const cardSizes = [
    { name: 'small', label: 'Small' },
    { name: 'normal', label: 'Normal' },
    { name: 'large', label: 'Large' },
    { name: 'x-large', label: 'Extra-Large' }
];

const windows = [
    { name: 'plot', label: 'Plots revealed', style: 'col-sm-4' },
    { name: 'draw', label: 'Draw phase', style: 'col-sm-4' },
    { name: 'challengeBegin', label: 'Before challenge', style: 'col-sm-4' },
    { name: 'attackersDeclared', label: 'Attackers declared', style: 'col-sm-4' },
    { name: 'defendersDeclared', label: 'Defenders declared', style: 'col-sm-4' },
    { name: 'dominance', label: 'Dominance phase', style: 'col-sm-4' },
    { name: 'standing', label: 'Standing phase', style: 'col-sm-4' },
    { name: 'taxation', label: 'Taxation phase', style: 'col-sm-4' }
];

const Profile = () => {
    const user = useSelector((state) => state.auth.user);

    const [success, setSuccess] = useState();
    const [error, setError] = useState();
    const [promptDupes, setPromptDupes] = useState(user?.settings?.promptDupes || false);
    const [timerSettings, setTimerSettings] = useState(user?.timerSettings || {});
    const [keywordSettings, setKeywordSettings] = useState(user?.settings?.keywordSettings || {});
    const [windowTimer, setWindowTimer] = useState(user?.settings?.windowTimer || 5);
    const [enableGravatar, setEnableGravatar] = useState(user?.enableGravatar || false);
    const [selectedBackground, setSelectedBackground] = useState(
        user?.settings.background || 'BG1'
    );
    const [selectedCardSize, setSelectedCardSize] = useState(user?.settings.cardSize || 'normal');
    const [promptedActionWindows, setPromptedActionWindows] = useState(
        user?.promptedActionWindows || {}
    );

    const [saveProfile, { isLoading, error: profileError }] = useSaveProfileMutation();
    const [updateAvatar, { isLoading: avatarLoading }] = useUpdateAvatarMutation();
    const [unlinkPatreon, { isLoading: unlinkLoading }] = useUnlinkPatreonMutation();

    useEffect(() => {
        if (profileError) {
            setError(
                profileError.message ||
                    'An error occured saving your profile. Please try again later.'
            );
        }
    }, [profileError]);

    useEffect(() => {
        setKeywordSettings(user?.settings?.keywordSettings || {});
        setPromptDupes(user?.settings?.promptDupes || false);
        setTimerSettings(user?.settings?.timerSettings || {});
        setWindowTimer(user?.settings?.windowTimer || 5);
        setSelectedCardSize(user?.settings?.cardSize || 'normal');
        setSelectedBackground(user?.settings?.background || 'BG1');
    }, [
        user?.settings?.background,
        user?.settings?.cardSize,
        user?.settings?.keywordSettings,
        user?.settings?.promptDupes,
        user?.settings?.timerSettings,
        user?.settings?.windowTimer
    ]);

    useEffect(() => {
        setPromptedActionWindows(user?.promptedActionWindows || {});
    }, [user?.promptedActionWindows]);

    const onWindowToggle = useCallback(
        (event, field) => {
            var newPromptedActionWindows = { ...promptedActionWindows };

            newPromptedActionWindows[field] = event.target.checked;

            setPromptedActionWindows(newPromptedActionWindows);
        },
        [promptedActionWindows]
    );

    const retWindows = useMemo(() => {
        return windows.map((window) => {
            return (
                <Checkbox
                    key={window.name}
                    noGroup
                    name={'promptedActionWindows.' + window.name}
                    label={window.label}
                    fieldClass={window.style}
                    type='checkbox'
                    onChange={(e) => onWindowToggle(e, window.name)}
                    checked={promptedActionWindows[window.name]}
                />
            );
        });
    }, [onWindowToggle, promptedActionWindows]);

    const onSaveClick = useCallback(
        async (state) => {
            setSuccess(undefined);

            document.getElementsByClassName('wrapper')[0].scrollTop = 0;

            try {
                await saveProfile({
                    username: user.username,
                    profile: {
                        email: state.email,
                        password: state.newPassword,
                        promptedActionWindows: promptedActionWindows,
                        enableGravatar: enableGravatar,
                        settings: {
                            promptDupes: promptDupes,
                            windowTimer: windowTimer,
                            keywordSettings: keywordSettings,
                            timerSettings: timerSettings,
                            background: selectedBackground,
                            cardSize: selectedCardSize
                        }
                    }
                }).unwrap();
                setSuccess('Profile saved successfully');

                setTimeout(() => {
                    setSuccess(undefined);
                }, 5000);
            } catch (err) {
                setError(
                    err.message || 'An error occured saving your profile. Please try again later.'
                );
            }
        },
        [
            enableGravatar,
            keywordSettings,
            promptDupes,
            promptedActionWindows,
            saveProfile,
            selectedBackground,
            selectedCardSize,
            timerSettings,
            user,
            windowTimer
        ]
    );

    const onUpdateAvatarClick = useCallback(
        async (event) => {
            event.preventDefault();

            try {
                await updateAvatar(user.username).unwrap();
                toastr.success('Avatar updated successfully');

                setTimeout(() => {
                    toastr.clean();
                }, 5000);
            } catch (err) {
                toastr.error(
                    err.message || 'An error occured updating your avatar Please try again later.'
                );
            }
        },
        [updateAvatar, user?.username]
    );

    const onUnlinkClick = useCallback(async () => {
        try {
            await unlinkPatreon().unwrap();
            toastr.success('Patreon unlinked successfully');

            setTimeout(() => {
                toastr.clean();
            }, 5000);
        } catch (err) {
            toastr.error(
                err.message || 'An error occured unlinking from Patreon. Please try again later.'
            );
        }
    }, [unlinkPatreon]);

    const onSlideStop = (event) => {
        let value = parseInt(event.target.value);

        if (isNaN(value)) {
            return;
        }

        if (value < 0) {
            value = 0;
        }

        if (value > 10) {
            value = 10;
        }

        setWindowTimer(value);
    };

    const onTimerSettingToggle = useCallback(
        (field, event) => {
            let newTimerSettings = { ...timerSettings };

            newTimerSettings[field] = event.target.checked;

            setTimerSettings(newTimerSettings);
        },
        [timerSettings]
    );

    const onKeywordSettingToggle = useCallback(
        (field, event) => {
            let newKeywordSettings = { ...keywordSettings };

            newKeywordSettings[field] = event.target.checked;

            setKeywordSettings(newKeywordSettings);
        },
        [keywordSettings]
    );

    const isPatreonLinked = useMemo(
        () => user && ['linked', 'pledged'].includes(user.patreon),
        [user]
    );

    if (!user) {
        return <AlertPanel type='error' message='You must be logged in to update your profile' />;
    }

    let initialValues = { email: user.email };
    let callbackUrl =
        import.meta.env.MODE === 'production'
            ? 'https://theironthrone.net/patreon'
            : 'http://localhost:8080/patreon';

    return (
        <div className='col-sm-8 col-sm-offset-2 profile full-height'>
            <div className='about-container'>
                {success && <AlertPanel type='success' message={success} />}
                {error && <AlertPanel type='error' message={error} />}

                <Form
                    panelTitle='Profile'
                    name='profile'
                    initialValues={initialValues}
                    apiLoading={isLoading}
                    buttonClass='col-sm-offset-10 col-sm-2'
                    buttonText='Save'
                    onSubmit={onSaveClick}
                >
                    <span className='col-sm-3 text-center'>
                        <Avatar username={user.username} />
                    </span>
                    <Checkbox
                        name='enableGravatar'
                        label='Enable Gravatar integration'
                        fieldClass='col-sm-offset-1 col-sm-7'
                        onChange={(e) => setEnableGravatar(e.target.checked)}
                        checked={enableGravatar}
                    />
                    <div className='col-sm-3 text-center'>Current profile picture</div>
                    <button
                        type='button'
                        className='btn btn-default col-sm-offset-1 col-sm-3'
                        onClick={onUpdateAvatarClick}
                    >
                        Update avatar {avatarLoading && <span className='spinner button-spinner' />}
                    </button>
                    {!isPatreonLinked && (
                        <a
                            className='btn btn-default col-sm-offset-1 col-sm-3'
                            href={`https://www.patreon.com/oauth2/authorize?response_type=code&client_id=317bxGpXD7sAOlyFKp6D-LOBRX731lLK-2YYQSFfBmJCrVSiJI77eUgRoLoN2KoI&redirect_uri=${callbackUrl}`}
                        >
                            <img src='/img/Patreon_Mark_Coral.jpg' style={{ height: '21px' }} />
                            &nbsp;Link Patreon account
                        </a>
                    )}
                    {isPatreonLinked && (
                        <button
                            type='button'
                            className='btn btn-default col-sm-offset-1 col-sm-3'
                            onClick={onUnlinkClick}
                        >
                            Unlink Patreon account{' '}
                            {unlinkLoading && <span className='spinner button-spinner' />}
                        </button>
                    )}
                    <div className='col-sm-12 profile-inner'>
                        <Panel title='Action window defaults'>
                            <p className='help-block small'>
                                If an option is selected here, you will always be prompted if you
                                want to take an action in that window. If an option is not selected,
                                you will receive no prompts for that window. For some windows (e.g.
                                dominance) this could mean the whole window is skipped.
                            </p>
                            <div className='form-group'>{retWindows}</div>
                        </Panel>
                        <Panel title='Timed Interrupt Window'>
                            <p className='help-block small'>
                                Every time a game event occurs that you could possibly interrupt to
                                cancel it, a timer will count down. At the end of that timer, the
                                window will automatically pass. This option controls the duration of
                                the timer. The timer can be configure to show when events are played
                                (useful if you play cards like The Hand&apos;s Judgement) and to
                                show when card abilities are triggered (useful if you play a lot of
                                Treachery).
                            </p>
                            <div className='form-group'>
                                <label className='col-xs-3 control-label'>Window timeout</label>
                                <div className='col-xs-5 control-label'>
                                    <RangeSlider
                                        value={windowTimer}
                                        onChange={onSlideStop}
                                        step={1}
                                        max={10}
                                        min={0}
                                    />
                                </div>
                                <div className='col-xs-2'>
                                    <input
                                        className='form-control text-center'
                                        name='timer'
                                        value={windowTimer}
                                        onChange={onSlideStop}
                                    />
                                </div>
                                <label className='col-xs-2 control-label text-left no-padding'>
                                    seconds
                                </label>
                            </div>
                            <div className='form-group'>
                                <Checkbox
                                    name='timerSettings.events'
                                    noGroup
                                    label={'Show timer for events'}
                                    fieldClass='col-sm-6'
                                    onChange={(event) => onTimerSettingToggle('events', event)}
                                    checked={timerSettings.events}
                                />
                                <Checkbox
                                    name='timerSettings.abilities'
                                    noGroup
                                    label={'Show timer for card abilities'}
                                    fieldClass='col-sm-6'
                                    onChange={(event) => onTimerSettingToggle('abilities', event)}
                                    checked={timerSettings.abilities}
                                />
                            </div>
                        </Panel>
                        <Panel title='Game Settings'>
                            <div className='form-group'>
                                <Checkbox
                                    name='keywordSettings.chooseOrder'
                                    noGroup
                                    label={'Choose order of keywords'}
                                    fieldClass='col-sm-6'
                                    onChange={(event) =>
                                        onKeywordSettingToggle('chooseOrder', event)
                                    }
                                    checked={keywordSettings.chooseOrder}
                                />
                                <Checkbox
                                    name='keywordSettings.chooseCards'
                                    noGroup
                                    label={'Make keywords optional'}
                                    fieldClass='col-sm-6'
                                    onChange={(event) =>
                                        onKeywordSettingToggle('chooseCards', event)
                                    }
                                    checked={keywordSettings.chooseCards}
                                />
                                <Checkbox
                                    name='promptDupes'
                                    noGroup
                                    label={'Prompt before using dupes to save'}
                                    fieldClass='col-sm-6'
                                    onChange={(event) => setPromptDupes(event.target.checked)}
                                    checked={promptDupes}
                                />
                            </div>
                        </Panel>
                    </div>
                    <div className='col-sm-12'>
                        <Panel title='Game Board Background'>
                            <div className='row'>
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
                    </div>
                    <div className='col-sm-12'>
                        <Panel title='Card Image Size'>
                            <div className='row'>
                                <div className='col-xs-12'>
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
                            </div>
                        </Panel>
                    </div>
                </Form>
            </div>
        </div>
    );
};

export default Profile;
