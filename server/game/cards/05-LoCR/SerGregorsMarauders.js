import DrawCard from '../../drawcard.js';

class SerGregorsMarauders extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardDiscarded: (event) =>
                    event.isPillage && event.source === this && event.card.getType() === 'event'
            },
            handler: () => {
                this.controller.standCard(this);
                this.game.addMessage('{0} uses {1} to stand {1}', this.controller, this);
            }
        });
    }
}

SerGregorsMarauders.code = '05008';

export default SerGregorsMarauders;
