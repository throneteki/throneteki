import DrawCard from '../../drawcard.js';

class LorezaSand extends DrawCard {
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
