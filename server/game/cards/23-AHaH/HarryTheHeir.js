const DrawCard = require('../../drawcard.js');

class HarryTheHeir extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.controller.getNumberOfCardsInPlay(card => card.hasTrait('House Arryn') && card.hasTrait('Lady')),
            match: this,
            effect: [
                ability.effects.addIcon('power'),
                ability.effects.addKeyword('Stealth')
            ]
        });
        this.action({
            title: 'Add participating defender',
            phase: 'challenge',
            condition: context => this.game.isDuringChallenge({ defendingPlayer: context.player }),
            target: {
                title: 'Select a character',
                cardCondition: { participating: false, kneeled: true, condition: (card, context) => card.hasPrintedCost() && card.getPrintedCost() >= context.choosingPlayer.getTotalInitiative() }
            },
            message: '{player} uses {source} to have {target} participate as a defender on their side of the challenge',
            handler: context => {
                this.game.currentChallenge.addParticipantToSide(context.player, context.target);
            }
        });
    }
}

HarryTheHeir.code = '23022';

module.exports = HarryTheHeir;
