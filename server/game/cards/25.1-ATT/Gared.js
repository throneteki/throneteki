import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class Gared extends DrawCard {
    // Gared (25009)
    // No attachments except Weapon.
    // Interrupt: When an Omen plot card is revealed, kneel each opponent's faction card.
    setupCardAbilities() {
        this.interrupt({
            when: {
                onPlotRevealed: (event) => event.plot.hasTrait('Omen')
            },
            message: "{player} uses {source} to kneel each opponent's faction card",
            gameAction: GameActions.simultaneously((context) =>
                context.game
                    .getOpponents(context.player)
                    .map((player) => GameActions.kneelCard({ card: player.faction, source: this }))
            )
        });
    }
}

Gared.code = '25009';

export default Gared;
