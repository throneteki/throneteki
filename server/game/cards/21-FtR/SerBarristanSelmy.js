const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions');

class SerBarristanSelmy extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event, context) => event.challenge.winner === context.player && this.isParticipating()
            },
            cost: ability.costs.discardFromHand(),
            limit: ability.limit.perPhase(2),
            choices: {
                'Stand each defending Knight': context => {
                    let affectedCharacters = this.game.filterCardsInPlay(card => card.isDefending() &&
                                                                                 card.hasTrait('Knight') &&
                                                                                 card.getType() === 'character');
                    this.game.resolveGameAction(
                        GameActions.simultaneously(
                            affectedCharacters.map(character => GameActions.standCard({ card: character }))
                        )
                    );

                    this.game.addMessage('{0} uses {1} and discards {2} from their hand to stand {3}', context.player, this, context.costs.discardFromHand, affectedCharacters);
                },
                'Raise claim': context => {
                    this.untilEndOfChallenge(ability => ({
                        match: card => card === context.player.activePlot,
                        effect: ability.effects.modifyClaim(1)
                    }));
                    this.game.addMessage('{0} uses {1} and discards {2} from their hand to raise the claim value on their revealed plot card by 1 until the end of the challenge',
                        context.player, this, context.costs.discardFromHand);
                }
            }
        });
    }
}

SerBarristanSelmy.code = '21019';

module.exports = SerBarristanSelmy;
