import PlotCard from '../../plotcard.js';

class WardensOfTheNorth extends PlotCard {
    // Wardens of the North (02062)
    // Challenges Action: During a challenge in which you control a participating [stark] character,
    // kneel another [stark] character to have it participate in that challenge on your side. (Limit
    // twice per round.)
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

export default WardensOfTheNorth;
