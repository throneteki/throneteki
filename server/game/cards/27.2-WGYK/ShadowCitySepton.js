import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class ShadowCitySepton extends DrawCard {
    // Shadow City Septon (27027)
    // Shadow (3).
    // Reaction: After you lose dominance, return Shadow City Septon to shadows to have the winning
    // opponent choose a standing character they control. Return that character to its owner's hand.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onDominanceDetermined: (event, context) =>
                    event.winner && event.winner !== context.player
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
            gameAction: GameActions.returnCardToHand((context) => ({ card: context.target }))
        });
    }
}

ShadowCitySepton.code = '27027';

export default ShadowCitySepton;
