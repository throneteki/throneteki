const PlotCard = require('../../plotcard.js');

class WardensOfTheNorth extends PlotCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Kneel a character to have it participate in the current challenge',
            phase: 'challenge',
            limit: ability.limit.perRound(2),
            condition: () => this.isStarkCardParticipatingInChallenge(),
            cost: ability.costs.kneel(
                (card) =>
                    card.getType() === 'character' &&
                    card.isFaction('stark') &&
                    card.canParticipateInChallenge()
            ),
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

    isStarkCardParticipatingInChallenge() {
        return this.controller.anyCardsInPlay(
            (card) => card.isParticipating() && card.isFaction('stark')
        );
    }
}

WardensOfTheNorth.code = '02062';

module.exports = WardensOfTheNorth;
