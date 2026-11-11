import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class Rhaegal extends DrawCard {
    // Rhaegal (01164)
    // No attachments.
    // Reaction: After you win a challenge in which a Stormborn character you control is
    // participating, choose and stand a Stormborn character. (Limit once per phase.)
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.winner === context.source.controller &&
                    event.challenge.getWinnerCards().some((card) => card.hasTrait('Stormborn'))
            },
            limit: ability.limit.perPhase(1),
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.hasTrait('Stormborn') &&
                    card.kneeled
            },
            message: '{player} uses {source} to stand {target}',
            gameAction: GameActions.standCard((context) => ({ card: context.target }))
        });
    }
}

Rhaegal.code = '01164';

export default Rhaegal;
