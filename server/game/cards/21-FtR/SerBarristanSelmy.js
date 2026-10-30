import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class SerBarristanSelmy extends DrawCard {
    // Ser Barristan Selmy (21019)
    // Renown.
    // Reaction: After you win a challenge in which Ser Barristan Selmy is participating, discard 1
    // card from your hand to, either: stand each defending Knight character, or raise the claim
    // value on your revealed plot card by 1 until the end of the challenge. (Limit twice per
    // phase.)
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.winner === context.player && context.source.isParticipating()
            },
            cost: ability.costs.discardFromHand(),
            limit: ability.limit.perPhase(2),
            choices: {
                'Stand each defending Knight': {
                    message:
                        '{player} uses {source} and discards {costs.discardFromHand} from their hand to stand each defending Knight',
                    gameAction: GameActions.simultaneously((context) =>
                        context.game
                            .filterCardsInPlay(
                                (card) =>
                                    card.isDefending() &&
                                    card.hasTrait('Knight') &&
                                    card.getType() === 'character'
                            )
                            .map((card) => GameActions.standCard({ card }))
                    )
                },
                'Raise claim': {
                    message:
                        '{player} uses {source} and discards {costs.discardFromHand} from their hand to raise the claim value on their revealed plot card by 1 until the end of the challenge',
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

SerBarristanSelmy.code = '21019';

export default SerBarristanSelmy;
