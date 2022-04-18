const DrawCard = require('../../drawcard.js');

class BrienneTheBlue extends DrawCard {
    setupCardAbilities() {
        this.action({
            condition: () => this.hasSingleParticipatingChar(),
            target: {
                cardCondition: card => this.game.isDuringChallenge({ attackingAlone: card }) || this.game.isDuringChallenge({ defendingAlone: card })
            },
            handler: context => {
                let strBoost = context.target.name === 'Brienne of Tarth' || context.target.hasTrait('Rainbow Guard') ? 10 : 5;
                this.untilEndOfChallenge(ability => ({
                    match: context.target,
                    effect: ability.effects.modifyStrength(strBoost)
                }));
                this.game.addMessage('{0} plays {1} to give {2} +{3} STR until the end of the challenge', context.player, this, context.target, strBoost);
            }
        });
    }

    hasSingleParticipatingChar() {
        return this.game.currentChallenge && (this.game.currentChallenge.attackers.length === 1 || this.game.currentChallenge.defenders.length === 1);
    }
}

BrienneTheBlue.code = '22024';

module.exports = BrienneTheBlue;
