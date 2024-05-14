import DrawCard from '../../drawcard.js';

class Melisandre extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardEntersPlay: (event) =>
                    event.playingType === 'marshal' &&
                    event.card.controller === this.controller &&
                    event.card.hasTrait("R'hllor"),
                onCardPlayed: (event) =>
                    event.card.controller === this.controller && event.card.hasTrait("R'hllor")
            },
            limit: ability.limit.perRound(1),
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    !card.kneeled,
                gameAction: 'kneel'
            },
            handler: (context) => {
                this.controller.kneelCard(context.target);

                this.game.addMessage(
                    '{0} uses {1} to kneel {2}',
                    this.controller,
                    this,
                    context.target
                );
            }
        });
    }
}

Melisandre.code = '01047';

export default Melisandre;
