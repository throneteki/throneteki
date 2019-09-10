const DrawCard = require('../../drawcard.js');

class BloodOfTheFirstMen extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentRestriction({ controller: 'current' });        
        this.whileAttached({
            effect: ability.effects.addTrait('Old Gods')
        });
        this.action({
            title: 'Kneel attached character to have it participate in the current challenge',
            condition: () => (
                this.isStarkCardParticipatingInChallenge() && 
                !this.parent.kneeled &&
                this.parent.allowGameAction('kneel')),
            cost: ability.costs.kneel(card => card === this.parent && card.canParticipateInChallenge()),
            handler: context => {
                this.game.currentChallenge.addParticipantToSide(context.player, this.parent);
                this.game.addMessage('{0} uses {1} to kneel {2} and add them to the challenge', context.player, this, this.parent);
            }
        });
    }

    isStarkCardParticipatingInChallenge() {
        return this.controller.anyCardsInPlay(card => card.isParticipating() && card.isFaction('stark'));
    }
}

BloodOfTheFirstMen.code = '13102';

module.exports = BloodOfTheFirstMen;
