import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class Pyke extends DrawCard {
    // Pyke (17163)
    // Each Warship location in your hand gains ambush (X). X is 1 less than that card's printed
    // cost.
    // Reaction: After a Warship location enters play under your control, choose another non-loyal,
    // non-limited card with equal or lower printed cost. Kneel Pyke to place that card on top of
    // its owner's deck. Then, at the end of the phase, that player draws 1 card.
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetLocation: 'hand',
            match: (card) => card.hasTrait('Warship'),
            effect: ability.effects.gainAmbush(-1)
        });
        this.reaction({
            when: {
                onCardEntersPlay: (event, context) =>
                    event.card.controller === context.player &&
                    event.card.hasTrait('warship') &&
                    event.card.getType() === 'location'
            },
            cost: ability.costs.kneelSelf(),
            target: {
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    card !== context.event.card &&
                    card.getPrintedCost() <= context.event.card.getPrintedCost() &&
                    !card.isLimited() &&
                    !card.isLoyal()
            },
            message: {
                format: "{player} kneels {source} to place {target} on top of {owner}'s deck",
                args: { owner: (context) => context.target.owner }
            },
            gameAction: GameActions.returnCardToDeck((context) => ({ card: context.target })).then({
                gameAction: GameActions.delayedEffect({
                    duration: 'untilEndOfRound',
                    when: {
                        onAtEndOfPhase: () => true
                    },
                    message: {
                        format: '{owner} draws 1 card for {source}',
                        args: { owner: (context) => context.parentContext.target.owner }
                    },
                    gameAction: GameActions.drawCards((context) => ({
                        player: context.parentContext.target.owner,
                        amount: 1
                    }))
                })
            })
        });
    }
}

Pyke.code = '17163';

export default Pyke;
