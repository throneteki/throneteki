const GameActions = require('../../GameActions/index.js');
const DrawCard = require('../../drawcard.js');

class BowenMarsh extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardOutOfShadows: event => event.card.controller === this.controller
            },
            limit: ability.limit.perPhase(1),
            choices: {
                'Draw 1 card': {
                    message: '{player} uses {source} to draw 1 card',
                    gameAction: GameActions.drawCards(context => ({ player: context.player, amount: 1 }))
                },
                'Stand character': context => {
                    this.game.promptForSelect(context.player, {
                        cardCondition: { type: 'character', faction: 'thenightswatch', printedCostOrLower: 3 },
                        source: this,
                        onSelect: (player, card) => this.onCardSelected(player, card, context),
                        onCancel: player => this.onCancel(player)
                    });
                }
            }
        });
    }

    onCardSelected(player, card, context) {
        this.game.addMessage('{0} uses {1} to stand {2}', player, this, card);
        this.game.resolveGameAction(GameActions.standCard({ card }), context);
        return true;
    }

    onCancel(player) {
        this.game.addAlert('danger', '{0} did not select a card to stand', player);

        return true;
    }
}

BowenMarsh.code = '25549';
BowenMarsh.version = '1.0';

module.exports = BowenMarsh;
