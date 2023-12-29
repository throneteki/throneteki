const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions/index.js');

class BrokenMen extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: event => event.challenge.challengeType === 'military' && event.challenge.loser === this.controller
            },
            cost: ability.costs.sacrifice(card => card.getType() === 'location'),
            target: {
                cardCondition: { participating: true, or: [{ printedCostOrLower: 4 }, { trait: 'Army' }]}
            },
            message: '{player} plays {source} and sacrifices {costs.sacrificeCard} to discard {target} from play',
            handler: context => {
                this.game.resolveGameAction(GameActions.discardCard(context => ({ card: context.target, source: this })), context);
            }
        });
    }
}

BrokenMen.code = '24029';

module.exports = BrokenMen;
