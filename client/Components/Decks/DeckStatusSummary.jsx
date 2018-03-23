import React from 'react';
import PropTypes from 'prop-types';

class DeckStatusSummary extends React.Component {
    render() {
        let { basicRules, faqJoustRules, faqVersion, noUnreleasedCards } = this.props.status;
        const items = [
            { title: 'Basic deckbuilding rules', value: basicRules },
            { title: `FAQ v${faqVersion} restricted list`, value: faqJoustRules },
            { title: 'Only released cards', value: noUnreleasedCards }
        ];

        return (
            <ul className='deck-status-summary'>
                { items.map((item, index) => (
                    <li className={ item.value ? 'valid' : 'invalid' } key={ index }>
                        <span className={ item.value ? 'glyphicon glyphicon-ok' : 'glyphicon glyphicon-remove' } />
                        { ` ${item.title}` }
                    </li>
                )) }
            </ul>);
    }
}

DeckStatusSummary.propTypes = {
    status: PropTypes.object.isRequired
};

export default DeckStatusSummary;
