const DrawCard = require('../../drawcard');
const GameActions = require('../../GameActions');

class CaptainGroleo extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardEntersPlay: (event) =>
                    event.card.getType() === 'attachment' && this.controller.canGainGold()
            },
            message: '{player} uses {source} to gain 1 gold',
            handler: (context) => {
                this.game.resolveGameAction(
                    GameActions.gainGold((context) => ({
                        player: context.player,
                        amount: 1
                    })),
                    context
                );
            },
            limit: ability.limit.perPhase(1)
        });
    }
}

CaptainGroleo.code = '15012';

module.exports = CaptainGroleo;
