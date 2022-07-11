const DrawCard = require('../../drawcard.js');

class WingedKnight extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: card => card.hasTrait('House Arryn') && card.getType() === 'character',
            effect: ability.effects.modifyStrength(1)
        });

        this.interrupt({
            when: {
                onCharacterKilled: event => event.card.isMatch({ trait: ['Lord', 'Lady']}) && event.card.canBeSaved() && event.allowSave
            },
            cost: ability.costs.removeSelfFromGame(),
            message: {
                format: '{player} removes {source} from the game to put {character} on the bottom of it\'s owners deck instead of placing it in it\'s owners dead pile',
                args: { character: context => context.event.card }
            },
            handler: context => {
                context.replaceHandler(() => {
                    context.event.cardStateWhenKilled = this.createSnapshot();
                    this.controller.moveCard(context.event.card, 'draw deck', { bottom: true });
                });
            }
        });
    }
}

WingedKnight.code = '23029';

module.exports = WingedKnight;
