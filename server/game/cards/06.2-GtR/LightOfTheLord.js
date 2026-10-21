import DrawCard from '../../drawcard.js';

class LightOfTheLord extends DrawCard {
    // Light of the Lord (06028)
    // [baratheon] or R'hllor character only.
    // Reaction: After the dominance phase begins, stand attached character and gain 1 gold.
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
