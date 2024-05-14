import DrawCard from '../../drawcard.js';

class TheHightower extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardEntersPlay: (event) =>
                    (this.controller.canDraw() || this.controller.canGainGold()) &&
                    event.card.isFaction('tyrell') &&
                    event.card.getType() === 'character' &&
                    event.card.controller === this.controller
            },
            limit: ability.limit.perPhase(1),
            handler: () => {
                let bonusMessages = [];

                if (this.controller.canGainGold()) {
                    this.game.addGold(this.controller, 1);
                    bonusMessages.push('gain 1 gold');
                }
                if (this.controller.canDraw()) {
                    this.controller.drawCardsToHand(1);
                    bonusMessages.push('draw 1 card');
                }
                this.game.addMessage(
                    '{0} uses {1} to ' + bonusMessages.join(', '),
                    this.controller,
                    this
                );
            }
        });
    }
}

TheHightower.code = '09017';

export default TheHightower;
