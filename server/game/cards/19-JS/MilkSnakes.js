const DrawCard = require('../../drawcard.js');
const { Tokens } = require('../../Constants');

class MilkSnakes extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card) =>
                card.getType() === 'character' &&
                card.hasTrait('Clansman') &&
                card.hasToken(Tokens.gold),
            effect: ability.effects.addIcon('power')
        });
        this.action({
            title: 'Move 1 gold to character',
            condition: () => this.hasToken(Tokens.gold),
            target: {
                type: 'select',
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.controller === context.player &&
                    card.hasTrait('Clansman')
            },
            handler: (context) => {
                this.game.transferGold({ from: this, to: context.target, amount: 1 });
                this.game.addMessage(
                    '{0} moves 1 gold from {1} to {2}',
                    context.player,
                    this,
                    context.target
                );
            }
        });
    }
}

MilkSnakes.code = '19005';

module.exports = MilkSnakes;
