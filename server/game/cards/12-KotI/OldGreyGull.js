const DrawCard = require('../../drawcard');

class OldGreyGull extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Kill and return character',
            cost: ability.costs.kneelSelf(),
            target: {
                type: 'select',
                cardCondition: (card) =>
                    card !== this &&
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.isFaction('greyjoy') &&
                    card.controller === this.controller
            },
            message: '{player} kneels {source} to kill {target}',
            handler: (context) => {
                this.game.killCharacter(context.target);
                this.game.queueSimpleStep(() => {
                    if (context.target.location !== 'dead pile') {
                        return;
                    }

                    this.promptToReturnCard(context.player, context.target);
                });
            }
        });
    }

    promptToReturnCard(player, card) {
        this.game.promptWithMenu(player, this, {
            activePrompt: {
                menuTitle: `Return ${card.name} to hand?`,
                buttons: [
                    { text: 'Yes', method: 'returnSelectedToHand', card: card, mapCard: true },
                    { text: 'No', method: 'cancelSelection' }
                ]
            },
            source: this
        });
    }

    returnSelectedToHand(player, card) {
        this.game.addMessage('Then {0} returns {1} to their hand', player, card);
        player.returnCardToHand(card);
        return true;
    }

    cancelSelection() {
        return true;
    }
}

OldGreyGull.code = '12011';

module.exports = OldGreyGull;
