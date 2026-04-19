const JoustFormat = {
    name: 'joust',
    requiredDraw: 60,
    requiredPlots: 7,
    maxDoubledPlots: 1,
    rules: [
        {
            message: 'You cannot include Draft cards in your deck',
            condition: (deck) => {
                return deck
                    .getUniqueCards()
                    .every((card) => !['ToJ', 'VDS'].includes(card.packCode));
            }
        }
    ]
};

export default JoustFormat;
