import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class CatapultOnTheWall extends DrawCard {
    // Catapult on the Wall (07020)
    // Action: Kneel Catapult on the Wall and attached character to choose and kill an attacking
    // character with STR 4 or lower. Attached character cannot stand during the standing phase this
    // round.
    setupCardAbilities(ability) {
        this.action({
            title: 'Kill attacking character',
            cost: [ability.costs.kneelSelf(), ability.costs.kneelParent()],
            target: {
                cardCondition: (card) => card.isAttacking() && card.getStrength() <= 4
            },
            message: {
                format: '{player} kneels {source} and {parent} to kill {target}',
                args: { parent: (context) => context.source.parent }
            },
            gameAction: GameActions.simultaneously([
                GameActions.kill((context) => ({ card: context.target })),
                GameActions.lastingEffect((context) => ({
                    duration: 'untilEndOfRound',
                    condition: () => context.game.currentPhase === 'standing',
                    match: context.source.parent,
                    effect: ability.effects.cannotBeStood()
                }))
            ])
        });
    }
}

CatapultOnTheWall.code = '07020';

export default CatapultOnTheWall;
