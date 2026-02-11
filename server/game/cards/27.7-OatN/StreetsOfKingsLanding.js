import AgendaCard from '../../agendacard.js';
import GameActions from '../../GameActions/index.js';

class StreetsOfKingsLanding extends AgendaCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () =>
                !this.controller.anyCardsInPlay({ trait: "King's Landing", type: 'location' }),
            match: (card) => card === this.controller.activePlot,
            effect: ability.effects.modifyGold(-1)
        });

        this.reaction({
            when: {
                afterChallenge: (event, context) => event.challenge.winner === context.player
            },
            cost: ability.costs.kneel({ type: 'location', trait: "King's Landing" }),
            message: {
                format: '{player} kneels {cost} to gain 1 power',
                args: { cost: (context) => context.costs.kneel }
            },
            handler: (context) => {
                this.game.resolveGameAction(
                    GameActions.gainPower((context) => ({
                        amount: 1,
                        card: context.costs.kneel
                    })),
                    context
                );
            },
            limit: ability.limit.perRound(3)
        });
    }
}

StreetsOfKingsLanding.code = '27620';
StreetsOfKingsLanding.version = '1.0.0';

export default StreetsOfKingsLanding;
