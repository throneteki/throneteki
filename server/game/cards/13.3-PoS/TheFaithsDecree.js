const DrawCard = require('../../drawcard');

class TheFaithsDecree extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Prevent abilities',
            condition: context => context.player.anyCardsInPlay({ type: ['character', 'location'], trait: 'The Seven' }),
            handler: () => {
                this.game.promptWithMenu(this.controller, this, {
                    activePrompt: {
                        menuTitle: 'Name a card',
                        controls: [
                            { type: 'card-name', command: 'menuButton', method: 'selectCardName' }
                        ]
                    },
                    source: this
                });
            }
        });
    }

    selectCardName(player, cardName) {
        if(!this.isValidCardName(cardName)) {
            return false;
        }

        this.game.addMessage('{0} plays {1} to prevent opponent\'s from triggering {2}', player, cardName, this);
        this.untilEndOfPhase(ability => ({
            targetController: 'opponent',
            effect: ability.effects.cannotTriggerCardAbilities(ability => ability.card.name === cardName)
        }));

        return true;
    }

    isValidCardName(cardName) {
        return Object.values(this.game.cardData).some(card => (
            card.name === cardName &&
            !['agenda', 'plot'].includes(card.type)
        ));
    }
}

TheFaithsDecree.code = '13059';

module.exports = TheFaithsDecree;
