import DrawCard from '../../drawcard.js';

class TheNewGift extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Gain 1 gold',
            phase: 'marshal',
            condition: () => this.controller.canGainGold(),
            limit: ability.limit.perPhase(2),
            cost: ability.costs.kneel(
                (card) => card.hasTrait('Steward') && card.getType() === 'character'
            ),
            handler: (context) => {
                this.game.addGold(context.player, 1);
                this.game.addMessage(
                    '{0} uses {1} and kneels {2} to gain 1 gold',
                    context.player,
                    context.source,
                    context.costs.kneel
                );
            }
        });

        this.action({
            title: 'Draw 1 card',
            phase: 'challenge',
            condition: () => this.controller.canDraw(),
            limit: ability.limit.perPhase(2),
            cost: ability.costs.kneel(
                (card) => card.hasTrait('Steward') && card.getType() === 'character'
            ),
            handler: (context) => {
                this.controller.drawCardsToHand(1);
                this.game.addMessage(
                    '{0} uses {1} and kneels {2} to draw 1 card',
                    context.player,
                    context.source,
                    context.costs.kneel
                );
            }
        });
    }
}

TheNewGift.code = '07017';

export default TheNewGift;
