import React from 'react';
import PropTypes from 'prop-types';

import ConfirmedButton from './FormComponents/ConfirmedButton';
import DeckSummary from './DeckSummary';
import Panel from './SiteComponents/Panel';

class ViewDeck extends React.Component {
    render() {
        let { deck, cards, onEditClick, onDeleteClick } = this.props;

        return (
            <div className='col-sm-7'>
                <Panel title={ deck.name }>
                    <div className='btn-group col-xs-12'>
                        <button className='btn btn-primary' onClick={ onEditClick }>Edit</button>
                        <ConfirmedButton onClick={ onDeleteClick }>Delete</ConfirmedButton>
                    </div>
                    <DeckSummary deck={ deck } cards={ cards } />
                </Panel>
            </div>);
    }
}

ViewDeck.propTypes = {
    cards: PropTypes.object,
    deck: PropTypes.object,
    onDeleteClick: PropTypes.func,
    onEditClick: PropTypes.func
};

export default ViewDeck;
