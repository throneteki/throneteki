import DrawCard from '../../drawcard.js';

class TheGreatSeptOfBaelor extends DrawCard {
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
