import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class ChangeOfPlans extends DrawCard {
    // Change of Plans (08036)
    // Reaction: After you lose a challenge, if there are fewer than 5 plot cards in your used pile,
    // move a card from your plot deck to the bottom of your used pile.
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.loser === context.player &&
                    context.player.getNumberOfUsedPlots() < 5
            },
            target: {
                type: 'select',
                activePromptTitle: 'Select a plot',
                cardCondition: (card, context) =>
                    card.location === 'plot deck' && card.controller === context.player,
                cardType: 'plot'
            },
            message: '{player} plays {source} to place {target} on the bottom of their used pile',
            gameAction: GameActions.placeCard((context) => ({
                card: context.target,
                location: 'revealed plots',
                bottom: true
            }))
        });
    }
}

ChangeOfPlans.code = '08036';

export default ChangeOfPlans;
