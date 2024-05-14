const DrawCard = require('../../drawcard.js');
const { Tokens } = require('../../Constants');

class SaltcliffeSailor extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card) => card.getType() === 'character' && card.hasToken(Tokens.gold),
            effect: ability.effects.addKeyword('Stealth')
        });
        this.action({
            title: 'Move 1 gold to character',
            condition: () => this.hasToken(Tokens.gold),
            target: {
                type: 'select',
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.controller === this.controller &&
                    !card.isFaction('greyjoy')
            },
            handler: (context) => {
                this.game.transferGold({ from: this, to: context.target, amount: 1 });
                this.game.addMessage(
                    '{0} moves 1 gold from {1} to {2}',
                    this.controller,
                    this,
                    context.target
                );
            }
        });
    }
}

SaltcliffeSailor.code = '08111';

module.exports = SaltcliffeSailor;
