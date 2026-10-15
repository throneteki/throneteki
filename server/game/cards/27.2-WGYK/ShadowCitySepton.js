import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class ShadowCitySepton extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onDominanceDetermined: (event) => event.winner && event.winner !== this.controller
            },
            cost: ability.costs.putSelfIntoShadows(),
            target: {
                choosingPlayer: (player, context) => player === context.event.winner,
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    !card.kneeled &&
                    card.controller === context.event.winner
            },
            message: {
                format: "{player} returns {source} to shadows to have {opponent} return {target} to its owner's hand",
                args: {
                    opponent: (context) => context.event.winner
                }
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

ShadowCitySepton.code = '27027';

export default ShadowCitySepton;
