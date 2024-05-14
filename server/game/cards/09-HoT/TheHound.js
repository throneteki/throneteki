import DrawCard from '../../drawcard.js';

class TheHound extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardEntersPlay: (event) => event.card === this
            },
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.hasTrait('Knight') &&
                    card.attachments.length === 0
            },
            handler: (context) => {
                this.game.addMessage(
                    "{0} uses {1} to return {2} to its owner's hand",
                    this.controller,
                    this,
                    context.target
                );
                context.target.owner.returnCardToHand(context.target);
            }
        });
    }
}

TheHound.code = '09029';

export default TheHound;
