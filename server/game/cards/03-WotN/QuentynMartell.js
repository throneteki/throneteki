const DrawCard = require('../../drawcard.js');

class QuentynMartell extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => !this.controller.firstPlayer,
            match: this,
            effect: [ability.effects.modifyStrength(1), ability.effects.addKeyword('Stealth')]
        });
        this.interrupt({
            when: {
                onCharacterKilled: (event) => event.card === this
            },
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.getStrength() < this.getStrength(),
                gameAction: 'kill'
            },
            handler: (context) => {
                this.game.killCharacter(context.target);
                this.game.addMessage(
                    '{0} uses {1} to kill {2}',
                    this.controller,
                    this,
                    context.target
                );
            }
        });
    }
}

QuentynMartell.code = '03031';

module.exports = QuentynMartell;
