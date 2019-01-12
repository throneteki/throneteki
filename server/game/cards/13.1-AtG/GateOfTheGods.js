const DrawCard = require('../../drawcard.js');
const TextHelper = require('../../TextHelper');

class GateOfTheGods extends DrawCard {
    setupCardAbilities(ability) {
        this.plotModifiers({
            gold: 1
        });
        this.action({
            title: 'Sacrifice to draw 2 cards',
            condition: () => this.characterWithHighestStrength(),
            phase: 'challenge',
            cost: ability.costs.sacrificeSelf(),
            handler: () => {
                let cards = this.controller.drawCardsToHand(2).length;
                this.game.addMessage('{0} sacrifices {1} to draw {2}', 
                    this.controller, this, TextHelper.count(cards, 'card'));
            }
        });
    }

    characterWithHighestStrength() {
        let charactersInPlay = this.game.filterCardsInPlay(card => card.getType() === 'character');
        if(charactersInPlay.length === 0) {
            return false;
        }
        let cardWithHighestStrength;
        let highestStrength = 0;
        charactersInPlay.forEach(function(card) {
            if(card.getStrength() > highestStrength) {
                cardWithHighestStrength = card;
                highestStrength = card.getStrength();
            } else if(card.getStrength() === highestStrength) {
                cardWithHighestStrength = null;
            }
        });
        return (cardWithHighestStrength && cardWithHighestStrength.controller === this.controller);
    }
}

GateOfTheGods.code = '13004';

module.exports = GateOfTheGods;
