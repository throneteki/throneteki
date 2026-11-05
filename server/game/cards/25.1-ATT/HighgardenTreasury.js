import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class HighgardenTreasury extends DrawCard {
    // Highgarden Treasury (25016)
    // Reaction: After a character is removed from a challenge, gain 1 gold. (Limit 3 times per
    // round.)
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onRemovedFromChallenge: (event) => event.reason === 'ability'
            },
            limit: ability.limit.perRound(3),
            message: '{player} uses {source} to gain 1 gold',
            gameAction: GameActions.gainGold((context) => ({ player: context.player, amount: 1 }))
        });
    }
}

HighgardenTreasury.code = '25016';

export default HighgardenTreasury;
