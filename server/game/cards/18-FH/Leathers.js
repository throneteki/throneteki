const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions');

class Leathers extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card) =>
                card.location === 'play area' &&
                card.getType() === 'character' &&
                card.hasTrait('Wildling'),
            effect: ability.effects.addFaction('thenightswatch')
        });

        this.persistentEffect({
            match: (card) =>
                card.location === 'play area' &&
                card.getType() === 'character' &&
                card.hasTrait('Giant'),
            effect: ability.effects.addIcon('intrigue')
        });

        this.reaction({
            when: {
                onCardEntersPlay: (event) => event.card === this
            },
            message: '{player} uses {source} to search their deck for a Giant character',
            gameAction: GameActions.search({
                title: 'Select a character',
                match: { trait: 'Giant', type: 'character' },
                message: '{player} {gameAction}',
                gameAction: GameActions.addToHand((context) => ({
                    card: context.searchTarget
                }))
            })
        });
    }
}

Leathers.code = '18010';

module.exports = Leathers;
