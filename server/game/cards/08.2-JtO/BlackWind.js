import DrawCard from '../../drawcard.js';

class BlackWind extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card) => card.name === 'Asha Greyjoy',
            effect: ability.effects.addKeyword('renown')
        });

        this.reaction({
            when: {
                onCardDiscarded: (event) =>
                    event.isPillage &&
                    event.source.controller === this.controller &&
                    ['attachment', 'location'].includes(event.card.getType()) &&
                    this.controller.canDraw()
            },
            limit: ability.limit.perPhase(2),
            handler: (context) => {
                context.player.drawCardsToHand(1);
                this.game.addMessage('{0} uses {1} to draw 1 card', context.player, this);
            }
        });
    }
}

BlackWind.code = '08032';

export default BlackWind;
