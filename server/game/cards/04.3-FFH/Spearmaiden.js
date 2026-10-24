import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class Spearmaiden extends DrawCard {
    // Spearmaiden (04055)
    // Reaction: After Spearmaiden is declared as an attacker in a [military] challenge, choose a
    // character controlled by the defending player. If you win the challenge by 5 or more STR, that
    // character must be chosen for claim during this challenge, if able.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onDeclaredAsAttacker: (event, context) =>
                    context.game.isDuringChallenge({ challengeType: 'military' }) &&
                    event.card === context.source
            },
            target: {
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    card.controller === context.game.currentChallenge.defendingPlayer &&
                    card.getType() === 'character'
            },
            message: '{player} chooses {target} for {source}',
            gameAction: GameActions.delayedEffect({
                duration: 'untilEndOfChallenge',
                when: {
                    afterChallenge: (event, context) =>
                        event.challenge.winner === context.player &&
                        event.challenge.strengthDifference >= 5
                },
                message: '{player} uses {source} to force {target} to be chosen for claim, if able',
                gameAction: GameActions.lastingEffect((context) => ({
                    duration: 'untilEndOfChallenge',
                    targetController: 'opponent',
                    match: context.target,
                    effect: ability.effects.mustChooseAsClaim()
                }))
            })
        });
    }
}

Spearmaiden.code = '04055';

export default Spearmaiden;
