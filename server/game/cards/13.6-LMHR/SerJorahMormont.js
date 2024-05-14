const DrawCard = require('../../drawcard.js');

class SerJorahMormont extends DrawCard {
    setupCardAbilities() {
        this.interrupt({
            when: {
                onCardDiscarded: (event) => event.card === this && event.originalLocation === 'hand'
            },
            location: ['hand'],
            handler: (context) => {
                this.game.addMessage(
                    '{0} uses {1} to put {1} into shadows instead of placing it in their discard pile',
                    this.controller,
                    this
                );
                context.event.replaceHandler(() => {
                    this.controller.putIntoShadows(this);
                });
            }
        });
    }
}

SerJorahMormont.code = '13113';

module.exports = SerJorahMormont;
