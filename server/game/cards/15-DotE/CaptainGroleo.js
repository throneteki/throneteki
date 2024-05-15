import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

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

export default CaptainGroleo;
