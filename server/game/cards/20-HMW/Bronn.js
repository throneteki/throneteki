const DrawCard = require('../../drawcard.js');
const { Tokens } = require('../../Constants');

class Bronn extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            effect: ability.effects.dynamicStrength(() => this.tokens[Tokens.gold] * 2)
        });

        this.interrupt({
            canCancel: true,
            when: {
                onCharacterKilled: (event) =>
                    event.allowSave &&
                    (event.card.hasTrait('Lord') || event.card.hasTrait('Lady')) &&
                    event.card.canBeSaved() &&
                    this.tokens[Tokens.gold] > 0
            },
            cost: ability.costs.discardGold(() => this.tokens[Tokens.gold]),
            handler: (context) => {
                context.event.saveCard();
                this.game.addMessage(
                    '{0} discards each gold from {1} to save {2}',
                    context.player,
                    this,
                    context.event.card
                );

                if (context.event.card.name === 'Tyrion Lannister') {
                    this.game.promptWithMenu(context.player, this, {
                        activePrompt: {
                            menuTitle: 'Return Bronn to hand?',
                            buttons: [
                                { text: 'Yes', method: 'returnBronn' },
                                { text: 'No', method: 'cancel' }
                            ]
                        },
                        source: this
                    });
                }
            }
        });
    }

    returnBronn(player) {
        player.moveCard(this, 'hand');
        this.game.addMessage('{0} then returns {1} to hand', player, this);
        return true;
    }

    cancel() {
        return true;
    }
}

Bronn.code = '20012';

module.exports = Bronn;
