import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class KingsLanding extends DrawCard {
    // King's Landing (16020)
    // Reaction: After you marshal a location, draw 1 card. (Limit 3 times per round.)
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardEntersPlay: (event) =>
                    event.card.controller === this.controller &&
                    event.card.getType() === 'location' &&
                    event.playingType === 'marshal'
            },
            message: '{player} uses {source} to draw 1 card',
            gameAction: GameActions.drawCards((context) => ({
                player: context.player,
                amount: 1
            })),
            limit: ability.limit.perRound(3)
        });
    }
}

KingsLanding.code = '16020';

export default KingsLanding;
