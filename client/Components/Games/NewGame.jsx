import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Panel from '../Site/Panel';
import * as actions from '../../actions';
import AlertPanel from '../Site/AlertPanel';

import { cardSetLabel } from '../Decks/DeckHelper';

const GameNameMaxLength = 64;

class NewGame extends React.Component {
    constructor(props) {
        super(props);

        this.onCancelClick = this.onCancelClick.bind(this);
        this.onGamePrivateClick = this.onGamePrivateClick.bind(this);
        this.onSubmitClick = this.onSubmitClick.bind(this);
        this.onNameChange = this.onNameChange.bind(this);
        this.onEventChange = this.onEventChange.bind(this);
        this.onSpectatorsClick = this.onSpectatorsClick.bind(this);
        this.onShowHandClick = this.onShowHandClick.bind(this);
        this.onPasswordChange = this.onPasswordChange.bind(this);
        this.onUseGameTimeLimitClick = this.onUseGameTimeLimitClick.bind(this);
        this.onGameTimeLimitChange = this.onGameTimeLimitChange.bind(this);
        this.onMuteSpectatorsClick = this.onMuteSpectatorsClick.bind(this);
        this.onUseChessClocksClick = this.onUseChessClocksClick.bind(this);
        this.onChessClockTimeLimitChange = this.onChessClockTimeLimitChange.bind(this);
        this.onDelayToStartClockChange = this.onDelayToStartClockChange.bind(this);

        const defaultRestrictedList = props.restrictedLists.filter(rl => rl.official)[0];

        this.state = {
            selectedMode: `none:${defaultRestrictedList && defaultRestrictedList._id}`,
            eventId: 'none',
            restrictedListId: defaultRestrictedList && defaultRestrictedList._id,
            optionsLocked: false,
            spectators: true,
            showHand: false,
            selectedGameFormat: 'joust',
            selectedGameType: 'casual',
            password: '',
            gamePrivate: false,
            useGameTimeLimit: false,
            gameTimeLimit: 55,
            muteSpectators: false,
            useChessClocks: false,
            chessClockTimeLimit: 30,
            delayToStartClock: 5,
            tableType: 'game'
        };
    }

    componentWillMount() {
        this.props.loadEvents();
        this.setState({ gameName: this.props.defaultGameName });
    }

    onCancelClick(event) {
        event.preventDefault();

        this.props.cancelNewGame();
    }

    onNameChange(event) {
        this.setState({ gameName: event.target.value });
    }

    onEventChange(event) {
        const selectedValues = event.target.value.split(':');
        const eventId = selectedValues[0] || 'none';
        const restrictedListId = selectedValues[1] || '';

        this.setState({ eventId, restrictedListId, selectedMode: event.target.value, tableType: 'game' });

        //set game options when the selected event uses event specific options
        //find the corresponding event
        const { events } = this.props;
        let selectedEvent = events.find(e => {
            return e._id === event.target.value;
        });
        //unlock game options in case they were locked before
        this.setState({ optionsLocked: false });
        if(selectedEvent && selectedEvent.useEventGameOptions) {
            //if the selectedEvent uses event game options, lock and set the options
            this.setState({ optionsLocked: true });
            if(selectedEvent.eventGameOptions.spectators !== undefined) {
                this.setState({ spectators: selectedEvent.eventGameOptions.spectators });
            }
            if(selectedEvent.eventGameOptions.muteSpectators !== undefined) {
                this.setState({ muteSpectators: selectedEvent.eventGameOptions.muteSpectators });
            }
            if(selectedEvent.eventGameOptions.showHand !== undefined) {
                this.setState({ showHand: selectedEvent.eventGameOptions.showHand });
            }
            if(selectedEvent.eventGameOptions.useGameTimeLimit !== undefined) {
                this.setState({ useGameTimeLimit: selectedEvent.eventGameOptions.useGameTimeLimit });
            }
            if(selectedEvent.eventGameOptions.gameTimeLimit !== undefined) {
                this.setState({ gameTimeLimit: selectedEvent.eventGameOptions.gameTimeLimit });
            }
            if(selectedEvent.eventGameOptions.useChessClocks !== undefined) {
                this.setState({ useChessClocks: selectedEvent.eventGameOptions.useChessClocks });
            }
            if(selectedEvent.eventGameOptions.chessClockTimeLimit !== undefined) {
                this.setState({ chessClockTimeLimit: selectedEvent.eventGameOptions.chessClockTimeLimit });
            }
            if(selectedEvent.eventGameOptions.delayToStartClock !== undefined) {
                this.setState({ delayToStartClock: selectedEvent.eventGameOptions.delayToStartClock });
            }
            if(selectedEvent.eventGameOptions.password !== undefined) {
                this.setState({ password: selectedEvent.eventGameOptions.password });
            }
            this.setState({ selectedGameType: 'competitive' });
        }
    }

    onPasswordChange(event) {
        this.setState({ password: event.target.value });
    }

    onSpectatorsClick(event) {
        this.setState({ spectators: event.target.checked });
    }

    onGamePrivateClick(event) {
        this.setState({ gamePrivate: event.target.checked });
    }

    onShowHandClick(event) {
        this.setState({ showHand: event.target.checked });
    }

    onMuteSpectatorsClick(event) {
        this.setState({ muteSpectators: event.target.checked });
    }

    onUseChessClocksClick(event) {
        this.setState({ useChessClocks: event.target.checked });
        //deactivate other timeLimit when chessClocks are used
        if(event.target.checked) {
            this.setState({ useGameTimeLimit: false });
        }
    }

    onChessClockTimeLimitChange(event) {
        this.setState({ chessClockTimeLimit: event.target.value });
    }

    onDelayToStartClockChange(event) {
        this.setState({ delayToStartClock: event.target.value });
    }

    onSubmitClick(event) {
        event.preventDefault();

        this.props.socket.emit('newgame', {
            name: this.state.gameName,
            eventId: this.state.eventId,
            restrictedListId: this.state.restrictedListId,
            spectators: this.state.spectators,
            showHand: this.state.showHand,
            gameType: this.state.selectedGameType,
            isMelee: this.state.selectedGameFormat === 'melee',
            password: this.state.password,
            gamePrivate: this.state.gamePrivate,
            quickJoin: this.props.quickJoin,
            useGameTimeLimit: this.state.useGameTimeLimit,
            gameTimeLimit: this.state.gameTimeLimit,
            muteSpectators: this.state.muteSpectators,
            useChessClocks: this.state.useChessClocks,
            chessClockTimeLimit: this.state.chessClockTimeLimit,
            delayToStartClock: this.state.delayToStartClock,
            tableType: this.state.tableType
        });
    }

    onRadioChange({ key, value }) {
        this.setState({ [key]: value });
    }

    onGameFormatChange(format) {
        this.setState({ selectedGameFormat: format });
    }

    onUseGameTimeLimitClick(event) {
        this.setState({ useGameTimeLimit: event.target.checked });
        //deactivate other timeLimit when chessClocks are used
        if(event.target.checked) {
            this.setState({ useChessClocks: false });
        }
    }

    onGameTimeLimitChange(event) {
        this.setState({ gameTimeLimit: event.target.value });
    }

    isGameTypeSelected(gameType) {
        return this.state.selectedGameType === gameType;
    }

    getOptions() {
        if(this.state.tableType !== 'game') {
            return;
        }

        return (<div className='row'>
            <div className='checkbox col-sm-8'>
                <label>
                    <input type='checkbox' onChange={ this.onSpectatorsClick } checked={ this.state.spectators } disabled={ this.state.optionsLocked } />
                    Allow spectators
                </label>
            </div>
            { this.state.spectators && <div className='checkbox col-sm-8'>
                <label>
                    <input type='checkbox' onChange={ this.onMuteSpectatorsClick } checked={ this.state.muteSpectators } disabled={ this.state.optionsLocked }/>
                    Mute spectators
                </label>
            </div> }
            <div className='checkbox col-sm-8'>
                <label>
                    <input type='checkbox' onChange={ this.onShowHandClick } checked={ this.state.showHand } disabled={ this.state.optionsLocked }/>
                    Show hands to spectators
                </label>
            </div>
            <div className='checkbox col-sm-12'>
                <label>
                    <input type='checkbox' onChange={ this.onUseGameTimeLimitClick } checked={ this.state.useGameTimeLimit } disabled={ this.state.optionsLocked }/>
                    Use a time limit (in minutes)
                </label>
            </div>
            { this.state.useGameTimeLimit && <div className='col-sm-4'>
                <input className='form-control' type='number' onChange={ this.onGameTimeLimitChange } value={ this.state.gameTimeLimit } disabled={ this.state.optionsLocked }/>
            </div> }
            <div className='checkbox col-sm-12'>
                <label>
                    <input type='checkbox' onChange={ this.onUseChessClocksClick } checked={ this.state.useChessClocks } disabled={ this.state.optionsLocked }/>
                    Use chess clocks
                </label>
            </div>
            { this.state.useChessClocks && <div className='col-sm-6'>
                <label>Time limit per player (in minutes)</label>
                <input className='form-control' type='number' onChange={ this.onChessClockTimeLimitChange } value={ this.state.chessClockTimeLimit } disabled={ this.state.optionsLocked }/>
                <label>Delay to start the clock (in seconds)</label>
                <input className='form-control' type='number' onChange={ this.onDelayToStartClockChange } value={ this.state.delayToStartClock } disabled={ this.state.optionsLocked }/>
            </div> }
        </div>);
    }

    getMeleeOptions() {
        if(!this.props.allowMelee) {
            return;
        }

        return (
            <div className='row'>
                <div className='col-sm-12'>
                    <b>Game Format</b>
                </div>
                <div className='col-sm-10'>
                    <label className='radio-inline'>
                        <input type='radio' onChange={ this.onGameFormatChange.bind(this, 'joust') } checked={ this.state.selectedGameFormat === 'joust' } />
                        Joust
                    </label>
                    <label className='radio-inline'>
                        <input type='radio' onChange={ this.onGameFormatChange.bind(this, 'melee') } checked={ this.state.selectedGameFormat === 'melee' } />
                        Melee
                    </label>
                </div>
            </div>
        );
    }

    getGameTypeOptions() {
        if(this.state.tableType !== 'game') {
            return;
        }

        return (
            <div className='row'>
                <div className='col-sm-12 game-type'>
                    <b>Game Type</b>
                </div>
                <div className='col-sm-10'>
                    <label className='radio-inline'>
                        <input type='radio' onChange={ this.onRadioChange.bind(this, { key: 'selectedGameType', value: 'beginner' }) } checked={ this.isGameTypeSelected('beginner') } disabled={ this.state.optionsLocked }/>
                        Beginner
                    </label>
                    <label className='radio-inline'>
                        <input type='radio' onChange={ this.onRadioChange.bind(this, { key: 'selectedGameType', value: 'casual' }) } checked={ this.isGameTypeSelected('casual') } disabled={ this.state.optionsLocked }/>
                        Casual
                    </label>
                    <label className='radio-inline'>
                        <input type='radio' onChange={ this.onRadioChange.bind(this, { key: 'selectedGameType', value: 'competitive' }) } checked={ this.isGameTypeSelected('competitive') } disabled={ this.state.optionsLocked } />
                        Competitive
                    </label>
                </div>
            </div>);
    }

    getEventSelection() {
        const { events, restrictedLists, user } = this.props;

        const allowedEvents = events.filter(event => user.permissions.canManageGames || !event.restrictTableCreators || event.validTableCreators && event.validTableCreators.includes(user.username));

        return (
            <div className='row'>
                <div className='col-sm-8'>
                    <label htmlFor='gameName'>Mode</label>
                    <select className='form-control' value={ this.state.selectedMode } onChange={ this.onEventChange }>
                        { restrictedLists.filter(rl => rl.official).map(rl => (<option value={ `none:${rl._id}` }>{ `${cardSetLabel(rl.cardSet)}` }</option>)) }
                        { allowedEvents.map(event => (<option value={ event._id }>Event - { event.name }</option>)) }
                    </select>
                </div>
            </div>
        );
    }

    getTableType() {
        const { events } = this.props;
        const selectedEvent = events.find(event => event._id === this.state.eventId);

        if(!selectedEvent || selectedEvent.format !== 'draft') {
            return;
        }

        return (
            <div className='row'>
                <div className='col-sm-12 game-type'>
                    <b>Table Type</b>
                </div>
                <div className='col-sm-10'>
                    <label className='radio-inline'>
                        <input type='radio' onChange={ this.onRadioChange.bind(this, { key: 'tableType', value: 'game' }) } checked={ this.state.tableType === 'game' } />
                        Game
                    </label>
                    <label className='radio-inline'>
                        <input type='radio' onChange={ this.onRadioChange.bind(this, { key: 'tableType', value: 'drafting-table' }) } checked={ this.state.tableType === 'drafting-table' } />
                        Drafting Table
                    </label>
                </div>
            </div>
        );
    }

    render() {
        let charsLeft = GameNameMaxLength - this.state.gameName.length;
        let content = [];

        if(!this.props.events || !this.props.restrictedLists) {
            return <div>Loading...</div>;
        }

        if(this.props.quickJoin) {
            content =
                (<div>
                    <AlertPanel type='info' message="Select the type of game you'd like to play and either you'll join the next one available, or one will be created for you with default options." />
                    { this.getMeleeOptions() }
                    { this.getGameTypeOptions() }
                </div>);
        } else {
            content = (<div>
                <div className='row'>
                    <div className='col-sm-8'>
                        <label htmlFor='gameName'>Name</label>
                        <label className='game-name-char-limit'>{ charsLeft >= 0 ? charsLeft : 0 }</label>
                        <input className='form-control' placeholder='Game Name' type='text' onChange={ this.onNameChange } value={ this.state.gameName } maxLength={ GameNameMaxLength } />
                    </div>
                </div>
                { this.getEventSelection() }
                { this.getTableType() }
                { this.getOptions() }
                { this.getMeleeOptions() }
                { this.getGameTypeOptions() }
                <div className='row'>
                    <div className='checkbox col-sm-8'>
                        <label>
                            <input type='checkbox' onChange={ this.onGamePrivateClick } checked={ this.state.gamePrivate } disabled={ this.state.optionsLocked } />
                            Private (requires game link)
                        </label>
                    </div>
                </div>
                <div className='row game-password'>
                    <div className='col-sm-8'>
                        <label>Password</label>
                        <input className='form-control' type='password' onChange={ this.onPasswordChange } value={ this.state.password } disabled={ this.state.optionsLocked }/>
                    </div>
                </div>
            </div>);
        }

        return this.props.socket ? (
            <div>
                <Panel title={ this.props.quickJoin ? 'Join Existing or Start New Game' : 'New game' }>
                    <form className='form'>
                        { content }
                        <div className='button-row'>
                            <button className='btn btn-primary' onClick={ this.onSubmitClick }>Start</button>
                            <button className='btn btn-primary' onClick={ this.onCancelClick }>Cancel</button>
                        </div>
                    </form>
                </Panel >
            </div >) : (
            <div>
                <AlertPanel type='warning' message='Your connection to the lobby has been interrupted, if this message persists, refresh your browser' />
            </div>
        );
    }
}

NewGame.displayName = 'NewGame';
NewGame.propTypes = {
    allowMelee: PropTypes.bool,
    cancelNewGame: PropTypes.func,
    defaultGameName: PropTypes.string,
    events: PropTypes.array,
    loadEvents: PropTypes.func,
    quickJoin: PropTypes.bool,
    restrictedLists: PropTypes.array,
    socket: PropTypes.object,
    user: PropTypes.object
};

function mapStateToProps(state) {
    return {
        allowMelee: state.account.user ? state.account.user.permissions.allowMelee : false,
        events: state.events.events,
        restrictedLists: state.cards.restrictedList,
        socket: state.lobby.socket,
        user: state.account.user
    };
}

export default connect(mapStateToProps, actions)(NewGame);
