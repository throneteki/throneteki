const DraftFormat = {
    name: 'draft',
    requiredDraw: 40,
    requiredPlots: 5,
    maxDoubledPlots: 1,
    rules: [
        {
            message: 'Includes cards that were not drafted',
            condition: (deck, errors) => {
                const draftCardQuantityByCode = deck.draftedCards.reduce((quantityByCode, cardQuantity) => {
                    quantityByCode.set(cardQuantity.code, cardQuantity.count);
                    return quantityByCode;
                }, new Map());

                const allCards = deck.getAllCards();

                let onlyIncludesDraftedCards = true;

                for(const cardQuantity of allCards) {
                    if(!draftCardQuantityByCode.has(cardQuantity.card.code)) {
                        onlyIncludesDraftedCards = false;
                        errors.push(`${cardQuantity.card.name} is not one of the drafted cards`);
                    } else if(draftCardQuantityByCode.get(cardQuantity.card.code) < cardQuantity.count) {
                        onlyIncludesDraftedCards = false;
                        errors.push(`${cardQuantity.card.name} has ${cardQuantity.count} copies but only ${draftCardQuantityByCode.get(cardQuantity.card.code)} copies were drafted`);
                    }
                }

                return onlyIncludesDraftedCards;
            }
        }
    ]
};

module.exports = DraftFormat;
