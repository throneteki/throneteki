const GameActions = require('../../GameActions/index.js');
const ApplyClaim = require('../../gamesteps/challenge/applyclaim');
const DrawCard = require('../../drawcard.js');

class Castamere extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onClaimApplied: event => event.challenge.isMatch({ winner: this.controller, challengeType: 'intrigue', by5: true })
            },
            cost: [
                ability.costs.kneelSelf(),
                ability.costs.sacrificeSelf()
            ],
            message: '{player} kneels and sacrifices {costs.sacrifice} to also apply military claim',
            gameAction: GameActions.genericHandler(context => {
                let claim = context.event.claim.clone();
                claim.challengeType = 'military';
                this.game.queueStep(new ApplyClaim(this.game, claim));
            })
        });
    }
}

Castamere.code = '25006';

module.exports = Castamere;
