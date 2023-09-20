const GameActions = require('../../GameActions/index.js');
const DrawCard = require('../../drawcard.js');

class TarleTheThriceDrowned extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardPlaced: event => event.card.location === 'dead pile'
                                        && event.card.getType() === 'character'
                                        && event.card.controller === this.controller
                                        && (event.card.hasTrait('Drowned God') || event.card.hasTrait('Ironborn'))
            },
            limit: ability.limit.perRound(1),
            message: {
                format: '{player} uses {source} to put {character} into play',
                args: { character: context => context.event.card }
            },
            gameAction: GameActions.putIntoPlay(context => ({ card: context.event.card }))
                .then({
                    target: {
                        cardCondition: { type: 'character', location: 'play area', controller: 'current' }
                    },
                    message: 'Then, {player} kills {target}',
                    handler: context => {
                        this.game.resolveGameAction(GameActions.kill(context => ({ card: context.target })), context);
                    }
                })
        });
    }
}

TarleTheThriceDrowned.code = '25514';
TarleTheThriceDrowned.version = '1.1';

module.exports = TarleTheThriceDrowned;
