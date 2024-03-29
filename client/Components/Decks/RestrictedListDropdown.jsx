import React from 'react';
import PropTypes from 'prop-types';

class RestrictedListDropdown extends React.Component {
    constructor(props) {
        super(props);

        this.state = { value: props.currentRestrictedList && props.currentRestrictedList.name };
        //if the currentRestrictedList is not set, update the restrictedList with the first RL in the list to set the initial state
        //this solves the problem, that the display of the dropdown (showing a selected entry) doesn´t correspond to the state 
        if(!props.currentRestrictedList) {
            this.updateRestrictedList(props.restrictedLists[0].name);
        }
    }

    handleChange(event) {
        const selectedName = event.target.value;
        this.updateRestrictedList(selectedName);
    }

    updateRestrictedList(restrictedListName) {
        this.setState({ value: restrictedListName });
        let restrictedList = this.props.restrictedLists.find(rl => rl.name === restrictedListName);
        //if the chosen restrictedList is an event and that event uses a default restricted list instead of a custom one, use the defaultRestrictedList instead
        if(restrictedList.useDefaultRestrictedList && restrictedList.defaultRestrictedList) {
            restrictedList = this.props.restrictedLists.find(rl => rl.name === restrictedList.defaultRestrictedList);
        }
        if(this.props.setCurrentRestrictedList) {
            this.props.setCurrentRestrictedList(restrictedList);
        }
        if(this.props.onChange) {
            this.props.onChange(restrictedList);
        }
    }

    render() {
        return (<React.Fragment>
            <label htmlFor='current-restricted-list'>Restricted List:</label>
            <select id='current-restricted-list' className='form-control' value={ this.state.value } onChange={ this.handleChange.bind(this) }>
                { this.props.restrictedLists.map(rl => <option value={ rl.name }>{ rl.name }</option>) }
            </select>
        </React.Fragment>);
    }
}

RestrictedListDropdown.displayName = 'RestrictedListDropdown';
RestrictedListDropdown.propTypes = {
    currentRestrictedList: PropTypes.object,
    onChange: PropTypes.func,
    restrictedLists: PropTypes.array,
    setCurrentRestrictedList: PropTypes.func
};

export default RestrictedListDropdown;
