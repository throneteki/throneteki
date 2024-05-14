const DrawCard = require('../../drawcard.js');

class TheValyrian extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Give attacking character +STR',
            condition: () =>
                this.game.currentChallenge && this.game.currentChallenge.defendingPlayer.gold >= 1,
            cost: ability.costs.kneelSelf(),
            target: {
                cardCondition: (card) => card.location === 'play area' && card.isAttacking()
            },
            handler: (context) => {
                let strBoost = this.game.currentChallenge.defendingPlayer.gold;
                this.game.addMessage(
                    '{0} kneels {1} to give {2} +{3} STR until the end of the challenge',
                    this.controller,
                    this,
                    context.target,
                    strBoost
                );

                this.untilEndOfChallenge((ability) => ({
                    match: context.target,
                    effect: ability.effects.modifyStrength(strBoost)
                }));
            }
        });
    }
}

TheValyrian.code = '04108';

module.exports = TheValyrian;
