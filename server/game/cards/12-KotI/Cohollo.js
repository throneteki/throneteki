import DrawCard from '../../drawcard.js';

class Cohollo extends DrawCard {
    // Cohollo (12035)
    // Intimidate.
    // Action: Kneel Cohollo and discard 1 card from your hand to have him participate in a
    // challenge on your side.
    setupCardAbilities(ability) {
        this.action({
            title: 'Discard a card',
            cost: [ability.costs.kneelSelf(), ability.costs.discardFromHand()],
            condition: () => !!this.game.currentChallenge,
            message: {
                format: '{player} kneels {source} and discards {discardCost} to have {source} participate in the current challenge',
                args: {
                    discardCost: (context) => context.costs.discardFromHand
                }
            },
            handler: (context) => {
                this.game.currentChallenge.addParticipantToSide(context.player, this);
            }
        });
    }
}

Cohollo.code = '12035';

export default Cohollo;
