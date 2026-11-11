import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class ShyraErrol extends DrawCard {
    // Shyra Errol (14013)
    // Interrupt: When a character is killed, sacrifice Shyra Errol to move each power from that
    // character to its controller's faction card.
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onCharacterKilled: (event) => event.card.power > 0
            },
            cost: ability.costs.sacrificeSelf(),
            message: {
                format: "{player} sacrifices {source} to move power from {powerCard} to {powerController}'s faction card",
                args: {
                    powerCard: (context) => context.event.card,
                    powerController: (context) => context.event.card.controller
                }
            },
            gameAction: GameActions.movePower((context) => ({
                from: context.event.card,
                to: context.event.card.controller.faction,
                amount: context.event.card.power
            }))
        });
    }
}

ShyraErrol.code = '14013';

export default ShyraErrol;
