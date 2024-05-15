import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { deckStatusLabel } from './DeckHelper';

import DeckStatusSummary from './DeckStatusSummary';
import StatusPopOver from './StatusPopOver';

class DeckStatus extends React.Component {
    render() {
        let { status } = this.props;
        const restrictionsFollowed = status.faqJoustRules && status.noUnreleasedCards;
        let className = classNames('deck-status', this.props.className, {
            invalid: !status.basicRules || !status.noBannedCards,
            'casual-play': status.basicRules && status.noBannedCards && !restrictionsFollowed,
            valid: status.basicRules && status.noBannedCards && restrictionsFollowed
        });

        return (
            <span className={className}>
                <StatusPopOver status={deckStatusLabel(status)} show>
                    <div>
                        <DeckStatusSummary status={status} />
                        {status.extendedStatus && status.extendedStatus.length !== 0 && (
                            <ul className='deck-status-errors'>
                                {status.extendedStatus.map((error, index) => (
                                    <li key={index}>{error}</li>
                                ))}
                            </ul>
                        )}
                    </div>
                </StatusPopOver>
            </span>
        );
    }
}

DeckStatus.propTypes = {
    className: PropTypes.string,
    status: PropTypes.object.isRequired
};

export default DeckStatus;
