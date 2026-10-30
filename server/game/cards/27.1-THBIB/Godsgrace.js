import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class Godsgrace extends DrawCard {
    // Godsgrace (27008)
    // Reaction: After a [martell] character you control gains power, if there is a Summer plot card
    // revealed, kneel Godsgrace to have that character gain 1 power.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardPowerGained: (event, context) =>
                    event.card.controller === context.source.controller &&
                    event.card.isMatch({ type: 'character', faction: 'martell' })
            },
            condition: (context) =>
                context.game.getPlayers().some((player) => player.activePlot?.hasTrait('Summer')),
            cost: ability.costs.kneelSelf(),
            message: {
                format: '{player} kneels {costs.kneel} to have {character} gain 1 power',
                args: { character: (context) => context.event.card }
            },
            gameAction: GameActions.gainPower((context) => ({ card: context.event.card }))
        });
    }
}

Godsgrace.code = '27008';

export default Godsgrace;
