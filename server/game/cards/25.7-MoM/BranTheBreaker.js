const DrawCard = require('../../drawcard.js');

class BranTheBreaker extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentRestriction({ type: 'location', faction: 'stark', controller: 'current', unique: true });
        this.action({
            title: 'Raise claim by 1',
            condition: () => this.game.isDuringChallenge({ match: challenge => challenge.attackers.filter(card => this.isUniqueStark(card)).length >= 2 }),
            cost: ability.costs.kneelSelf(),
            message: '{player} kneels {source} to raise the claim value on their revealed plot card by 1 until the end of the challenge',
            handler: () => {
                this.untilEndOfChallenge(ability => ({
                    match: card => card === this.controller.activePlot,
                    effect: ability.effects.modifyClaim(1)
                }));
            }
        });
    }

    isUniqueStark(card) {
        return card.controller === this.controller && card.getType() === 'character' && card.isUnique() && card.isFaction('stark');
    }
}

BranTheBreaker.code = '25569';
BranTheBreaker.version = '1.3';

module.exports = BranTheBreaker;
