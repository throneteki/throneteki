import DrawCard from '../../drawcard.js';

class NighttimeMarauders extends DrawCard {
    // Nighttime Marauders (11012)
    // Pillage. Shadow (3).
    // Reaction: After Nighttime Marauders comes out of shadows, choose a card in an opponent's
    // discard pile. That player reveals his or her hand and discards from it each card with the
    // same printed cost as the chosen card.
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardOutOfShadows: (event) => event.card === this
            },
            target: {
                activePromptTitle: 'Select a card',
                cardCondition: (card) =>
                    card.controller !== this.controller && card.location === 'discard pile'
            },
            handler: (context) => {
                let opponent = context.target.controller;
                let cardsToDiscard = opponent.hand.filter(
                    (card) =>
                        card.hasPrintedCost() &&
                        card.getPrintedCost() === context.target.getPrintedCost()
                );
                opponent.discardCards(cardsToDiscard, false);
                this.game.addMessage(
                    '{0} uses {1} to choose {2} and have {3} reveal their hand: {4}',
                    this.controller,
                    this,
                    context.target,
                    opponent,
                    opponent.hand
                );
                this.game.addMessage('{0} discards {1}', opponent, cardsToDiscard);
            }
        });
    }
}

NighttimeMarauders.code = '11012';

export default NighttimeMarauders;
