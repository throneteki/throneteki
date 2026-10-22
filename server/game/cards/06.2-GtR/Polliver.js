import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class Polliver extends DrawCard {
    // Polliver (06029)
    // Pillage.
    // Reaction: After Polliver discards a character using pillage, return 2 gold from the losing
    // opponent's gold pool to the treasury.
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardDiscarded: (event, context) =>
                    event.isPillage &&
                    event.source === context.source &&
                    event.card.getType() === 'character'
            },
            message: {
                format: '{player} uses {source} to have {opponent} return 2 gold to the treasury',
                args: { opponent: (context) => context.event.card.owner }
            },
            gameAction: GameActions.returnGoldToTreasury((context) => ({
                player: context.event.card.owner,
                amount: 2
            }))
        });
    }
}

Polliver.code = '06029';

export default Polliver;
