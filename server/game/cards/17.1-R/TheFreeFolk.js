import AgendaCard from '../../agendacard.js';

class TheFreeFolk extends AgendaCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.isMatch({
                        winner: this.controller,
                        attackingPlayer: this.controller
                    }) && event.challenge.attackers.some((card) => card.hasTrait('Wildling'))
            },
            cost: ability.costs.kneelFactionCard(),
            message:
                '{player} uses {source} and kneels their faction card raise the claim value on their revealed plot card by 1 until the end of the challenge',
            handler: (context) => {
                this.untilEndOfChallenge((ability) => ({
                    match: (card) => card === context.player.activePlot,
                    effect: ability.effects.modifyClaim(1)
                }));
            }
        });
    }
}

TheFreeFolk.code = '17150';

export default TheFreeFolk;
