const DrawCard = require('../../../drawcard.js');

class CatapultOnTheWall extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Kneel Catapult and attached character',
            condition: () => this.game.currentChallenge,

            // This is not a nice interaction for users, but `ability.costs` would need to be updated with a different method to allow something like attachment.parent.kneel() (I think)
            cost: [
                ability.costs.kneelSelf(),
                ability.costs.kneelParent()
            ],
            target: {
                activePromptTitle: 'Select character to kill',
                cardCondition: card => this.game.currentChallenge.isAttacking(card) && card.getStrength() <= 4
            },
            handler: context => {
                context.target.owner.killCharacter(context.target);
                this.game.addMessage('{0} kneels {1} and {2} to kill {3}', context.player, this, this.parent, context.target);
                this.parent.untilEndOfRound(ability => ({
                    match: this.parent,
                    effect: ability.effects.doesNotStandDuringStanding()
                }));
            }
        });
    }

    canAttach(player, card) {
        if(card.getType() !== 'character') {
            return false;
        }

        return super.canAttach(player, card);
    }
}

CatapultOnTheWall.code = '07020';

module.exports = CatapultOnTheWall;
