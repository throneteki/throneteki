const DrawCard = require('../../drawcard.js');

class StormsEnd extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onDominanceDetermined: (event) => this.controller === event.winner
            },
            cost: ability.costs.discardFactionPower(1),
            target: {
                activePromptTitle: 'Select 2 characters',
                cardCondition: (card) =>
                    card.location === 'play area' && card.getType() === 'character',
                numCards: 2,
                multiSelect: true,
                gameAction: 'gainPower'
            },
            handler: (context) => {
                for (let card of context.target) {
                    card.modifyPower(1);
                }
                this.game.addMessage(
                    '{0} uses {1} and discards 1 power from their faction card to have {2} gain 1 power',
                    this.controller,
                    this,
                    context.target
                );
            }
        });
    }
}

StormsEnd.code = '06008';

module.exports = StormsEnd;
