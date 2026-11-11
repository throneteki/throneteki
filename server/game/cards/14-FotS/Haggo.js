import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class Haggo extends DrawCard {
    // Haggo (14035)
    // Reaction: After you win a challenge in which Haggo is participating, discard a card from your
    // hand to choose a Dothraki card in your discard pile and return it to your hand.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    context.source.isParticipating() &&
                    event.challenge.isMatch({ winner: context.source.controller })
            },
            cost: ability.costs.discardFromHand(),
            target: {
                activePromptTitle: 'Select a card',
                cardCondition: (card, context) =>
                    card.location === 'discard pile' &&
                    card.controller === context.source.controller &&
                    card.hasTrait('Dothraki')
            },
            message: {
                format: '{player} uses {source} and discards {discardedCard} to return {target} to hand',
                args: { discardedCard: (context) => context.costs.discardFromHand }
            },
            gameAction: GameActions.returnCardToHand((context) => ({ card: context.target }))
        });
    }
}

Haggo.code = '14035';

export default Haggo;
