import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class WhenMenSeeMySailsTheyPray extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.winner === this.controller && event.challenge.isUnopposed()
            },
            max: ability.limit.perChallenge(1),
            message:
                '{player} plays {source} to search the top 10 cards of their deck for a character',
            gameAction: GameActions.search({
                title: 'Select a character',
                topCards: 10,
                match: { type: 'character', faction: 'greyjoy', printedCostOrHigher: 6 },
                reveal: false,
                message: '{player} chooses to search their deck and {gameAction}',
                gameAction: GameActions.putIntoPlay((context) => ({
                    card: context.searchTarget,
                    kneeled: true
                }))
            })
        });
    }
}

WhenMenSeeMySailsTheyPray.code = '27524';
WhenMenSeeMySailsTheyPray.version = '1.0.0';

export default WhenMenSeeMySailsTheyPray;
