const DrawCard = require('../../drawcard.js');

class TheDrownedGodWakes extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onDominanceDetermined: event => this.controller === event.winner && event.difference >= 10
            },
            cost: ability.costs.kneelFactionCard(),
            message: '{player} uses {source} to have each player chose a character they control and kill each character not chosen',
            target: {
                choosingPlayer: 'each',
                ifAble: true,
                cardCondition: (card, context) => card.location === 'play area' && card.getType() === 'character' && card.controller === context.choosingPlayer
            },
            handler: context => {
                const uniqueCards = this.getChosenCards(context);
                let characters = this.game.filterCardsInPlay(card => !uniqueCards.includes(card) && card.getType() === 'character');
                this.game.killCharacters(characters);
            }
        });
    }

    getChosenCards(context) {
        const cards = context.targets.selections.map(selection => selection.value).filter(card => !!card);
        return [...new Set(cards)];
    }
}

TheDrownedGodWakes.code = '25523';
TheDrownedGodWakes.version = '1.2';

module.exports = TheDrownedGodWakes;
