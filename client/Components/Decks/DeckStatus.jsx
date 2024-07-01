import React from 'react';
import classNames from 'classnames';
import { deckStatusLabel } from './DeckHelper';

import DeckStatusSummary from './DeckStatusSummary';
import StatusPopOver from './StatusPopOver';

const DeckStatus = ({ className, status }) => {
    const restrictionsFollowed = status.faqJoustRules && status.noUnreleasedCards;
    let classNameValue = classNames('deck-status', className, {
        invalid: !status.basicRules || !status.noBannedCards,
        'casual-play': status.basicRules && status.noBannedCards && !restrictionsFollowed,
        valid: status.basicRules && status.noBannedCards && restrictionsFollowed
    });

    return (
        <span className={classNameValue}>
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
};

export default DeckStatus;
