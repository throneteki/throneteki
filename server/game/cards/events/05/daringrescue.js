const DrawCard = require('../../../drawcard.js');

class DaringRescue extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Return character then have knight gain power',
            condition: () => this.hasKnightCharacter(),
            phase: 'challenge',
            target: {
                activePromptTitle: 'Select a character to return',
                cardCondition: card => (
                    card.location === 'play area' && 
                    card.controller === this.controller && 
                    card.getType() === 'character')
            },
            handler: context => {
                this.controller.moveCard(context.target, 'hand');
                this.game.addMessage('{0} plays {1} to return {2} to its owner\'s hand', 
                                      this.controller, this, context.target);
                this.game.promptForSelect(this.controller, {
                    activePromptTitle: 'Select a Knight character',
                    source: this,
                    cardCondition: card => (
                        card.location === 'play area' && 
                        card.hasTrait('Knight') &&
                        card.getType() === 'character' && 
                        card.controller === this.controller),
                    onSelect: (p, card) => {
                        card.modifyPower(1);
                        this.game.addMessage('{0} then uses {1} to have {3} gain 1 power', 
                                              this.controller, this, context.target, card);
                        
                        return true;
                    }
                });
            }
        });
    }

    hasKnightCharacter() {
        return this.controller.anyCardsInPlay(card => card.hasTrait('Knight') && card.getType() === 'character');
    }
}

DaringRescue.code = '05024';

module.exports = DaringRescue;
