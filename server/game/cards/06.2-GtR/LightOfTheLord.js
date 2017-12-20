const DrawCard = require('../../drawcard.js');

class LightOfTheLord extends DrawCard {
    setupCardAbilities() {
        this.attachmentRestriction(
            { faction: 'baratheon' },
            { trait: 'R\'hllor' }
        );
        this.reaction({
            when: {
                onPhaseStarted: event => event.phase === 'dominance'
            },
            handler: () => {
                this.controller.standCard(this.parent);
                this.game.addGold(this.controller, 1);
                this.game.addMessage('{0} uses {1} to stand {2} and gain 1 gold', this.controller, this, this.parent);
            }
        });
    }
}

LightOfTheLord.code = '06028';

module.exports = LightOfTheLord;
