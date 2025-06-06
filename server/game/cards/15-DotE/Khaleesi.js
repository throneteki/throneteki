import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class Khaleesi extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentRestriction({ trait: 'Lady' });
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.winner === this.controller &&
                    event.challenge.isParticipating(this.parent)
            },
            cost: ability.costs.kneelSelf(),
            choices: {
                'Stand attached character': {
                    message: {
                        format: '{player} kneels {costs.kneel} to stand {parent}',
                        args: { parent: () => this.parent }
                    },
                    gameAction: GameActions.standCard((context) => ({
                        card: context.source.parent
                    }))
                },
                'Raise claim': () => {
                    this.untilEndOfChallenge((ability) => ({
                        match: (card) => card === this.controller.activePlot,
                        effect: ability.effects.modifyClaim(1)
                    }));

                    this.game.addMessage(
                        '{0} kneels {1} to raise the claim value on their revealed plot card by 1 until the end of the challenge',
                        this.controller,
                        this
                    );
                }
            }
        });
    }
}

Khaleesi.code = '15019';

export default Khaleesi;
