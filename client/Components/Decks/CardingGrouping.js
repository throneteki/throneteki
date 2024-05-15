const CardTypeOrder = ['Agenda', 'Plot', 'Scheme', 'Character', 'Location', 'Attachment', 'Event'];

const CardGrouping = {
    type: {
        generateGroup: (card, { useSchemes = false }) => {
            let typeCode = card.type;
            if (!typeCode) {
                return null;
            }

            let type = typeCode[0].toUpperCase() + typeCode.slice(1);

            if (useSchemes) {
                if (card.traits.some((trait) => trait.toLowerCase() === 'scheme')) {
                    type = 'Scheme';
                }
            }

            return type;
        },
        sortGroup: (a, b) => {
            const indexA = CardTypeOrder.indexOf(a);
            const indexB = CardTypeOrder.indexOf(b);
            return indexA < indexB ? -1 : 1;
        },
        title: (group) => group
    },
    cost: {
        generateGroup: (card) => {
            const value = card.type === 'plot' ? card.plotStats.income : card.cost;

            if (!value && value !== 0) {
                return 'None';
            }

            return value.toString();
        },
        sortGroup: (a, b) => {
            const numA = Number(a);
            const numB = Number(b);

            if (isNaN(numA)) {
                return 1;
            }

            if (isNaN(numB)) {
                return -1;
            }

            return a < b ? 1 : -1;
        },
        title: (group) => `Cost: ${group}`
    }
};

const CardSortOrder = {
    faction: (a, b) => {
        if (a.faction === b.faction) {
            return a.name < b.name ? -1 : 1;
        }

        if (a.faction === 'neutral') {
            return 1;
        }

        if (b.faction === 'neutral') {
            return -1;
        }

        return a.faction < b.faction ? -1 : 1;
    },
    name: (a, b) => {
        return a.name < b.name ? -1 : 1;
    }
};

export function groupCards({ cards, groupBy, sortCardsBy, useSchemes }) {
    const cardGrouping = CardGrouping[groupBy];

    let groupedCards = {};
    for (const cardQuantity of cards) {
        let group = cardGrouping.generateGroup(cardQuantity.card, { useSchemes });
        if (!group) {
            continue;
        }

        if (!groupedCards[group]) {
            groupedCards[group] = [cardQuantity];
        } else {
            groupedCards[group].push(cardQuantity);
        }
    }

    const compareCards = CardSortOrder[sortCardsBy];

    for (const type in groupedCards) {
        groupedCards[type].sort((a, b) => compareCards(a.card, b.card));
    }

    const groupsArray = [];
    for (const [group, cardsForGroup] of Object.entries(groupedCards)) {
        groupsArray.push({ group, title: cardGrouping.title(group), cards: cardsForGroup });
    }

    groupsArray.sort((a, b) => cardGrouping.sortGroup(a.group, b.group));

    return groupsArray;
}

export default CardGrouping;
