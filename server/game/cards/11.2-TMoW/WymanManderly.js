import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

function buildAggregate(card) {
    return {
        type: card.getType(),
        controller: card.controller
    };
}

class WymanManderly extends DrawCard {
    // Wyman Manderly (11021)
    // Action: Sacrifice a character.
    // Reaction: After 1 or more characters you control are sacrificed or killed, stand Wyman
    // Manderly and draw 1 card. (Limit 3 times per round.)
    setupCardAbilities(ability) {
        this.action({
            title: 'Sacrifice a character',
            target: {
                type: 'select',
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    card.controller === context.player &&
                    card.getType() === 'character' &&
                    GameActions.sacrificeCard({ card }).allow()
            },
            message: '{player} uses {source} to sacrifice {target}',
            gameAction: GameActions.sacrificeCard((context) => ({ card: context.target }))
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
            limit: ability.limit.perRound(3),
            message: '{player} uses {source} to {gameAction}',
            gameAction: GameActions.simultaneously([
                GameActions.standCard({ card: this }),
                GameActions.drawCards((context) => ({ player: context.player, amount: 1 }))
            ])
        });
    }
}

WymanManderly.code = '11021';

export default WymanManderly;
