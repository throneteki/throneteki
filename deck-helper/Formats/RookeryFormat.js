import JoustFormat from './JoustFormat.js';

const RookeryFormat = Object.assign({}, JoustFormat, {
    name: 'rookery',
    rules: [
        {
            message: 'More than 2 plot cards in rookery',
            condition: deck => {
                return deck.countRookeryCards(card => card.type === 'plot') <= 2;
            }
        },
        {
            message: 'More than 10 draw cards in rookery',
            condition: deck => {
                return deck.countRookeryCards(card => card.type !== 'plot') <= 10;
            }
        }
    ]
});

export default RookeryFormat;
