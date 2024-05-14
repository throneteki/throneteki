import DrawCard from '../../drawcard.js';

class CaptainsDaughter extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardEntersPlay: (event) =>
                    !event.card.isLoyal() &&
                    event.card.getType() === 'character' &&
                    event.card.controller !== this.controller
            },
            cost: [ability.costs.sacrificeSelf(), ability.costs.kneelFactionCard()],
            handler: (context) => {
                context.event.card.owner.moveCard(context.event.card, 'draw deck');
                this.game.addMessage(
                    "{0} sacrifices {1} and kneels their faction card to place {2} on top of {3}'s deck",
                    context.player,
                    this,
                    context.event.card,
                    context.event.card.owner
                );
            }
        });
    }
}

CaptainsDaughter.code = '04012';

export default CaptainsDaughter;
