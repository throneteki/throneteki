import DrawCard from '../../drawcard.js';

class TobhoMottsArmory extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onDominanceDetermined: (event) =>
                    this.controller === event.winner && this.controller.canDraw()
            },
            cost: ability.costs.kneelSelf(),
            handler: () => {
                this.controller.drawCardsToHand(1);
                this.game.addMessage('{0} kneels {1} to draw 1 card', this.controller, this);
            }
        });
    }
}

TobhoMottsArmory.code = '02069';

export default TobhoMottsArmory;
