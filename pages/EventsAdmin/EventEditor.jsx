import React from 'react';
import PropTypes from 'prop-types';

import Input from '../../Components/Form/Input';
import Checkbox from '../../Components/Form/Checkbox';
import Typeahead from '../../Components/Form/Typeahead';
import TextArea from '../../Components/Form/TextArea';
import ApiStatus from '../../Components/Site/ApiStatus';

class EventEditor extends React.Component {
    constructor(props) {
        super(props);

        let event = {};
        event = Object.assign(event, {
            useDefaultRestrictedList: false,
            useEventGameOptions: false, 
            eventGameOptions: {}, 
            restricted: [], 
            banned: [], 
            restrictSpectators: false, 
            validSpectators: [] 
        }, props.event);
        this.state = {
            eventId: event._id,
            name: event.name,
            useDefaultRestrictedList: event.useDefaultRestrictedList,
            restricted: event.restricted,
            banned: event.banned,
            restrictedListText: this.formatListTextForCards(props.cards, event.restricted),
            bannedListText: this.formatListTextForCards(props.cards, event.banned),
            useEventGameOptions: event.useEventGameOptions,
            eventGameOptions: event.eventGameOptions,
            restrictSpectators: event.restrictSpectators,
            validSpectators: event.validSpectators,
            validSpectatorsText: this.formatListTextForUsers(event.validSpectators)
        };
    }

    getEventFromState() {
        return {
            _id: this.state.eventId,
            name: this.state.name,
            useDefaultRestrictedList: this.state.useDefaultRestrictedList,
            useEventGameOptions: this.state.useEventGameOptions,
            eventGameOptions: this.state.eventGameOptions,
            restricted: this.state.restricted,
            banned: this.state.banned,
            restrictSpectators: this.state.restrictSpectators,
            validSpectators: this.state.validSpectators
        };
    }

    formatListTextForUsers(users) {
        if(!users) {
            return '';
        }

        return users.map(user => `${user}\n`).join('');
    }

    formatListTextForCards(cards, cardCodes) {
        if(!cardCodes || !cards) {
            return '';
        }

        const allCards = Object.values(cards);
        const cardCodeToNameIndex = allCards.reduce((index, card) => {
            index[card.code] = card.label;
            return index;
        }, {});

        return cardCodes.map(cardCode => `${cardCodeToNameIndex[cardCode]}\n`).join('');
    }

    formatCardListItem(card) {
        return card.label;
    }

    onChange(field, event) {
        let state = this.state;

        state[field] = event.target.value;

        this.setState({ state });
    }

    onEventGameOptionChange(field, event) {
        let state = this.state;

        state['eventGameOptions'][field] = event.target.value;

        this.setState({ state });
    }

    onCheckboxChange(field, event) {
        let state = this.state;

        state[field] = event.target.checked;

        this.setState({ state });
    }

    onEventGameOptionCheckboxChange(field, event) {
        let state = this.state;

        state['eventGameOptions'][field] = event.target.checked;

        this.setState({ state });
    }

    addCardChange(selectedCards) {
        this.setState({ cardToAdd: selectedCards[0] });
    }

    handleAddCard({ event, textProperty, arrayProperty }) {
        event.preventDefault();

        if(!this.state.cardToAdd || !this.state.cardToAdd.label) {
            return;
        }

        let cardList = this.state[textProperty];
        cardList += `${this.state.cardToAdd.label}\n`;

        let cards = this.state[arrayProperty];
        this.addCard(cards, this.state.cardToAdd);
        this.setState({ [textProperty]: cardList, [arrayProperty]: cards });
    }

    handleUserListChange({event, textProperty, arrayProperty}) {
        let split = event.target.value.split('\n');
        const userNames = [];

        for(const line of split) {
            const userName = line;
            if(userName) {
                userNames.push(userName);
            }
        }

        this.setState({
            [textProperty]: event.target.value,
            [arrayProperty]: userNames
        });
    }

    handleCardListChange({ event, textProperty, arrayProperty }) {
        let split = event.target.value.split('\n');
        const cards = [];

        for(const line of split) {
            const card = this.parseCardLine(line);
            if(card) {
                this.addCard(cards, card);
            }
        }

        this.setState({
            [textProperty]: event.target.value,
            [arrayProperty]: cards
        });
    }

    parseCardLine(line) {
        const pattern = /^([^()]+)(\s+\((.+)\))?$/;

        let match = line.trim().match(pattern);
        if(!match) {
            return null;
        }

        let cardName = match[1].trim().toLowerCase();
        let packName = match[3] && match[3].trim().toLowerCase();
        let pack = packName && this.props.packs.find(pack => pack.code.toLowerCase() === packName || pack.name.toLowerCase() === packName);
        let cards = Object.values(this.props.cards);

        let matchingCards = cards.filter(card => {
            if(pack) {
                return pack.code === card.packCode && card.name.toLowerCase() === cardName;
            }

            return card.name.toLowerCase() === cardName;
        });

        matchingCards.sort((a, b) => this.compareCardByReleaseDate(a, b));

        return matchingCards[0];
    }

    compareCardByReleaseDate(a, b) {
        let packA = this.props.packs.find(pack => pack.code === a.packCode);
        let packB = this.props.packs.find(pack => pack.code === b.packCode);

        if(!packA.releaseDate && packB.releaseDate) {
            return 1;
        }

        if(!packB.releaseDate && packA.releaseDate) {
            return -1;
        }

        return new Date(packA.releaseDate) < new Date(packB.releaseDate) ? -1 : 1;
    }

    addCard(list, card) {
        list.push(card.code);
    }

    handleSaveClick(event) {
        event.preventDefault();

        if(this.props.onEventSave) {
            this.props.onEventSave(this.getEventFromState());
        }
    }

    handleCancelClick() {
        this.props.navigate('/events');
    }

    render() {
        const allCards = Object.values(this.props.cards);

        return (
            <div>
                <ApiStatus apiState={ this.props.apiState } successMessage='Deck saved successfully.' />

                <form className='form form-horizontal'>
                    <Input name='name' label='Event Name' labelClass='col-sm-3' fieldClass='col-sm-9' placeholder='Event Name'
                        type='text' onChange={ this.onChange.bind(this, 'name') } value={ this.state.name } />
                    <Checkbox name='useDefaultRestrictedList' label='Use default Restricted List' labelClass='col-sm-4' fieldClass='col-sm-offset-3 col-sm-8'
                        onChange={ this.onCheckboxChange.bind(this, 'useDefaultRestrictedList') } checked={ this.state.useDefaultRestrictedList } />
                    
                    <div className='form-group'>
                        <label className='col-sm-3 col-xs-2 control-label'>Event Game Options</label>
                    </div>
                    <Checkbox name='useEventGameOptions' label='Use event game options' labelClass='col-sm-4' fieldClass='col-sm-offset-3 col-sm-8'
                        onChange={ this.onCheckboxChange.bind(this, 'useEventGameOptions') } checked={ this.state.useEventGameOptions } />
                    { this.state.useEventGameOptions
                    && <Checkbox name='spectators' label='Allow spectators' labelClass='col-sm-4' fieldClass='col-sm-offset-3 col-sm-8'
                        onChange={ this.onEventGameOptionCheckboxChange.bind(this, 'spectators') } checked={ this.state.eventGameOptions.spectators } />
                    }
                    { this.state.useEventGameOptions && this.state.eventGameOptions.spectators
                    && <Checkbox name='muteSpectators' label='Mute spectators' labelClass='col-sm-4' fieldClass='col-sm-offset-3 col-sm-8'
                        onChange={ this.onEventGameOptionCheckboxChange.bind(this, 'muteSpectators') } checked={ this.state.eventGameOptions.muteSpectators } />
                    }
                    { this.state.useEventGameOptions && this.state.eventGameOptions.spectators
                    && <Checkbox name='showHand' label='Show hands to spectators' labelClass='col-sm-4' fieldClass='col-sm-offset-3 col-sm-8'
                        onChange={ this.onEventGameOptionCheckboxChange.bind(this, 'showHand') } checked={ this.state.eventGameOptions.showHand } />
                    }
                    { this.state.useEventGameOptions
                    && <Checkbox name='useRookery' label='Rookery format' labelClass='col-sm-4' fieldClass='col-sm-offset-3 col-sm-8'
                        onChange={ this.onEventGameOptionCheckboxChange.bind(this, 'useRookery') } checked={ this.state.eventGameOptions.useRookery } />
                    }
                    { this.state.useEventGameOptions
                    && <Checkbox name='useGameTimeLimit' label='Use a time limit (in minutes)' labelClass='col-sm-4' fieldClass='col-sm-offset-3 col-sm-8'
                        onChange={ this.onEventGameOptionCheckboxChange.bind(this, 'useGameTimeLimit') } checked={ this.state.eventGameOptions.useGameTimeLimit } />
                    }
                    { this.state.useEventGameOptions && this.state.eventGameOptions.useGameTimeLimit 
                    && <Input name='gameTimeLimit' label='Timelimit in minutes' labelClass='col-sm-3' fieldClass='col-sm-9' placeholder='Timelimit in minutes'
                        type='number' onChange={ this.onEventGameOptionChange.bind(this, 'gameTimeLimit') } value={ this.state.eventGameOptions.gameTimeLimit } />
                    }
                    { this.state.useEventGameOptions
                    && <Checkbox name='useChessClocks' label='Use chess clocks with a time limit per player (in minutes)' labelClass='col-sm-4' fieldClass='col-sm-offset-3 col-sm-8'
                        onChange={ this.onEventGameOptionCheckboxChange.bind(this, 'useChessClocks') } checked={ this.state.eventGameOptions.useChessClocks } />
                    }
                    { this.state.useEventGameOptions && this.state.eventGameOptions.useChessClocks 
                    && <Input name='chessClockTimeLimit' label='Timelimit in minutes' labelClass='col-sm-3' fieldClass='col-sm-9' placeholder='Timelimit in minutes'
                        type='number' onChange={ this.onEventGameOptionChange.bind(this, 'chessClockTimeLimit') } value={ this.state.eventGameOptions.chessClockTimeLimit } />
                    }
                    { this.state.useEventGameOptions
                    && <Input name='password' label='Password' labelClass='col-sm-3' fieldClass='col-sm-9' placeholder='Password'
                        type='text' onChange={ this.onEventGameOptionChange.bind(this, 'password') } value={ this.state.eventGameOptions.password } />
                    }

                    <div className='form-group'>
                        <label className='col-sm-3 col-xs-2 control-label'>Settings for Judges/Streamers</label>
                    </div>
                    <Checkbox name='restrictSpectators' label='Restrict spectators to those on the following list' labelClass='col-sm-4' fieldClass='col-sm-offset-3 col-sm-8'
                        onChange={ this.onCheckboxChange.bind(this, 'restrictSpectators') } checked={ this.state.restrictSpectators } />
                    { this.state.restrictSpectators
                    && <TextArea label='Valid Spectators' labelClass='col-sm-3' fieldClass='col-sm-9' rows='10' value={ this.state.validSpectatorsText }
                        onChange={ event => this.handleUserListChange({ event, textProperty: 'validSpectatorsText', arrayProperty: 'validSpectators' }) } />
                    }

                    <div className='form-group'>
                        <label className='col-sm-3 col-xs-2 control-label'>Custom Restricted/Banned List</label>
                    </div>
                    <Typeahead label='Card' labelClass={ 'col-sm-3 col-xs-2' } fieldClass='col-sm-4 col-xs-5' labelKey={ 'label' } options={ allCards }
                        onChange={ this.addCardChange.bind(this) }>
                        <div className='col-xs-1 no-x-padding'>
                            <div className='btn-group'>
                                <button className='btn btn-primary dropdown-toggle' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>
                                    Add <span className='caret' />
                                </button>
                                <ul className='dropdown-menu'>
                                    <li><a href='#' onClick={ event => this.handleAddCard({ event, textProperty: 'restrictedListText', arrayProperty: 'restricted' }) }>Add to restricted</a></li>
                                    <li><a href='#' onClick={ event => this.handleAddCard({ event, textProperty: 'bannedListText', arrayProperty: 'banned' }) }>Add to banned</a></li>
                                </ul>
                            </div>
                        </div>
                    </Typeahead>
                    <TextArea label='Restricted List' labelClass='col-sm-3' fieldClass='col-sm-9' rows='10' value={ this.state.restrictedListText }
                        onChange={ event => this.handleCardListChange({ event, textProperty: 'restrictedListText', arrayProperty: 'restricted' }) } />
                    <TextArea label='Banned List' labelClass='col-sm-3' fieldClass='col-sm-9' rows='4' value={ this.state.bannedListText }
                        onChange={ event => this.handleCardListChange({ event, textProperty: 'bannedListText', arrayProperty: 'banned' }) } />
                    <div className='form-group'>
                        <div className='col-sm-offset-3 col-sm-8'>
                            <button ref='submit' type='submit' className='btn btn-primary' onClick={ this.handleSaveClick.bind(this) }>Save { this.props.apiState && this.props.apiState.loading && <span className='spinner button-spinner' /> }</button>
                            <button ref='submit' type='button' className='btn btn-primary' onClick={ this.handleCancelClick.bind(this) }>Cancel</button>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}

EventEditor.displayName = 'EventEditor';
EventEditor.propTypes = {
    apiState: PropTypes.object,
    cards: PropTypes.object,
    event: PropTypes.object,
    navigate: PropTypes.func,
    onEventSave: PropTypes.func,
    packs: PropTypes.array
};

export default EventEditor;
