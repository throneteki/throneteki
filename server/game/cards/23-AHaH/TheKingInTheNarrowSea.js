const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions');

class TheKingInTheNarrowSea extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetLocation: 'hand',
            match: card => card.hasTrait('Smuggler') && card.getType() === 'character',
            effect: ability.effects.gainAmbush()
        });
        this.reaction({
            when: {
                onInitiativeDetermined: event => event.winner !== this.controller
            },
            cost: ability.costs.returnToHand(card => card.isMatch({ trait: ['Mercenary', 'Smuggler'], type: 'character' })),
            target: {
                activePromptTitle: 'Select a location',
                cardCondition: { type: 'location', location: 'play area', condition: (card, context) => !context.costs.returnToHand || card.getPrintedCost() < context.costs.returnToHand.getPrintedCost() },
                gameAction: 'kneel'
            },
            message: {
                format: '{player} uses {source} and returns {returnedToHand} to its owners hand to kneel {target}',
                args: { returnedToHand: context => context.costs.returnToHand }
            },
            handler: context => {
                this.game.resolveGameAction(GameActions.kneelCard({ card: context.target }), context);
            }
        });
    }
}

TheKingInTheNarrowSea.code = '23002';

module.exports = TheKingInTheNarrowSea;
