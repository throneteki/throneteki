import DrawCard from '../../drawcard.js';

class NuteTheBarber extends DrawCard {
    // Nute the Barber (06091)
    // Pillage.
    // Reaction: After a character you control discards a card using pillage, return a card from the
    // losing opponent's discard pile to its owner's hand. Then, draw 1 card. (Limit 3 times per
    // phase.)
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardDiscarded: (event) =>
                    event.isPillage && event.source.controller === this.controller
            },
            limit: ability.limit.perPhase(3),
            target: {
                activePromptTitle: 'Select a card',
                cardCondition: (card) =>
                    card.location === 'discard pile' &&
                    card.controller === this.game.currentChallenge.loser
            },
            handler: (context) => {
                context.target.owner.moveCard(context.target, 'hand');
                this.game.addMessage(
                    "{0} uses {1} to return {2} to {3}'s hand",
                    this.controller,
                    this,
                    context.target,
                    context.target.owner
                );
                if (this.controller.canDraw()) {
                    this.controller.drawCardsToHand(1);
                    this.game.addMessage('{0} then draws 1 card', this.controller);
                }
            }
        });
    }
}

NuteTheBarber.code = '06091';

export default NuteTheBarber;
