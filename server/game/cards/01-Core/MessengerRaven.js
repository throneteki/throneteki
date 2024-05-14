import DrawCard from '../../drawcard.js';

class MessengerRaven extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Draw 1 card',
            phase: 'dominance',
            condition: () => this.controller.canDraw(),
            cost: ability.costs.returnSelfToHand(),
            handler: (context) => {
                context.player.drawCardsToHand(1);

                this.game.addMessage(
                    '{0} returns {1} to their hand to draw 1 card',
                    context.player,
                    this
                );
            }
        });
    }
}

MessengerRaven.code = '01130';

export default MessengerRaven;
