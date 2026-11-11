import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class TheBastardsLetter extends DrawCard {
    // The Bastard's Letter (11102)
    // Shadow (3).
    // Reaction: After an opponent initiates a [military] challenge against you, stand any number of
    // characters you control with a [military] icon. If you win the challenge, kill each attacking
    // character.
    setupCardAbilities() {
        this.reaction({
            when: {
                onChallengeInitiated: (event, context) =>
                    event.challenge.isMatch({
                        initiatedAgainstPlayer: context.player,
                        initiatedChallengeType: 'military'
                    })
            },
            target: {
                type: 'select',
                mode: 'unlimited',
                optional: true,
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    card.controller === context.player &&
                    card.hasIcon('military'),
                gameAction: 'stand'
            },
            message: '{player} plays {source} to stand {target}',
            gameAction: GameActions.simultaneously([
                GameActions.simultaneously((context) =>
                    context.target.map((card) => GameActions.standCard({ card }))
                ),
                GameActions.delayedEffect({
                    duration: 'untilEndOfChallenge',
                    when: {
                        afterChallenge: (event, context) =>
                            event.challenge.winner === context.player
                    },
                    message: {
                        format: '{player} uses {source} to kill {attackers}',
                        args: { attackers: (context) => context.event.challenge.attackers }
                    },
                    gameAction: GameActions.simultaneously((context) =>
                        context.event.challenge.attackers.map((card) => GameActions.kill({ card }))
                    )
                })
            ])
        });
    }
}

TheBastardsLetter.code = '11102';

export default TheBastardsLetter;
