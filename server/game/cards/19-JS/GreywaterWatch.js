const DrawCard = require('../../drawcard.js');

class GreywaterWatch extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Kneel a character to have it participate',
            phase: 'challenge',
            max: ability.limit.perChallenge(1),
            condition: () => this.game.isDuringChallenge(),
            cost: [
                ability.costs.kneelSelf(),
                ability.costs.putSelfIntoShadows(),
                ability.costs.kneel(
                    (card) =>
                        card.getType() === 'character' &&
                        card.isFaction('stark') &&
                        card.canParticipateInChallenge()
                )
            ],
            handler: (context) => {
                let card = context.costs.kneel;
                this.game.currentChallenge.addParticipantToSide(context.player, card);

                this.game.addMessage(
                    '{0} uses {1} to kneel {2} and add them to the challenge',
                    context.player,
                    this,
                    card
                );
            }
        });
    }
}

GreywaterWatch.code = '19011';

module.exports = GreywaterWatch;
