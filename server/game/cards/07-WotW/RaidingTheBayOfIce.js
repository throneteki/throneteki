const DrawCard = require('../../drawcard');
const GameActions = require('../../GameActions');

class RaidingTheBayOfIce extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: event => event.challenge.winner === this.controller && event.challenge.attackingPlayer === this.controller
            },
            cost: ability.costs.kneel(card => card.hasTrait('Warship') && card.getType() === 'location'),
            target: {
                activePromptTitle: 'Select a location',
                cardCondition: card => (
                    card.location === 'play area' &&
                    !card.isLimited() &&
                    card.getType() === 'location' &&
                    card.controller === this.game.currentChallenge.loser &&
                    GameActions.returnCardToDeck({ card }).allow()
                )
            },
            message: '{player} plays {source} to place {target} on top of its owner\'s deck',
            handler: context => {
                this.game.resolveGameAction(
                    GameActions.returnCardToDeck(context => ({
                        card: context.target
                    })),
                    context
                );
            }
        });
    }
}

RaidingTheBayOfIce.code = '07028';

module.exports = RaidingTheBayOfIce;
