import DrawCard from '../../drawcard.js';

class TheGreatSeptOfBaelor extends DrawCard {
    // The Great Sept of Baelor (08118)
    // Bestow (3).
    // Reaction: After a character enters play, kneel The Great Sept of Baelor and discard 1 gold
    // from it to treat that character’s printed text box as if it were blank (except for Traits)
    // until the end of the round.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardEntersPlay: (event) =>
                    event.card.getType() === 'character' &&
                    event.card.controller !== this.controller
            },
            cost: [ability.costs.kneelSelf(), ability.costs.discardGold()],
            handler: (context) => {
                this.untilEndOfRound((ability) => ({
                    match: context.event.card,
                    effect: ability.effects.blankExcludingTraits
                }));
                this.game.addMessage(
                    '{0} kneels {1} and discards 1 gold from it to treat the text box of {2} as blank until the end of the round',
                    context.player,
                    this,
                    context.event.card
                );
            }
        });
    }
}

TheGreatSeptOfBaelor.code = '08118';

export default TheGreatSeptOfBaelor;
