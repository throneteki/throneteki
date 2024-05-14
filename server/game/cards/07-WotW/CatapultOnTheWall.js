const DrawCard = require('../../drawcard.js');

class CatapultOnTheWall extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Kill attacking character',
            cost: [ability.costs.kneelSelf(), ability.costs.kneelParent()],
            target: {
                cardCondition: (card) => card.isAttacking() && card.getStrength() <= 4
            },
            handler: (context) => {
                this.game.killCharacter(context.target);
                this.game.addMessage(
                    '{0} kneels {1} and {2} to kill {3}',
                    context.player,
                    this,
                    this.parent,
                    context.target
                );
                this.untilEndOfRound((ability) => ({
                    condition: () => this.game.currentPhase === 'standing',
                    match: this.parent,
                    effect: ability.effects.cannotBeStood()
                }));
            }
        });
    }
}

CatapultOnTheWall.code = '07020';

module.exports = CatapultOnTheWall;
