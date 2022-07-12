const DrawCard = require('../../drawcard.js');

class DefensiveDebris extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentRestriction({ trait: 'Lord', printedCostOrHigher: 6 });

        this.plotModifiers({
            initiative: 1
        });

        this.whileAttached({
            effect: ability.effects.addTrait('House Arryn')
        });

        this.whileAttached({
            match: card => card.name === 'Littlefinger',
            effect: ability.effects.addKeyword('Renown')
        });

        this.reaction({
            when: {
                onCardDrawn: event =>
                    event.player === this.controller &&
                    event.card.hasTrait('House Arryn') &&
                    event.player.canGainGold()
            },
            cost: ability.costs.revealSpecific(context => context.event.card),
            message: {
                format: '{player} reveals {drawnCard} to gain 1 gold',
                args: { drawnCard: context => context.event.card }
            },
            handler: context => {
                this.game.addGold(context.player, 1);
            }
        });
    }
}

DefensiveDebris.code = '23035';

module.exports = DefensiveDebris;
