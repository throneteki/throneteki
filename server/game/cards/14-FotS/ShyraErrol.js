const DrawCard = require('../../drawcard');
const GameActions = require('../../GameActions');

class ShyraErrol extends DrawCard {
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
            handler: (context) => {
                this.game.resolveGameAction(
                    GameActions.movePower((context) => ({
                        from: context.event.card,
                        to: context.event.card.controller.faction,
                        amount: context.event.card.power
                    })),
                    context
                );
            }
        });
    }
}

ShyraErrol.code = '14013';

module.exports = ShyraErrol;
