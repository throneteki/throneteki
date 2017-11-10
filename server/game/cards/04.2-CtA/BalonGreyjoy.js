const DrawCard = require('../../drawcard.js');

class BalonGreyjoy extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => {
                return (this.game.currentChallenge &&
                    this.game.currentChallenge.challengeType === 'military' &&
                    !this.game.currentChallenge.defendingPlayer.anyCardsInPlay(card => card.hasTrait('King')));
            },
            match: this,
            effect: [
                ability.effects.doesNotKneelAsAttacker()
            ]
        });

        this.action({
            title: 'Give loyal characters +1 STR',
            cost: ability.costs.kneel(card => card.isFaction('greyjoy') && card.getType() === 'location'),
            limit: ability.limit.perChallenge(1),
            handler: context => {
                this.untilEndOfChallenge(ability => ({
                    match: card => card.isLoyal() && card.controller === this.controller && card.getType() === 'character',
                    effect: ability.effects.modifyStrength(1)
                }));

                this.game.addMessage('{0} uses {1} and kneels {2} to give +1 STR to each loyal character they control until the end of the challenge',
                    this.controller, this, context.costs.kneel);
            }
        });
    }
}

BalonGreyjoy.code = '04031';

module.exports = BalonGreyjoy;
