import DrawCard from '../../drawcard.js';

class SorrowfulMan extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardOutOfShadows: (event) =>
                    event.card === this &&
                    // This check needs to be here to allow targeting to be more seamless (in 1 targeting sequence, rather than 2)
                    // and to ensure there is a valid opponent to swap characters on
                    this.game
                        .getOpponents(this.controller)
                        .some((player) => this.hasCharacterInBothPiles(player))
            },
            target: {
                mode: 'exactly',
                numCards: 2,
                activePromptTitle: 'Select 2 characters',
                singleController: true,
                cardCondition: (card, context) =>
                    card.controller !== this.controller &&
                    ['discard pile', 'dead pile']
                        .filter(
                            (location) =>
                                !context.selectedCards.some((card) => card.location === location)
                        )
                        .includes(card.location)
            },
            message: {
                format: "{player} uses {source} to switch {discardCard} in {controller}'s discard pile with {deadCard} in their dead pile",
                args: {
                    discardCard: (context) =>
                        context.target.find((card) => card.location === 'discard pile'),
                    deadCard: (context) =>
                        context.target.find((card) => card.location === 'dead pile'),
                    controller: (context) => context.target[0].controller
                }
            },
            handler: (context) => {
                // TODO: Implement a "Switch" game action, which switches two cards from two separate out-of-play pile (retaining index)
                const discardCard = context.target.find((card) => card.location === 'discard pile');
                const deadCard = context.target.find((card) => card.location === 'dead pile');
                const opponent = context.target[0].controller;
                const discardIndex = opponent.discardPile.indexOf(discardCard);
                const deadIndex = opponent.discardPile.indexOf(discardCard);

                opponent.discardPile[discardIndex] = deadCard;
                deadCard.moveTo('discard pile');

                opponent.deadPile[deadIndex] = discardCard;
                discardCard.moveTo('dead pile');
            }
        });
    }

    hasCharacterInBothPiles(player) {
        return (
            player.discardPile.some((card) => card.getType() === 'character') &&
            player.deadPile.some((card) => card.getType() === 'character')
        );
    }
}

SorrowfulMan.code = '26033';

export default SorrowfulMan;
