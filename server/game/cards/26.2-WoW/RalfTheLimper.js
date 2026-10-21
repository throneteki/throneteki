import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class RalfTheLimper extends DrawCard {
    // Ralf the Limper (26023)
    // Pillage. Shadow (5).
    // Reaction: After a non-character card is discarded from an opponent's deck, choose a card you
    // control with shadow and return it to shadows. (Limit twice per round.)
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardDiscarded: (event) =>
                    event.card.controller !== this.controller &&
                    event.originalLocation === 'draw deck' &&
                    event.card.getType() !== 'character'
            },
            target: {
                cardCondition: { location: 'play area', controller: 'current', shadow: true }
            },
            message: '{player} uses {source} to return {target} to shadows',
            limit: ability.limit.perRound(2),
            handler: (context) => {
                this.game.resolveGameAction(
                    GameActions.putIntoShadows((context) => ({ card: context.target })),
                    context
                );
            }
        });
    }
}

RalfTheLimper.code = '26023';

export default RalfTheLimper;
