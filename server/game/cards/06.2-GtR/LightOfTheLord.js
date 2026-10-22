import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class LightOfTheLord extends DrawCard {
    // Light of the Lord (06028)
    // [baratheon] or R'hllor character only.
    // Reaction: After the dominance phase begins, stand attached character and gain 1 gold.
    setupCardAbilities() {
        this.attachmentRestriction({ faction: 'baratheon' }, { trait: "R'hllor" });
        this.reaction({
            when: {
                onPhaseStarted: (event) => event.phase === 'dominance'
            },
            message: '{player} uses {source} and {gameAction}',
            gameAction: GameActions.simultaneously([
                GameActions.standCard((context) => ({ card: context.source.parent })),
                GameActions.gainGold((context) => ({ player: context.player, amount: 1 }))
            ])
        });
    }
}

LightOfTheLord.code = '06028';

export default LightOfTheLord;
