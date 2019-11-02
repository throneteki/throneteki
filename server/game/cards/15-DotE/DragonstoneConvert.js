const DrawCard = require('../../drawcard');

class DragonstoneConvert extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Prevent event',
            phase: 'challenge',
            handler: () => {
                this.game.promptWithMenu(this.controller, this, {
                    activePrompt: {
                        menuTitle: 'Name an event',
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

        this.game.addMessage('{0} uses {1} to prevent events with the title {2} to be played', player, this, cardName);
        this.untilEndOfPhase(ability => ({
            targetController: 'any',
            effect: ability.effects.cannotPlay(ability => ability.card.name === cardName)
        }));

        return true;
    }

    isValidCardName(cardName) {
        return Object.values(this.game.cardData).some(card => (
            card.name === cardName &&
            card.type === 'event'
        ));
    }
}

DragonstoneConvert.code = '15026';

module.exports = DragonstoneConvert;
