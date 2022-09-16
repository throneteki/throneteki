const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions');

class GatesOfWinterfell extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Reveal top card of deck',
            phase: 'challenge',
            cost: ability.costs.kneelSelf(),
            message: '{player} kneels {costs.kneel} to reveal the top card of their deck',
            gameAction: GameActions.revealTopCards(context => ({
                player: context.player
            })).then({
                condition: context => context.event.cards[0].isFaction('stark'),
                message: '{player} {gameAction}',
                gameAction: GameActions.drawSpecific(context => ({
                    player: context.player,
                    cards: context.event.revealed
                }))
            })
        });
    }
}

GatesOfWinterfell.code = '01154';

module.exports = GatesOfWinterfell;
