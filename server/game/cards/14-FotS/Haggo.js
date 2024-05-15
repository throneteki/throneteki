import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class Haggo extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    this.isParticipating() && event.challenge.isMatch({ winner: this.controller })
            },
            cost: ability.costs.discardFromHand(),
            target: {
                activePromptTitle: 'Select a card',
                cardCondition: (card) =>
                    card.location === 'discard pile' &&
                    card.controller === this.controller &&
                    card.hasTrait('Dothraki')
            },
            message: {
                format: '{player} uses {source} and discards {discardedCard} to return {target} to hand',
                args: { discardedCard: (context) => context.costs.discardFromHand }
            },
            handler: (context) => {
                this.game.resolveGameAction(
                    GameActions.returnCardToHand((context) => ({ card: context.target })),
                    context
                );
            }
        });
    }
}

Haggo.code = '14035';

export default Haggo;
