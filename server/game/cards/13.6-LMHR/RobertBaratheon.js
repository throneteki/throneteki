import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class RobertBaratheon extends DrawCard {
    // Robert Baratheon (13107)
    // Renown.
    // Reaction: After Robert Baratheon gains power, gain 1 power for your faction. (Limit twice per
    // round.)
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardPowerGained: (event, context) =>
                    event.card === context.source && context.source.controller.canGainFactionPower()
            },
            limit: ability.limit.perRound(2),
            message: '{player} uses {source} to gain 1 power for their faction',
            gameAction: GameActions.gainPower((context) => ({
                card: context.player.faction,
                amount: 1
            }))
        });
    }
}

RobertBaratheon.code = '13107';

export default RobertBaratheon;
