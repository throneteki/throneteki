import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class AntlerMen extends DrawCard {
    // Antler Men (22002)
    // Reaction: After power is moved to your faction card, gain 1 gold. (Limit twice per round.)
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardPowerMoved: (event) =>
                    event.target.getType() === 'faction' &&
                    event.target.controller === this.controller
            },
            limit: ability.limit.perRound(2),
            message: '{player} uses {source} to gain 1 gold',
            gameAction: GameActions.gainGold((context) => ({ player: context.player, amount: 1 }))
        });
    }
}

AntlerMen.code = '22002';

export default AntlerMen;
