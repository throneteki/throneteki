import DrawCard from '../../drawcard.js';

class LorezaSand extends DrawCard {
    // Loreza Sand (10013)
    // Interrupt: When a unique [martell] character you control is killed, draw 1 card. (Limit once
    // per phase.)
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onCharacterKilled: (event) =>
                    event.card.isUnique() &&
                    event.card.isFaction('martell') &&
                    event.card.controller === this.controller &&
                    this.controller.canDraw()
            },
            limit: ability.limit.perPhase(1),
            handler: (context) => {
                context.player.drawCardsToHand(1);
                this.game.addMessage('{0} uses {1} to draw 1 card', context.player, this);
            }
        });
    }
}

LorezaSand.code = '10013';

export default LorezaSand;
