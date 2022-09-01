const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions/index.js');

class SupportOfThePeople extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: event => (
                    event.challenge.challengeType === 'power' &&
                    event.challenge.winner === this.controller &&
                    event.challenge.strengthDifference >= 5
                )
            },
            max: ability.limit.perChallenge(1),
            message: '{player} plays {source} to search their deck for a location with a printed cost of 3 or lower',
            gameAction: GameActions.search({
                title: 'Select a location',
                match: { type: 'location', printedCostOrLower: 3 },
                reveal: false,
                message: '{player} {gameAction}',
                gameAction: GameActions.putIntoPlay(context => ({
                    card: context.searchTarget
                }))
            })
        });
    }
}

SupportOfThePeople.code = '02017';

module.exports = SupportOfThePeople;
