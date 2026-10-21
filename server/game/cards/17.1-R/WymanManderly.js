import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

function buildAggregate(card) {
    return {
        type: card.getType(),
        controller: card.controller
    };
}

class WymanManderly extends DrawCard {
    // Wyman Manderly (17122)
    // Action: Kill a standing character you control.
    // Reaction: After a character you control is sacrificed or killed, stand Wyman Manderly and
    // draw 1 card. (Limit once per phase.)
    setupCardAbilities(ability) {
        this.action({
            title: 'Kill a character',
            target: {
                type: 'select',
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    card.controller === context.player &&
                    card.getType() === 'character' &&
                    !card.kneeled &&
                    GameActions.kill({ card }).allow()
            },
            message: '{player} uses {source} to kill {target}',
            gameAction: GameActions.kill((context) => ({ card: context.target }))
        });
        this.reaction({
            when: {
                onSacrificed: {
                    aggregateBy: (event) => buildAggregate(event.cardStateWhenSacrificed),
                    condition: (aggregate, events, context) =>
                        aggregate.type === 'character' &&
                        aggregate.controller === context.source.controller
                },
                onCharacterKilled: {
                    aggregateBy: (event) => buildAggregate(event.cardStateWhenKilled),
                    condition: (aggregate, events, context) =>
                        aggregate.type === 'character' &&
                        aggregate.controller === context.source.controller
                }
            },
            limit: ability.limit.perPhase(1),
            message: '{player} uses {source} to {gameAction}',
            gameAction: GameActions.simultaneously([
                GameActions.standCard({ card: this }),
                GameActions.drawCards((context) => ({ player: context.player, amount: 1 }))
            ])
        });
    }
}

WymanManderly.code = '17122';

export default WymanManderly;
