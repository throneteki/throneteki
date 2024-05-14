const DrawCard = require('../../drawcard.js');
const TextHelper = require('../../TextHelper');

class LittleFinger extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardEntersPlay: (event) =>
                    event.card === this &&
                    event.playingType === 'marshal' &&
                    this.controller.canDraw()
            },
            handler: () => {
                let cards = this.controller.drawCardsToHand(2).length;
                this.game.addMessage(
                    '{0} uses {1} to draw {2}',
                    this.controller,
                    this,
                    TextHelper.count(cards, 'card')
                );
            }
        });
        this.plotModifiers({
            gold: 1
        });
    }
}

LittleFinger.code = '01028';

module.exports = LittleFinger;
