import DrawCard from '../../drawcard.js';

class RedKeepSpy extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardEntersPlay: (event) => event.playingType === 'ambush' && this === event.card
            },
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.controller !== this.controller &&
                    card.controller.getHandCount() < this.controller.getHandCount() &&
                    card.getType() === 'character' &&
                    card.getPrintedCost() <= 3
            },
            handler: (context) => {
                context.target.owner.returnCardToHand(context.target);
                this.game.addMessage(
                    "{0} uses {1} to return {2} to {3}'s hand",
                    this.controller,
                    this,
                    context.target,
                    context.target.controller
                );
            }
        });
    }
}

RedKeepSpy.code = '05012';

export default RedKeepSpy;
