import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class WymanManderly extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Sacrifice a character',
            target: {
                type: 'select',
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.controller === this.controller &&
                    card.getType() === 'character' &&
                    GameActions.sacrificeCard({ card }).allow()
            },
            message: '{player} uses {source} to sacrifice {target}',
            handler: (context) => {
                this.game.resolveGameAction(
                    GameActions.sacrificeCard((context) => ({ card: context.target })),
                    context
                );
            }
        });
        this.reaction({
            when: {
                onSacrificed: {
                    aggregateBy: (event) => this.buildAggregate(event.cardStateWhenSacrificed),
                    condition: (aggregate) =>
                        aggregate[0] === 'character' && aggregate[1] === this.controller
                },
                onCharacterKilled: {
                    aggregateBy: (event) => this.buildAggregate(event.cardStateWhenKilled),
                    condition: (aggregate) =>
                        aggregate[0] === 'character' && aggregate[1] === this.controller
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

    buildAggregate(card) {
        return [card.getType(), card.controller];
    }
}

WymanManderly.code = '11021';

export default WymanManderly;
