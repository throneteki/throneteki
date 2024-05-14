const DrawCard = require('../../drawcard.js');

class BloodOfTheFirstMen extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentRestriction({ controller: 'current' });
        this.whileAttached({
            effect: ability.effects.addTrait('Old Gods')
        });
        this.action({
            title: 'Participate in challenge',
            condition: () =>
                this.isStarkCardParticipatingInChallenge() &&
                this.parent.canParticipateInChallenge(),
            cost: ability.costs.kneelParent(),
            handler: (context) => {
                this.game.currentChallenge.addParticipantToSide(context.player, this.parent);
                this.game.addMessage(
                    '{0} uses {1} and kneels {2} to add them to the challenge',
                    context.player,
                    this,
                    this.parent
                );
            }
        });
    }

    isStarkCardParticipatingInChallenge() {
        return this.controller.anyCardsInPlay(
            (card) => card.isParticipating() && card.isFaction('stark')
        );
    }
}

BloodOfTheFirstMen.code = '13102';

module.exports = BloodOfTheFirstMen;
