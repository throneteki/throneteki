import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class TarleTheThriceDrowned extends DrawCard {
    // Tarle the Thrice-Drowned (25043)
    // Renown.
    // Reaction: After a Drowned God character is placed in your dead pile, put it into play. Then,
    // kill a character you control. (Limit once per round.)
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardPlaced: (event) =>
                    event.card.location === 'dead pile' &&
                    event.card.getType() === 'character' &&
                    event.card.controller === this.controller &&
                    event.card.hasTrait('Drowned God')
            },
            limit: ability.limit.perRound(1),
            message: {
                format: '{player} uses {source} to put {character} into play',
                args: { character: (context) => context.event.card }
            },
            gameAction: GameActions.putIntoPlay((context) => ({ card: context.event.card })).then({
                target: {
                    cardCondition: {
                        type: 'character',
                        location: 'play area',
                        controller: 'current'
                    },
                    gameAction: 'kill'
                },
                message: 'Then, {player} kills {target}',
                handler: (context) => {
                    this.game.resolveGameAction(
                        GameActions.kill((context) => ({ card: context.target })),
                        context
                    );
                }
            })
        });
    }
}

TarleTheThriceDrowned.code = '25043';

export default TarleTheThriceDrowned;
