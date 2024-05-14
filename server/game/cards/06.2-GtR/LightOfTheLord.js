import DrawCard from '../../drawcard.js';

class LightOfTheLord extends DrawCard {
    setupCardAbilities() {
        this.attachmentRestriction({ faction: 'baratheon' }, { trait: "R'hllor" });
        this.reaction({
            when: {
                onPhaseStarted: (event) => event.phase === 'dominance'
            },
            handler: () => {
                this.controller.standCard(this.parent);
                let msg = '{0} uses {1} to stand {2}';
                if (this.controller.canGainGold()) {
                    this.game.addGold(this.controller, 1);
                    msg += 'and gain 1 gold';
                }
                this.game.addMessage(msg, this.controller, this, this.parent);
            }
        });
    }
}

LightOfTheLord.code = '06028';

export default LightOfTheLord;
