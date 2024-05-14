import DrawCard from '../../drawcard.js';

class Yoren extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardEntersPlay: (event) => event.card === this
            },
            target: {
                cardCondition: (card) =>
                    card.getType() === 'character' &&
                    card.getPrintedCost() <= 5 &&
                    card.location === 'play area'
            },
            handler: (context) => {
                this.game.addMessage(
                    '{0} uses {1} to take control of {2}',
                    context.player,
                    this,
                    context.target
                );
                this.lastingEffect((ability) => ({
                    until: {
                        onCardLeftPlay: (event) =>
                            event.card === this || event.card === context.target
                    },
                    match: context.target,
                    effect: ability.effects.takeControl(this.controller)
                }));
            }
        });
    }
}

Yoren.code = '13085';

export default Yoren;
