import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class ShadowblackLane extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.winner === this.controller &&
                    event.challenge.challengeType === 'intrigue'
            },
            cost: ability.costs.kneelFactionCard(),
            message:
                '{player} uses {source} and kneels their faction card to search the top 10 cards of their deck for an in-faction event',
            gameAction: GameActions.search({
                topCards: 10,
                title: 'Select an event',
                match: {
                    type: 'event',
                    condition: (card) => card.isFaction(this.controller.getFaction())
                },
                message: '{player} {gameAction}',
                gameAction: GameActions.addToHand((context) => ({
                    card: context.searchTarget
                }))
            })
        });
    }
}

ShadowblackLane.code = '02038';

export default ShadowblackLane;
