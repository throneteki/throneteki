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
                    card.getType() === 'character'
            },
            message: '{player} is forced by {source} to sacrifice {target}',
            gameAction: GameActions.sacrificeCard((context) => ({ card: context.target }))
        });
    }
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
