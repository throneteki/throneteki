import React from 'react';
import PropTypes from 'prop-types';

class RestrictedListDropdown extends React.Component {
    constructor(props) {
        super(props);

        this.state = { value: props.currentRestrictedList && props.currentRestrictedList.name };
    }

    handleChange(event) {
        const selectedName = event.target.value;
        const restrictedList = this.props.restrictedLists.find(rl => rl.name === selectedName);
        this.setState({ value: selectedName });
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
