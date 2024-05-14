const DrawCard = require('../../drawcard.js');

class BalonGreyjoy extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => {
                return (
                    this.game.currentChallenge &&
                    !this.game.currentChallenge.defendingPlayer.anyCardsInPlay((card) =>
                        card.hasTrait('King')
                    )
                );
            },
            match: this,
            effect: [ability.effects.doesNotKneelAsAttacker({ challengeType: 'military' })]
        });

        this.action({
            title: 'Give loyal characters +1 STR',
            condition: () => this.game.currentChallenge,
            cost: ability.costs.kneel(
                (card) => card.isFaction('greyjoy') && card.getType() === 'location'
            ),
            limit: ability.limit.perChallenge(1),
            handler: (context) => {
                let loyalChars = this.controller.filterCardsInPlay(
                    (card) => card.isLoyal() && card.getType() === 'character'
                );
                this.untilEndOfChallenge((ability) => ({
                    match: loyalChars,
                    effect: ability.effects.modifyStrength(1)
                }));

                this.game.addMessage(
                    '{0} uses {1} and kneels {2} to give +1 STR to each loyal character they control until the end of the challenge',
                    this.controller,
                    this,
                    context.costs.kneel
                );
            }
        });
    }
}

BalonGreyjoy.code = '04031';

module.exports = BalonGreyjoy;
