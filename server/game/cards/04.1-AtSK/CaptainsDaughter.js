import DrawCard from '../../drawcard.js';

class CaptainsDaughter extends DrawCard {
    // Captain's Daughter (04012)
    // Reaction: After a non-loyal character enters play, kneel your faction card and sacrifice
    // Captain's Daughter to put that character onto the top of it's owner's deck.
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
