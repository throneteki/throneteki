import DrawCard from '../../drawcard.js';

class Rhaegal extends DrawCard {
    // Rhaegal (01164)
    // No attachments.
    // Reaction: After you win a challenge in which a Stormborn character you control is
    // participating, choose and stand a Stormborn character. (Limit once per phase.)
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.winner === this.controller &&
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
            handler: (context) => {
                this.controller.standCard(context.target);
                this.game.addMessage(
                    '{0} uses {1} to stand {2}',
                    this.controller,
                    this,
                    context.target
                );
            }
        });
    }
}

Rhaegal.code = '01164';

export default Rhaegal;
