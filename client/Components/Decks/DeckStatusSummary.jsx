import { faCheck, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

const DeckStatusSummary = ({ status }) => {
    let { basicRules, noUnreleasedCards, restrictedLists } = status;
    const restrictedListItems = (restrictedLists || [])
        .map((rl) => [
            { title: `${rl.name} restricted list`, value: rl.restrictedRules },
            { title: `${rl.name} banned list`, value: rl.noBannedCards }
        ])
        .reduce((items, rlItems) => items.concat(rlItems), []);
    const items = [
        { title: 'Basic deckbuilding rules', value: basicRules },
        ...restrictedListItems,
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
