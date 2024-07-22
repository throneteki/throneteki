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
        <ul className='deck-status-summary'>
            {items.map((item, index) => (
                <li className={item.value ? 'valid' : 'invalid'} key={index}>
                    <span
                        className={
                            item.value ? 'glyphicon glyphicon-ok' : 'glyphicon glyphicon-remove'
                        }
                    />
                    {` ${item.title}`}
                </li>
            ))}
        </ul>
    );
};

export default DeckStatusSummary;
