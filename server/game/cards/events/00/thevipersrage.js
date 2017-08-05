const DrawCard = require('../../../drawcard.js');

class TheVipersRage extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: ({challenge}) => challenge.loser === this.controller && challenge.defendingPlayer === this.controller &&
                                                 challenge.strengthDifference >= 5
            },
            handler: () => {
                let challenge = this.game.currentChallenge;
                this.untilEndOfPhase(ability => ({
                    match: card => card.controller === challenge.attackingPlayer && card.getType() === 'character',
                    targetController: 'any',
                    effect: [
                        ability.effects.removeIcon('military'),
                        ability.effects.removeIcon('intrigue'),
                        ability.effects.removeIcon('power')
                    ]
                }));
                this.game.addMessage('{0} plays {1} to have each character controlled by {2} lose a {3}, an {4} and a {5} icon until the end of the phase',
                    this.controller, this, challenge.attackingPlayer, 'military', 'intrigue', 'power');
            }
        });
    }
}

TheVipersRage.code = '00012';

module.exports = TheVipersRage;
