import DrawCard from '../../drawcard.js';

class AlannysGreyjoy extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardEntersPlay: (event) =>
                    event.card.isFaction('greyjoy') &&
                    event.card.getType() === 'location' &&
                    event.card.controller === this.controller &&
                    this.controller.canDraw()
            },
            message: '{player} uses {source} to draw 1 card',
            handler: (context) => {
                context.player.drawCardsToHand(1);
            },
            limit: ability.limit.perPhase(1)
        });
    }
}

AlannysGreyjoy.code = '13031';

export default AlannysGreyjoy;
