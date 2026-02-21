import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class Godsgrace extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardPowerGained: (event) =>
                    event.card.isMatch({
                        type: 'character',
                        faction: 'martell',
                        controller: 'current'
                    })
            },
            condition: () =>
                this.game.getPlayers().some((player) => player.activePlot.hasTrait('Summer')),
            cost: ability.costs.kneelSelf(),
            message: {
                format: '{player} kneels {costs.kneel} to have {character} gain 1 power',
                args: { character: (context) => context.event.card }
            },
            gameAction: GameActions.gainPower((context) => ({ card: context.event.card }))
        });
    }
}

Godsgrace.code = '27545';
Godsgrace.version = '1.0.0';

export default Godsgrace;
