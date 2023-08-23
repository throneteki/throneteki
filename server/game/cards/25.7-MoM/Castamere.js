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
            gameAction: GameActions.genericHandler(() => {
                this.game.queueStep(new ApplyClaim(this.game, 'military'));
            })
        });
    }
}

Castamere.code = '25531';
Castamere.version = '1.0';

module.exports = Castamere;
