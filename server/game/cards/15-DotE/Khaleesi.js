import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class Khaleesi extends DrawCard {
    // Khaleesi (15019)
    // Lady character only.
    // Reaction: After you win a challenge in which attached character is participating, kneel
    // Khaleesi to, either: stand attached character, or raise the claim value on your revealed plot
    // card by 1 until the end of the challenge.
    setupCardAbilities(ability) {
        this.attachmentRestriction({ trait: 'Lady' });
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.winner === context.player &&
                    event.challenge.isParticipating(context.source.parent)
            },
            cost: ability.costs.kneelSelf(),
            choices: {
                'Stand attached character': {
                    message: {
                        format: '{player} kneels {costs.kneel} to stand {parent}',
                        args: { parent: (context) => context.source.parent }
                    },
                    gameAction: GameActions.standCard((context) => ({
                        card: context.source.parent
                    }))
                },
                'Raise claim': {
                    message:
                        '{player} kneels {costs.kneel} to raise the claim value on their revealed plot card by 1 until the end of the challenge',
                    gameAction: GameActions.lastingEffect((context) => ({
                        duration: 'untilEndOfChallenge',
                        match: (card) => card === context.player.activePlot,
                        effect: ability.effects.modifyClaim(1)
                    }))
                }
            }
        });
    }
}

Khaleesi.code = '15019';

export default Khaleesi;
