import GameActions from '../../GameActions/index.js';
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
                onCardEntersPlay: (event, context) =>
                    event.card.getType() === 'character' &&
                    event.card.controller !== context.source.controller
            },
            cost: [ability.costs.kneelSelf(), ability.costs.discardGold()],
            message: {
                format: '{player} kneels {source} and discards 1 gold from it to treat the text box of {card} as blank until the end of the round',
                args: { card: (context) => context.event.card }
            },
            gameAction: GameActions.lastingEffect((context) => ({
                duration: 'untilEndOfRound',
                match: context.event.card,
                effect: ability.effects.blankExcludingTraits
            }))
        });
    }
}

TheGreatSeptOfBaelor.code = '08118';

export default TheGreatSeptOfBaelor;
