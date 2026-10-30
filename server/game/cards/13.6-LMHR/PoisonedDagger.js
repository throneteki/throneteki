import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class PoisonedDagger extends DrawCard {
    // Poisoned Dagger (13116)
    // Character you control only. Shadow (2).
    // Attached character gets +2 STR.
    // Reaction: After you win an [intrigue] challenge in which attached character is participating,
    // sacrifice Poisoned Dagger to have the losing opponent choose and kill a participating
    // character he or she controls.
    setupCardAbilities(ability) {
        this.attachmentRestriction({ controller: 'current' });
        this.whileAttached({
            effect: ability.effects.modifyStrength(2)
        });
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.winner === context.player &&
                    event.challenge.challengeType === 'intrigue' &&
                    context.source.parent.isParticipating()
            },
            cost: ability.costs.sacrificeSelf(),
            message: {
                format: '{player} sacrifices {source} to have {loser} choose and kill a participating character they control',
                args: { loser: (context) => context.event.challenge.loser }
            },
            gameAction: GameActions.chooseCards({
                player: (context) => context.event.challenge.loser,
                title: 'Select a character to kill',
                cardCondition: (card, context) =>
                    card.getType() === 'character' &&
                    card.isParticipating() &&
                    card.controller === context.choosingPlayer,
                gameAction: (card) => GameActions.kill({ card })
            })
        });
    }
}

PoisonedDagger.code = '13116';

export default PoisonedDagger;
