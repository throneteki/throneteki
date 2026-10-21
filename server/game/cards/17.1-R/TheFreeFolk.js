import GameActions from '../../GameActions/index.js';
import AgendaCard from '../../agendacard.js';

class TheFreeFolk extends AgendaCard {
    // The Free Folk (17150)
    // Your plot deck and draw deck can only include neutral cards and non-loyal Wildling characters
    // from any faction.
    // Reaction: After you win a challenge in which you control an attacking Wildling character,
    // kneel your faction card to raise the claim value on your revealed plot card by 1 until the
    // end of the challenge.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.isMatch({
                        winner: context.source.controller,
                        attackingPlayer: context.source.controller
                    }) && event.challenge.attackers.some((card) => card.hasTrait('Wildling'))
            },
            cost: ability.costs.kneelFactionCard(),
            message:
                '{player} uses {source} and kneels their faction card raise the claim value on their revealed plot card by 1 until the end of the challenge',
            gameAction: GameActions.lastingEffect((context) => ({
                duration: 'untilEndOfChallenge',
                match: (card) => card === context.player.activePlot,
                effect: ability.effects.modifyClaim(1)
            }))
        });
    }
}

TheFreeFolk.code = '17150';

export default TheFreeFolk;
