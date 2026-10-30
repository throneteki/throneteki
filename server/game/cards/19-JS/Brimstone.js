import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class Brimstone extends DrawCard {
    // Brimstone (19008)
    // Each Sand Snake character you control gets +1 STR.
    // Challenges Action: Kneel Brimstone and return a Sand Snake character to your hand to gain 1
    // gold.
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card, context) =>
                card.getType() === 'character' &&
                card.controller === context.source.controller &&
                card.hasTrait('Sand Snake'),
            effect: ability.effects.modifyStrength(1)
        });

        this.action({
            title: 'Return Sand Snake',
            phase: 'challenge',
            cost: [
                ability.costs.kneelSelf(),
                ability.costs.returnToHand(
                    (card) => card.getType() === 'character' && card.hasTrait('Sand Snake')
                )
            ],
            message:
                '{player} kneels {source} and returns {costs.returnToHand} to their hand to gain 1 gold',
            gameAction: GameActions.gainGold((context) => ({ player: context.player, amount: 1 }))
        });
    }
}

Brimstone.code = '19008';

export default Brimstone;
