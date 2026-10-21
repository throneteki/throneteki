import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class RaventreeHall extends DrawCard {
    // Raventree Hall (25092)
    // Reaction: After power is gained by or moved to a character you control, gain 1 gold. (Limit
    // once per phase.)
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardPowerGained: (event) => this.isCharacter(event.card),
                onCardPowerMoved: (event) => this.isCharacter(event.target)
            },
            limit: ability.limit.perPhase(1),
            message: '{player} uses {source} to gain 1 gold',
            gameAction: GameActions.gainGold((context) => ({ player: context.player, amount: 1 }))
        });
    }

    isCharacter(card) {
        return card.getType() === 'character' && card.controller === this.controller;
    }
}

RaventreeHall.code = '25092';

export default RaventreeHall;
