import PlotCard from '../../plotcard.js';

class LionsOfTheRock extends PlotCard {
    // Lions of the Rock (05046)
    // Reaction: After the challenges phase begins, gain 3 gold.
    setupCardAbilities() {
        this.reaction({
            when: {
                onPhaseStarted: (event) =>
                    event.phase === 'challenge' && this.controller.canGainGold()
            },
            handler: () => {
                let gold = this.game.addGold(this.controller, 3);
                this.game.addMessage('{0} uses {1} to gain {2} gold', this.controller, this, gold);
            }
        });
    }
}

LionsOfTheRock.code = '05046';

export default LionsOfTheRock;
