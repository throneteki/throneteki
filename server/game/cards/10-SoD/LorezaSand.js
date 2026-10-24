import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class LorezaSand extends DrawCard {
    // Loreza Sand (10013)
    // Interrupt: When a unique [martell] character you control is killed, draw 1 card. (Limit once
    // per phase.)
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onCharacterKilled: (event, context) =>
                    event.card.isUnique() &&
                    event.card.isFaction('martell') &&
                    event.card.controller === context.source.controller &&
                    context.source.controller.canDraw()
            },
            limit: ability.limit.perPhase(1),
            message: '{player} uses {source} to draw 1 card',
            gameAction: GameActions.drawCards((context) => ({ player: context.player, amount: 1 }))
        });
    }
}

LorezaSand.code = '10013';

export default LorezaSand;
