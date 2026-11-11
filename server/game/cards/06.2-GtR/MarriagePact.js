import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class MarriagePact extends DrawCard {
    // Marriage Pact (06022)
    // Terminal.
    // Attached character cannot participate in challenges against you.
    // Forced Interrupt: When attached character leaves play, sacrifice a character you control.
    setupCardAbilities(ability) {
        this.whileAttached({
            condition: (context) => isChallengeAgainst(context),
            effect: ability.effects.cannotParticipate()
        });

        this.forcedInterrupt({
            when: {
                onCardLeftPlay: (event, context) => event.card === context.source.parent
            },
            target: {
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    card.controller === context.source.controller &&
                    card.getType() === 'character' &&
                    (card !== context.event.card || loopStillChangesState(card, context))
            },
            message: '{player} is forced by {source} to sacrifice {target}',
            gameAction: GameActions.sacrificeCard((context) => ({ card: context.target }))
        });
    }
}

// Sacrificing the attached character while it is already leaving play makes it leave play again,
// which triggers this ability again. The rules team's resolution is that the loop continues while
// it still changes something: each repetition waits for the character's own leave-play forced
// interrupts, and stops once none of them would have an effect.
function loopStillChangesState(card, context) {
    const ownInterrupts = card.abilities.reactions.filter(
        (ability) =>
            ability.eventType === 'forcedinterrupt' && ability.triggersFor('onCardLeftPlay')
    );
    const isPending = context.game.abilityWindowStack.some((window) =>
        window.event
            .getConcurrentEvents()
            .filter((event) => event.name === 'onCardLeftPlay' && event.card === card)
            .some((event) =>
                ownInterrupts.some(
                    (ability) =>
                        !window.hasResolvedAbility(ability, event) &&
                        ability.canResolve(ability.createContext(event))
                )
            )
    );

    return (
        !isPending &&
        ownInterrupts.some((ability) => ability.canResolve(ability.createContext(context.event)))
    );
}

function isChallengeAgainst(context) {
    const challenge = context.game.currentChallenge;
    const pactController = context.source.controller;
    const attachedController = context.source.parent?.controller;
    if (!challenge || !attachedController || attachedController === pactController) {
        return false;
    }

    const sides = [challenge.attackingPlayer, challenge.defendingPlayer];
    return sides.includes(pactController) && sides.includes(attachedController);
}

MarriagePact.code = '06022';

export default MarriagePact;
