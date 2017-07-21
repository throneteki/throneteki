const DrawCard = require('../../../drawcard.js');

class BurningOnTheSand extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event, challenge) => challenge.loser === this.controller && challenge.isUnopposed()
            },
            handler: () => {
                this.untilEndOfChallenge(ability => ({
                    match: card => card === card.controller.activePlot,
                    targetController: 'opponent',
                    effect: ability.effects.setClaim(0)
                }));

                let opponent = this.game.getOtherPlayer(this.controller);
                this.game.addMessage('{0} plays {1} to set the claim value on {2}\'s revealed plot card to 0 until the end of the challenge', 
                    this.controller, this, opponent);
            }
        });
    }
}

BurningOnTheSand.code = '04076';

module.exports = BurningOnTheSand;
