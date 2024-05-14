import DrawCard from '../../drawcard.js';

class SerDavosSeaworth extends DrawCard {
    setupCardAbilities() {
        this.interrupt({
            when: {
                onCharacterKilled: (event) => event.card === this
            },
            handler: (context) => {
                this.game.addMessage(
                    '{0} uses {1} to return {1} to their hand instead of their dead pile',
                    this.controller,
                    this,
                    this
                );
                context.replaceHandler(() => {
                    context.event.cardStateWhenKilled = this.createSnapshot();
                    this.controller.moveCard(this, 'hand');
                });
            }
        });
    }
}

SerDavosSeaworth.code = '01050';

export default SerDavosSeaworth;
