import DrawCard from '../../drawcard.js';

class CrossroadsSellsword extends DrawCard {
    // Crossroads Sellsword (03029)
    // Interrupt: When Crossroads Sellsword is killed during the challenges phase, gain 2 gold.
    setupCardAbilities() {
        this.interrupt({
            when: {
                onCharacterKilled: (event) =>
                    event.card === this &&
                    this.controller === event.card.controller &&
                    this.game.currentPhase === 'challenge' &&
                    this.controller.canGainGold()
            },
            handler: () => {
                let gold = this.game.addGold(this.controller, 2);
                this.game.addMessage('{0} uses {1} to gain {2} gold', this.controller, this, gold);
            }
        });
    }
}

CrossroadsSellsword.code = '03029';

export default CrossroadsSellsword;
