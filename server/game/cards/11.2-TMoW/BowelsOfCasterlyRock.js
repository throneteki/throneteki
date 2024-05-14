import DrawCard from '../../drawcard.js';

class BowelsOfCasterlyRock extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardOutOfShadows: (event) => event.card.controller === this.controller
            },
            limit: ability.limit.perPhase(1),
            choices: {
                'Gain 2 gold': (context) => {
                    this.game.addGold(context.player, 2);
                    this.game.addMessage('{0} uses {1} to gain 2 gold', context.player, this);
                },
                'Draw 1 card': (context) => {
                    if (context.player.canDraw()) {
                        context.player.drawCardsToHand(1);
                        this.game.addMessage('{0} uses {1} to draw 1 card', context.player, this);
                    }
                }
            }
        });
    }
}

BowelsOfCasterlyRock.code = '11030';

export default BowelsOfCasterlyRock;
