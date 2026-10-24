import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class TowerOfTheSun extends DrawCard {
    // Tower of the Sun (04017)
    // Reaction: After an event is played, gain 1 gold. (Limit once per phase.)
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardPlayed: (event, context) => context.source.controller.canGainGold()
            },
            limit: ability.limit.perPhase(1),
            message: '{player} uses {source} to gain 1 gold',
            gameAction: GameActions.gainGold((context) => ({ player: context.player, amount: 1 }))
        });
    }
}

TowerOfTheSun.code = '04017';

export default TowerOfTheSun;
