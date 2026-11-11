import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class CaptainsDaughter extends DrawCard {
    // Captain's Daughter (04012)
    // Reaction: After a non-loyal character enters play, kneel your faction card and sacrifice
    // Captain's Daughter to put that character onto the top of it's owner's deck.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardEntersPlay: (event) =>
                    !event.card.isLoyal() && event.card.getType() === 'character'
            },
            cost: [ability.costs.sacrificeSelf(), ability.costs.kneelFactionCard()],
            message: {
                format: "{player} sacrifices {source} and kneels their faction card to place {card} on top of {owner}'s deck",
                args: {
                    card: (context) => context.event.card,
                    owner: (context) => context.event.card.owner
                }
            },
            gameAction: GameActions.returnCardToDeck((context) => ({ card: context.event.card }))
        });
    }
}

CaptainsDaughter.code = '04012';

export default CaptainsDaughter;
