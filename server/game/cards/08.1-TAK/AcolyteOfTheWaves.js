import DrawCard from '../../drawcard.js';

class AcolyteOfTheWaves extends DrawCard {
    setupCardAbilities() {
        this.interrupt({
            when: {
                onCharacterKilled: (event) =>
                    event.card === this && this.controller.canGainFactionPower()
            },
            handler: (context) => {
                this.game.addPower(this.controller, 1);
                this.game.addMessage(
                    '{0} uses {1} to gain 1 power for their faction',
                    context.player,
                    this
                );
            }
        });
    }
}

AcolyteOfTheWaves.code = '08012';

export default AcolyteOfTheWaves;
