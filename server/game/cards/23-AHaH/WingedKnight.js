const DrawCard = require('../../drawcard.js');

class WingedKnight extends DrawCard {
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onCharacterKilled: event => event.card.isMatch({ trait: ['Lord', 'Lady']})
            },
            cost: ability.costs.sacrificeSelf(),
            message: {
                format: '{player} sacrifices {source} to remove {character} from the game instead of placing it in it\'s owners dead pile',
                args: { character: context => context.event.card }
            },
            handler: context => {
                context.replaceHandler(() => {
                    context.event.cardStateWhenKilled = context.event.card.createSnapshot();
                    this.controller.moveCard(context.event.card, 'out of game');
                });
            }
        });
    }
}

WingedKnight.code = '23029';

module.exports = WingedKnight;
