import React from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore';
import $ from 'jquery';
import { connect } from 'react-redux';

import AlertPanel from './SiteComponents/AlertPanel';
import Panel from './SiteComponents/Panel';
import Input from './FormComponents/Input';
import Checkbox from './FormComponents/Checkbox';
import Slider from 'react-bootstrap-slider';

import * as actions from './actions';

class InnerProfile extends React.Component {
    constructor(props) {
        super(props);

        if(!this.props.user) {
            return;
        }

        this.state = {
            disableGravatar: this.props.user.settings.disableGravatar,
            email: this.props.user.email,
            loading: false,
            newPassword: '',
            newPasswordAgain: '',
            promptedActionWindows: this.props.user.promptedActionWindows,
            validation: {},
            windowTimer: this.props.user.settings.windowTimer,
            keywordSettings: this.props.user.settings.keywordSettings,
            timerSettings: this.props.user.settings.timerSettings,
            selectedBackground: this.props.user.settings.background,
            selectedCardSize: this.props.user.settings.cardSize
        };

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
    }

    componentWillReceiveProps(props) {
        if(!props.user) {
            return;
        }

        this.setState({
            email: props.user.email,
            disableGravatar: props.user.settings.disableGravatar,
            promptedActionWindows: props.user.promptedActionWindows
        });
    }

    onChange(field, event) {
        var newState = {};

        newState[field] = event.target.value;
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

    onSaveClick(event) {
        event.preventDefault();

        this.setState({ errorMessage: undefined, successMessage: undefined });

        this.verifyEmail();
        this.verifyPassword(true);

        if(_.any(this.state.validation, function(message) {
            return message && message !== '';
        })) {
            this.setState({ errorMessage: 'There was an error in one or more fields, please see below, correct the error and try again' });
            return;
        }

        this.setState({ loading: true });

        $.ajax('/api/account/' + this.props.user.username,
            {
                method: 'PUT',
                data: {
                    data: JSON.stringify({
                        email: this.state.email,
                        password: this.state.newPassword,
                        promptedActionWindows: this.state.promptedActionWindows,
                        settings: {
                            disableGravatar: this.state.disableGravatar,
                            windowTimer: this.state.windowTimer,
                            keywordSettings: this.state.keywordSettings,
                            timerSettings: this.state.timerSettings,
                            background: this.state.selectedBackground,
                            cardSize: this.state.selectedCardSize
                        }
                    })
                }
            })
            .done((data) => {
                if(data.success) {
                    this.setState({ successMessage: 'Profile saved successfully.  Please note settings changed here will only apply at the start of your next game' });

                    this.props.socket.emit('authenticate', data.token);
                    this.props.refreshUser(data.user, data.token);
                } else {
                    this.setState({ errorMessage: data.message });
                }
            })
            .always(() => {
                this.setState({ loading: false });
            });
    }

    verifyPassword(isSubmitting) {
        var validation = this.state.validation;

        delete validation['password'];

        if(!this.state.newPassword && !this.state.newPasswordAgain) {
            return;
        }

        if(this.state.newPassword.length < 6) {
            validation['password'] = 'The password you specify must be at least 6 characters long';
        }

        if(isSubmitting && !this.state.newPasswordAgain) {
            validation['password'] = 'Please enter your password again';
        }

        if(this.state.newPassword && this.state.newPasswordAgain && this.state.newPassword !== this.state.newPasswordAgain) {
            validation['password'] = 'The passwords you have specified do not match';
        }

        this.setState({ validation: validation });
    }

    verifyEmail() {
        var validation = this.state.validation;

        delete validation['email'];

        if(!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(this.state.email)) {
            validation['email'] = 'Please enter a valid email address';
        }

        this.setState({ validation: validation });
    }

    onSlideStop(event) {
        let value = parseInt(event.target.value);

        if(_.isNaN(value)) {
            return;
        }

        if(value < 0) {
            value = 0;
        }

        if(value > 10) {
            value = 10;
        }

        this.setState({ windowTimer: value });
    }

    onBackgroundClick(background) {
        this.setState({ selectedBackground: background });
    }

    onCardClick(size) {
        this.setState({ selectedCardSize: size });
    }

    render() {
        if(!this.props.user) {
            return <AlertPanel type='error' message='You must be logged in to update your profile' />;
        }

        let windows = _.map(this.windows, window => {
            return (<Checkbox key={ window.name }
                noGroup
                name={ 'promptedActionWindows.' + window.name }
                label={ window.label }
                fieldClass={ window.style }
                type='checkbox'
                onChange={ (this.onWindowToggle.bind(this, window.name)) }
                checked={ this.state.promptedActionWindows[window.name] } />);
        });

        return (
            <div className='col-sm-8 col-sm-offset-2 profile full-height'>
                <div className='about-container'>
                    { this.state.errorMessage ? <AlertPanel type='error' message={ this.state.errorMessage } /> : null }
                    { this.state.successMessage ? <AlertPanel type='success' message={ this.state.successMessage } /> : null }
                    <form className='form form-horizontal'>
                        <Panel title='Profile'>
                            <Input name='email' label='Email Address' labelClass='col-sm-4' fieldClass='col-sm-8' placeholder='Enter email address'
                                type='text' onChange={ this.onChange.bind(this, 'email') } value={ this.state.email }
                                onBlur={ this.verifyEmail.bind(this) } validationMessage={ this.state.validation['email'] } />
                            <Input name='newPassword' label='New Password' labelClass='col-sm-4' fieldClass='col-sm-8' placeholder='Enter new password'
                                type='password' onChange={ this.onChange.bind(this, 'newPassword') } value={ this.state.newPassword }
                                onBlur={ this.verifyPassword.bind(this, false) } validationMessage={ this.state.validation['password'] } />
                            <Input name='newPasswordAgain' label='New Password (again)' labelClass='col-sm-4' fieldClass='col-sm-8' placeholder='Enter new password (again)'
                                type='password' onChange={ this.onChange.bind(this, 'newPasswordAgain') } value={ this.state.newPasswordAgain }
                                onBlur={ this.verifyPassword.bind(this, false) } validationMessage={ this.state.validation['password1'] } />
                            <Checkbox name='disableGravatar' label='Disable Gravatar integration' fieldClass='col-sm-offset-4 col-sm-8'
                                onChange={ e => this.setState({ disableGravatar: e.target.checked }) } checked={ this.state.disableGravatar } />
                        </Panel>
                        <div>
                            <Panel title='Action window defaults'>
                                <p className='help-block small'>If an option is selected here, you will always be prompted if you want to take an action in that window.  If an option is not selected, you will receive no prompts for that window.  For some windows (e.g. dominance) this could mean the whole window is skipped.</p>
                                <div className='form-group'>
                                    { windows }
                                </div>
                            </Panel>
                            <Panel title='Timed Interrupt Window'>
                                <p className='help-block small'>Every time a game event occurs that you could possibly interrupt to cancel it, a timer will count down.  At the end of that timer, the window will automatically pass.
                                This option controls the duration of the timer.  The timer can be configure to show when events are played (useful if you play cards like The Hand's Judgement) and to show when card abilities are triggered (useful if you play a lot of Treachery).</p>
                                <div className='form-group'>
                                    <label className='col-sm-3 control-label'>Window timeout</label>
                                    <div className='col-sm-5'>
                                        <Slider value={ this.state.windowTimer }
                                            slideStop={ this.onSlideStop.bind(this) }
                                            step={ 1 }
                                            max={ 10 }
                                            min={ 0 } />
                                    </div>
                                    <div className='col-sm-2'>
                                        <input className='form-control text-center' name='timer' value={ this.state.windowTimer } onChange={ this.onSlideStop.bind(this) } />
                                    </div>
                                    <label className='col-sm-1 control-label'>seconds</label>

                                    <Checkbox name='timerSettings.events' noGroup label={ 'Show timer for events' } fieldClass='col-sm-6'
                                        onChange={ this.onTimerSettingToggle.bind(this, 'events') } checked={ this.state.timerSettings.events } />
                                    <Checkbox name='timerSettings.abilities' noGroup label={ 'Show timer for card abilities' } fieldClass='col-sm-6'
                                        onChange={ this.onTimerSettingToggle.bind(this, 'abilities') } checked={ this.state.timerSettings.abilities } />
                                </div>
                            </Panel>
                            <Panel title='Keywords'>
                                <div className='form-group'>
                                    <Checkbox name='keywordSettings.chooseOrder' noGroup label={ 'Choose order of keywords' } fieldClass='col-sm-6'
                                        onChange={ this.onKeywordSettingToggle.bind(this, 'chooseOrder') } checked={ this.state.keywordSettings.chooseOrder } />
                                    <Checkbox name='keywordSettings.chooseCards' noGroup label={ 'Make keywords optional' } fieldClass='col-sm-6'
                                        onChange={ this.onKeywordSettingToggle.bind(this, 'chooseCards') } checked={ this.state.keywordSettings.chooseCards } />
                                </div>
                            </Panel>
                        </div>
                        <div>
                            <Panel title='Game Board Background'>
                                <div className='row'>
                                    <div className='col-sm-4' onClick={ () => this.onBackgroundClick('none') }>
                                        <img className={ 'img-responsive' + (this.state.selectedBackground === 'none' ? ' selected' : '') }
                                            src='img/blank.png' />
                                        <span className='bg-label'>None</span>
                                    </div>
                                    <div className='col-sm-4' onClick={ () => this.onBackgroundClick('BG1') }>
                                        <img className={ 'img-responsive' + (this.state.selectedBackground === 'BG1' ? ' selected' : '') }
                                            src='/img/background.png' />
                                        <span className='bg-label'>Standard</span>
                                    </div>
                                    <div className='col-sm-4' onClick={ () => this.onBackgroundClick('BG2') }>
                                        <img className={ 'img-responsive' + (this.state.selectedBackground === 'BG2' ? ' selected' : '') }
                                            src='img/background3.png' />
                                        <span className='bg-label'>Winter</span>
                                    </div>
                                </div>
                            </Panel>
                        </div>
                        <div>
                            <Panel title='Card Image Size'>
                                <div className='row'>
                                    <div className='col-xs-12'>
                                        <div className='card-settings' onClick={ () => this.onCardClick('small') }>
                                            <div className={ 'card small vertical' + (this.state.selectedCardSize === 'small' ? ' selected' : '') }>
                                                <img className='card small vertical'
                                                    src='img/cards/cardback.jpg' />
                                            </div>
                                            <span className='bg-label'>Small</span>
                                        </div>
                                        <div className='card-settings' onClick={ () => this.onCardClick('normal') }>
                                            <div className={ 'card vertical' + (this.state.selectedCardSize === 'normal' ? ' selected' : '') }>
                                                <img className='card vertical'
                                                    src='img/cards/cardback.jpg' />
                                            </div>
                                            <span className='bg-label'>Normal</span>
                                        </div>
                                        <div className='card-settings' onClick={ () => this.onCardClick('large') }>
                                            <div className={ 'card vertical large' + (this.state.selectedCardSize === 'large' ? ' selected' : '') } >
                                                <img className='card-image large vertical'
                                                    src='/img/cards/cardback.jpg' />
                                            </div>
                                            <span className='bg-label'>Large</span>
                                        </div>
                                        <div className='card-settings' onClick={ () => this.onCardClick('x-large') }>
                                            <div className={ 'card vertical x-large' + (this.state.selectedCardSize === 'x-large' ? ' selected' : '') }>
                                                <img className='card-image x-large vertical'
                                                    src='img/cards/cardback.jpg' />
                                            </div>
                                            <span className='bg-label'>Extra-Large</span>
                                        </div>
                                    </div>
                                </div>
                            </Panel>
                        </div>
                        <div className='col-sm-offset-10 col-sm-2'>
                            <button className='btn btn-primary' type='button' disabled={ this.state.loading } onClick={ this.onSaveClick.bind(this) }>Save</button>
                        </div>
                    </form>
                </div>
            </div>);
    }
}

InnerProfile.displayName = 'Profile';
InnerProfile.propTypes = {
    refreshUser: PropTypes.func,
    socket: PropTypes.object,
    user: PropTypes.object
};

function mapStateToProps(state) {
    return {
        socket: state.lobby.socket,
        user: state.auth.user
    };
}

const Profile = connect(mapStateToProps, actions)(InnerProfile);

export default Profile;
