const DrawCard = require('../../drawcard.js');

class EddardStark extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardPowerGained: event => event.card === this && reason === 'renown'
            },
            target: {
                activePromptTitle: 'Select character to gain power',
                gameAction: 'gainPower',
                cardCondition: card => this.cardCondition(card)
            },
            handler: context => {
                context.target.modifyPower(1);
                this.game.addMessage('{0} uses {1} to have {2} gain 1 power', this.controller, this, context.target);
            }
        });
    }

    cardCondition(card) {
        return card !== this && card.controller === this.controller && card.getType() === 'character' && card.isParticipating();
    }
}

EddardStark.code = '03003';

module.exports = EddardStark;
