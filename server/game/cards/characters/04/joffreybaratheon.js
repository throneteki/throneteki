const DrawCard = require('../../../drawcard.js');

class JoffreyBaratheon extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardEntersPlay: (event, card) => {
                    if(this.controller !== card.controller || this.controller.phase !== 'marshal' || card.getType() !== 'character' || !card.isLoyal()) {
                        return false;
                    }

                    this.pendingCard = card;

                    return true;
                }
            },
            cost: [
                ability.costs.kneel(card => card === this.pendingCard),
                ability.costs.kneelFactionCard()
            ],
            handler: () => {
                this.game.promptForSelect(this.controller, {
                    activePromptTitle: 'Select a character to kill',
                    source: this,
                    cardCondition: card => (
                        card.location === 'play area' && 
                        !card.hasTrait('King') &&
                        card.getType() === 'character' && 
                        card.getCost() < this.pendingCard.getCost()),
                    onSelect: (p, card) => {
                        card.controller.killCharacter(card);
                        this.game.addMessage('{0} uses {1} to kneel {2} and their faction card to kill {3}', this.controller, this, this.pendingCard, card);
                        
                        return true;
                    }
                });
            }
        });
    }
}

JoffreyBaratheon.code = '04089';

module.exports = JoffreyBaratheon;
