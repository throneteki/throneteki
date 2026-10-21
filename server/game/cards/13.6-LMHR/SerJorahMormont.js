import DrawCard from '../../drawcard.js';

class SerJorahMormont extends DrawCard {
    // Ser Jorah Mormont (13113)
    // Shadow (4). No attachments except Weapon.
    // Interrupt: When Ser Jorah Mormont is discarded from your hand, put him into shadows instead
    // of placing him in your discard pile.
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

export default SerJorahMormont;
