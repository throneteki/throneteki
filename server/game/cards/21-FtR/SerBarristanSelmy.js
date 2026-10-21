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
                    event.challenge.winner === context.player && this.isParticipating()
            },
            cost: ability.costs.discardFromHand(),
            limit: ability.limit.perPhase(2),
            choices: {
                'Stand each defending Knight': (context) => {
                    let affectedCharacters = this.game.filterCardsInPlay(
                        (card) =>
                            card.isDefending() &&
                            card.hasTrait('Knight') &&
                            card.getType() === 'character'
                    );
                    this.game.resolveGameAction(
                        GameActions.simultaneously(
                            affectedCharacters.map((character) =>
                                GameActions.standCard({ card: character })
                            )
                        )
                    );

                    this.game.addMessage(
                        '{0} uses {1} and discards {2} from their hand to stand {3}',
                        context.player,
                        this,
                        context.costs.discardFromHand,
                        affectedCharacters
                    );
                },
                'Raise claim': (context) => {
                    this.untilEndOfChallenge((ability) => ({
                        match: (card) => card === context.player.activePlot,
                        effect: ability.effects.modifyClaim(1)
                    }));
                    this.game.addMessage(
                        '{0} uses {1} and discards {2} from their hand to raise the claim value on their revealed plot card by 1 until the end of the challenge',
                        context.player,
                        this,
                        context.costs.discardFromHand
                    );
                }
            }
        });
    }
}

SerBarristanSelmy.code = '21019';

export default SerBarristanSelmy;
