import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class SupportFromTheIronBank extends DrawCard {
    // Support from the Iron Bank (19002)
    // Action: Reduce the cost of each [baratheon] non-character card you marshal or play this phase
    // by 1.
    setupCardAbilities(ability) {
        this.action({
            message:
                '{player} uses {source} to reduce the cost of each baratheon non-character card they marshal or play this phase by 1',
            gameAction: GameActions.lastingEffect((context) => ({
                duration: 'untilEndOfPhase',
                effect: ability.effects.reduceCost({
                    playingTypes: ['marshal', 'play'],
                    amount: 1,
                    match: (card) => card.isFaction('baratheon') && card.getType() !== 'character'
                })
            }))
        });
    }
}

SupportFromTheIronBank.code = '19002';

export default SupportFromTheIronBank;
