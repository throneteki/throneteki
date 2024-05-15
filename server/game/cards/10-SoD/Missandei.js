import DrawCard from '../../drawcard.js';

class Missandei extends DrawCard {
    setupCardAbilities() {
        this.interrupt({
            when: {
                onCardDiscarded: (event) =>
                    event.card === this &&
                    this.controller.canPutIntoPlay(this) &&
                    ['draw deck', 'hand'].includes(event.originalLocation)
            },
            location: ['hand', 'draw deck'],
            handler: (context) => {
                this.game.addMessage(
                    '{0} uses {1} to put {1} into play instead of placing in their discard pile',
                    this.controller,
                    this
                );
                context.event.replaceHandler(() => {
                    this.controller.putIntoPlay(this);
                });
            }
        });
    }
}

Missandei.code = '10035';

export default Missandei;
