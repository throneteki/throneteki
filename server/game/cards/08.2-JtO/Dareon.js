import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class Dareon extends DrawCard {
    // Dareon (08025)
    // Reaction: After you play a Song event, choose an opponent. Move 1 gold from that player's
    // gold pool to your own. (Limit once per phase.)
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardPlayed: (event, context) =>
                    event.card.hasTrait('Song') && event.card.controller === context.player
            },
            limit: ability.limit.perPhase(1),
            chooseOpponent: true,
            message: {
                format: "{player} uses {source} to move 1 gold from {opponent}'s gold pool to their own",
                args: { opponent: (context) => context.opponent }
            },
            gameAction: GameActions.transferGold((context) => ({
                from: context.opponent,
                to: context.player,
                amount: 1
            }))
        });
    }
}

Dareon.code = '08025';

export default Dareon;
