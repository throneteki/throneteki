const DrawCard = require('../../drawcard');

class DragonstoneConvert extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Prevent event',
            phase: 'challenge',
            handler: context => {
                this.game.promptForCardName({
                    player: context.player,
                    title: 'Name an event',
                    match: cardData => cardData.type === 'event',
                    onSelect: (player, cardName) => this.selectCardName(player, cardName),
                    source: this
                });
            }
        });
    }

    selectCardName(player, cardName) {
        this.game.addMessage('{0} uses {1} to prevent events with the title {2} to be played', player, this, cardName);
        this.untilEndOfPhase(ability => ({
            targetController: 'any',
            effect: ability.effects.cannotPlay(card => card.name === cardName)
        }));
    }
}

DragonstoneConvert.code = '15026';

module.exports = DragonstoneConvert;
