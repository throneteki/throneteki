import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

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
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.controller === this.controller &&
                    card.getType() === 'character' &&
                    !card.kneeled &&
                    GameActions.kill({ card }).allow()
            },
            message: '{player} uses {source} to kill {target}',
            handler: (context) => {
                this.game.resolveGameAction(
                    GameActions.kill((context) => ({ card: context.target })),
                    context
                );
            }
        });
        this.reaction({
            when: {
                onSacrificed: {
                    aggregateBy: (event) => this.buildAggregate(event.cardStateWhenSacrificed),
                    condition: (aggregate) =>
                        aggregate.type === 'character' && aggregate.controller === this.controller
                },
                onCharacterKilled: {
                    aggregateBy: (event) => this.buildAggregate(event.cardStateWhenKilled),
                    condition: (aggregate) =>
                        aggregate.type === 'character' && aggregate.controller === this.controller
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

    buildAggregate(card) {
        return {
            type: card.getType(),
            controller: card.controller
        };
    }
}

WymanManderly.code = '17122';

export default WymanManderly;
