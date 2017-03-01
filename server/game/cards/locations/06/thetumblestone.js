const DrawCard = require('../../../drawcard.js');

class TheTumblestone extends DrawCard {
    setupCardAbilities() {  
        this.reaction({
            when: {
                // Currently has false positive when power is moved to a character, should only trigger on 'gains'
                onCardPowerChanged: (event, card, power) => {
                    if(!card.hasTrait('House Tully') || card.getType() !== 'character' || power === 0 || this.tokens['gold'] === 0) {
                        return false;
                    }
                    
                    this.standCard = card;
                    return true;
                }
            },
            handler: () => {
                this.removeToken('gold', 1);
                this.standCard.controller.standCard(this.standCard);
                this.game.addMessage('{0} discards a gold from {1} to stand {2}', this.controller, this, this.standCard);
            }
        });
    }
}

TheTumblestone.code = '06002';

module.exports = TheTumblestone;
