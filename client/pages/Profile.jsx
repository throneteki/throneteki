import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Slider from 'react-bootstrap-slider';

import AlertPanel from '../Components/Site/AlertPanel';
import ApiStatus from '../Components/Site/ApiStatus';
import Panel from '../Components/Site/Panel';
import Form from '../Components/Form/Form';
import Checkbox from '../Components/Form/Checkbox';
import CardSizeOption from '../Components/Profile/CardSizeOption';
import GameBackgroundOption from '../Components/Profile/GameBackgroundOption';
import * as actions from '../actions';
import Avatar from '../Components/Site/Avatar';

class Profile extends React.Component {
    constructor(props) {
        super(props);

        this.handleSelectBackground = this.handleSelectBackground.bind(this);
        this.handleSelectCardSize = this.handleSelectCardSize.bind(this);
        this.onUpdateAvatarClick = this.onUpdateAvatarClick.bind(this);
        this.onSaveClick = this.onSaveClick.bind(this);
        this.onUnlinkClick = this.onUnlinkClick.bind(this);

        this.state = {
            newPassword: '',
            newPasswordAgain: '',
            successMessage: '',
            promptDupes: false,
            timerSettings: {},
            keywordSettings: {}
        };

        this.backgrounds = [
            { name: 'none', label: 'None', imageUrl: 'img/blank.png' },
            { name: 'BG1', label: 'Standard', imageUrl: 'img/background.png' },
            { name: 'BG2', label: 'Winter', imageUrl: 'img/background3.png' }
        ];

        this.cardSizes = [
            { name: 'small', label: 'Small' },
            { name: 'normal', label: 'Normal' },
            { name: 'large', label: 'Large' },
            { name: 'x-large', label: 'Extra-Large' }
        ];

        this.windows = [
            { name: 'plot', label: 'Plots revealed', style: 'col-sm-4' },
            { name: 'draw', label: 'Draw phase', style: 'col-sm-4' },
            { name: 'challengeBegin', label: 'Before challenge', style: 'col-sm-4' },
            { name: 'attackersDeclared', label: 'Attackers declared', style: 'col-sm-4' },
            { name: 'defendersDeclared', label: 'Defenders declared', style: 'col-sm-4' },
            { name: 'dominance', label: 'Dominance phase', style: 'col-sm-4' },
            { name: 'standing', label: 'Standing phase', style: 'col-sm-4' },
            { name: 'taxation', label: 'Taxation phase', style: 'col-sm-4' }
        ];

        if (!this.props.user) {
            return;
        }
    }

    componentDidMount() {
        this.updateProfile(this.props);
    }

    componentWillReceiveProps(props) {
        if (!props.user) {
            return;
        }

        // If we haven't previously got any user details, then the api probably just returned now, so set the initial user details
        if (!this.state.promptedActionWindows) {
            this.updateProfile(props);
        }

        if (props.profileSaved) {
            this.setState({
                successMessage:
                    'Profile saved successfully.  Please note settings changed here may only apply at the start of your next game.'
            });

            this.updateProfile(props);

            setTimeout(() => {
                this.setState({ successMessage: undefined });
            }, 5000);
        }
    }

    updateProfile(props) {
        if (!props.user) {
            return;
        }

        this.setState({
            email: props.user.email,
            enableGravatar: props.user.enableGravatar,
            promptedActionWindows: props.user.promptedActionWindows,
            promptDupes: props.user.settings.promptDupes,
            windowTimer: props.user.settings.windowTimer,
            timerSettings: props.user.settings.timerSettings,
            keywordSettings: props.user.settings.keywordSettings,
            selectedBackground: props.user.settings.background,
            selectedCardSize: props.user.settings.cardSize
        });
    }

    onChange(field, event) {
        var newState = {};

        newState[field] = event.target.value;
        this.setState(newState);
    }

    onToggle(field, event) {
        var newState = {};

        newState[field] = event.target.checked;
        this.setState(newState);
    }

    onWindowToggle(field, event) {
        var newState = {};
        newState.promptedActionWindows = this.state.promptedActionWindows;

        newState.promptedActionWindows[field] = event.target.checked;
        this.setState(newState);
    }

    onTimerSettingToggle(field, event) {
        var newState = {};
        newState.timerSettings = this.state.timerSettings;

        newState.timerSettings[field] = event.target.checked;
        this.setState(newState);
    }

    onKeywordSettingToggle(field, event) {
        var newState = {};
        newState.keywordSettings = this.state.keywordSettings;

        newState.keywordSettings[field] = event.target.checked;
        this.setState(newState);
    }

    onSaveClick() {
        this.setState({ successMessage: undefined });

        document.getElementsByClassName('wrapper')[0].scrollTop = 0;

        this.props.saveProfile(this.props.user.username, {
            email: this.state.email,
            password: this.state.newPassword,
            promptedActionWindows: this.state.promptedActionWindows,
            enableGravatar: this.state.enableGravatar,
            settings: {
                promptDupes: this.state.promptDupes,
                windowTimer: this.state.windowTimer,
                keywordSettings: this.state.keywordSettings,
                timerSettings: this.state.timerSettings,
                background: this.state.selectedBackground,
                cardSize: this.state.selectedCardSize
            }
        });
    }

    onSlideStop(event) {
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

        this.setState({ windowTimer: value });
    }

    handleSelectBackground(background) {
        this.setState({ selectedBackground: background });
    }

    handleSelectCardSize(size) {
        this.setState({ selectedCardSize: size });
    }

    onUpdateAvatarClick(event) {
        event.preventDefault();

        this.props.updateAvatar(this.props.user.username);
    }

    onUnlinkClick() {
        this.props.unlinkPatreon();
    }

    isPatreonLinked() {
        return ['linked', 'pledged'].includes(this.props.user.patreon);
    }

    render() {
        if (!this.props.user || !this.state.promptedActionWindows) {
            return (
                <AlertPanel type='error' message='You must be logged in to update your profile' />
            );
        }

        let windows = this.windows.map((window) => {
            return (
                <Checkbox
                    key={window.name}
                    noGroup
                    name={'promptedActionWindows.' + window.name}
                    label={window.label}
                    fieldClass={window.style}
                    type='checkbox'
                    onChange={this.onWindowToggle.bind(this, window.name)}
                    checked={this.state.promptedActionWindows[window.name]}
                />
            );
        });

        if (this.props.profileSaved) {
            setTimeout(() => {
                this.props.clearProfileStatus();
            }, 5000);
        }

        let initialValues = { email: this.props.user.email };
        let callbackUrl =
            import.meta.env.NODE_ENV === 'production'
                ? 'https://theironthrone.net/patreon'
                : 'http://localhost:8080/patreon';

        return (
            <div className='col-sm-8 col-sm-offset-2 profile full-height'>
                <div className='about-container'>
                    <ApiStatus
                        apiState={this.props.apiState}
                        successMessage={this.state.successMessage}
                    />

                    <Form
                        panelTitle='Profile'
                        name='profile'
                        initialValues={initialValues}
                        apiLoading={this.props.apiState && this.props.apiState.loading}
                        buttonClass='col-sm-offset-10 col-sm-2'
                        buttonText='Save'
                        onSubmit={this.onSaveClick}
                    >
                        <span className='col-sm-3 text-center'>
                            <Avatar username={this.props.user.username} />
                        </span>
                        <Checkbox
                            name='enableGravatar'
                            label='Enable Gravatar integration'
                            fieldClass='col-sm-offset-1 col-sm-7'
                            onChange={(e) => this.setState({ enableGravatar: e.target.checked })}
                            checked={this.state.enableGravatar}
                        />
                        <div className='col-sm-3 text-center'>Current profile picture</div>
                        <button
                            type='button'
                            className='btn btn-default col-sm-offset-1 col-sm-3'
                            onClick={this.onUpdateAvatarClick}
                        >
                            Update avatar
                        </button>
                        {!this.isPatreonLinked() && (
                            <a
                                className='btn btn-default col-sm-offset-1 col-sm-3'
                                href={`https://www.patreon.com/oauth2/authorize?response_type=code&client_id=317bxGpXD7sAOlyFKp6D-LOBRX731lLK-2YYQSFfBmJCrVSiJI77eUgRoLoN2KoI&redirect_uri=${callbackUrl}`}
                            >
                                <img src='/img/Patreon_Mark_Coral.jpg' style={{ height: '21px' }} />
                                &nbsp;Link Patreon account
                            </a>
                        )}
                        {this.isPatreonLinked() && (
                            <button
                                type='button'
                                className='btn btn-default col-sm-offset-1 col-sm-3'
                                onClick={this.onUnlinkClick}
                            >
                                Unlink Patreon account
                            </button>
                        )}
                        <div className='col-sm-12 profile-inner'>
                            <Panel title='Action window defaults'>
                                <p className='help-block small'>
                                    If an option is selected here, you will always be prompted if
                                    you want to take an action in that window. If an option is not
                                    selected, you will receive no prompts for that window. For some
                                    windows (e.g. dominance) this could mean the whole window is
                                    skipped.
                                </p>
                                <div className='form-group'>{windows}</div>
                            </Panel>
                            <Panel title='Timed Interrupt Window'>
                                <p className='help-block small'>
                                    Every time a game event occurs that you could possibly interrupt
                                    to cancel it, a timer will count down. At the end of that timer,
                                    the window will automatically pass. This option controls the
                                    duration of the timer. The timer can be configure to show when
                                    events are played (useful if you play cards like The Hand's
                                    Judgement) and to show when card abilities are triggered (useful
                                    if you play a lot of Treachery).
                                </p>
                                <div className='form-group'>
                                    <label className='col-xs-3 control-label'>Window timeout</label>
                                    <div className='col-xs-5 control-label'>
                                        <Slider
                                            value={this.state.windowTimer}
                                            slideStop={this.onSlideStop.bind(this)}
                                            step={1}
                                            max={10}
                                            min={0}
                                        />
                                    </div>
                                    <div className='col-xs-2'>
                                        <input
                                            className='form-control text-center'
                                            name='timer'
                                            value={this.state.windowTimer}
                                            onChange={this.onSlideStop.bind(this)}
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
                                        onChange={this.onTimerSettingToggle.bind(this, 'events')}
                                        checked={this.state.timerSettings.events}
                                    />
                                    <Checkbox
                                        name='timerSettings.abilities'
                                        noGroup
                                        label={'Show timer for card abilities'}
                                        fieldClass='col-sm-6'
                                        onChange={this.onTimerSettingToggle.bind(this, 'abilities')}
                                        checked={this.state.timerSettings.abilities}
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
                                        onChange={this.onKeywordSettingToggle.bind(
                                            this,
                                            'chooseOrder'
                                        )}
                                        checked={this.state.keywordSettings.chooseOrder}
                                    />
                                    <Checkbox
                                        name='keywordSettings.chooseCards'
                                        noGroup
                                        label={'Make keywords optional'}
                                        fieldClass='col-sm-6'
                                        onChange={this.onKeywordSettingToggle.bind(
                                            this,
                                            'chooseCards'
                                        )}
                                        checked={this.state.keywordSettings.chooseCards}
                                    />
                                    <Checkbox
                                        name='promptDupes'
                                        noGroup
                                        label={'Prompt before using dupes to save'}
                                        fieldClass='col-sm-6'
                                        onChange={this.onToggle.bind(this, 'promptDupes')}
                                        checked={this.state.promptDupes}
                                    />
                                </div>
                            </Panel>
                        </div>
                        <div className='col-sm-12'>
                            <Panel title='Game Board Background'>
                                <div className='row'>
                                    {this.backgrounds.map((background) => (
                                        <GameBackgroundOption
                                            imageUrl={background.imageUrl}
                                            key={background.name}
                                            label={background.label}
                                            name={background.name}
                                            onSelect={this.handleSelectBackground}
                                            selected={
                                                this.state.selectedBackground === background.name
                                            }
                                        />
                                    ))}
                                </div>
                            </Panel>
                        </div>
                        <div className='col-sm-12'>
                            <Panel title='Card Image Size'>
                                <div className='row'>
                                    <div className='col-xs-12'>
                                        {this.cardSizes.map((cardSize) => (
                                            <CardSizeOption
                                                key={cardSize.name}
                                                label={cardSize.label}
                                                name={cardSize.name}
                                                onSelect={this.handleSelectCardSize}
                                                selected={
                                                    this.state.selectedCardSize === cardSize.name
                                                }
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
    }
}

Profile.displayName = 'Profile';
Profile.propTypes = {
    apiState: PropTypes.object,
    clearProfileStatus: PropTypes.func,
    profileSaved: PropTypes.bool,
    refreshUser: PropTypes.func,
    saveProfile: PropTypes.func,
    socket: PropTypes.object,
    unlinkPatreon: PropTypes.func,
    updateAvatar: PropTypes.func,
    user: PropTypes.object
};

function mapStateToProps(state) {
    return {
        apiState: state.api.SAVE_PROFILE,
        profileSaved: state.user.profileSaved,
        socket: state.lobby.socket,
        user: state.account.user
    };
}

export default connect(mapStateToProps, actions)(Profile);
