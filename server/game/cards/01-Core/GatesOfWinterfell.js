const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions');

class GatesOfWinterfell extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Reveal top card of deck',
            phase: 'challenge',
            cost: ability.costs.kneelSelf(),
            message: '{player} kneels {source} to reveal the top card of their deck',
            gameAction: GameActions.revealTopCards(context => ({
                player: context.player
            })).then({
                message: '{player} {gameAction}',
                gameAction: GameActions.ifCondition({
                    condition: context => context.event.cards[0].isFaction('stark'),
                    thenAction: GameActions.drawCards(context => ({
                        player: context.player,
                        amount: 1
                    }))
                })
            })
        });
    }
}

GatesOfWinterfell.code = '01154';

module.exports = GatesOfWinterfell;
