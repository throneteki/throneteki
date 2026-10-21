import DrawCard from '../../drawcard.js';

class ChangeOfPlans extends DrawCard {
    // Change of Plans (08036)
    // Reaction: After you lose a challenge, if there are fewer than 5 plot cards in your used pile,
    // move a card from your plot deck to the bottom of your used pile.
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.loser === this.controller &&
                    this.controller.getNumberOfUsedPlots() < 5
            },
            target: {
                type: 'select',
                activePromptTitle: 'Select a plot',
                cardCondition: (card) =>
                    card.location === 'plot deck' && card.controller === this.controller,
                cardType: 'plot'
            },
            handler: (context) => {
                context.player.moveCard(context.target, 'revealed plots', { bottom: true });
                this.game.addMessage(
                    '{0} plays {1} to place {2} on the bottom of their used pile',
                    context.player,
                    this,
                    context.target
                );
            }
        });
    }
}

ChangeOfPlans.code = '08036';

export default ChangeOfPlans;
