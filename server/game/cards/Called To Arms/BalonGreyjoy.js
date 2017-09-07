const DrawCard = require('../../../drawcard.js');

class BalonGreyjoy extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => {
                var otherPlayer = this.game.getOtherPlayer(this.controller);

                return !otherPlayer ||
                    (this.game.currentChallenge &&
                    this.game.currentChallenge.challengeType === 'military' &&
                    !otherPlayer.anyCardsInPlay(card => card.hasTrait('King')));
            },
            match: this,
            effect: [
                ability.effects.doesNotKneelAsAttacker()
            ]
        });

        this.action({
            title: 'Kneel a Greyjoy location to give +1 to loyal characters',
            cost: ability.costs.kneel(card => card.isFaction('greyjoy') && card.getType() === 'location'),
            handler: context => {
                this.untilEndOfChallenge(ability => ({
                    match: card => card.isLoyal() && card.controller === this.controller && card.getType() === 'character',
                    effect: ability.effects.modifyStrength(1)
                }));

                this.game.addMessage('{0} uses {1} to kneel {2} and give +1 STR to each loyal character they control until the end of the challenge',
                    this.controller, this, context.kneelingCostCard);
            }
        });
    }
}

BalonGreyjoy.code = '04031';

module.exports = BalonGreyjoy;
