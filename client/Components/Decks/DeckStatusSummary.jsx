import { faCheck, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

const DeckStatusSummary = ({ status }) => {
    const { basicRules, noUnreleasedCards, restrictedList } = status;
    const items = [
        { title: 'Basic deckbuilding rules', value: basicRules },
        {
            title: `${restrictedList.name} Card Legality`,
            value: restrictedList.valid
        },
        { title: 'Only released cards', value: noUnreleasedCards }
    ];

    return (
        <ul>
            {items.map((item, index) => (
                <li className={item.value ? 'text-success' : 'text-danger'} key={index}>
                    <FontAwesomeIcon icon={item.value ? faCheck : faXmark} />
                    {` ${item.title}`}
                </li>
            ))}
        </ul>
    );
};

export default DeckStatusSummary;
