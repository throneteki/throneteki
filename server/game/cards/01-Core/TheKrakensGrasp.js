import DrawCard from '../../drawcard.js';

class TheKrakensGrasp extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: "Remove character's strength",
            condition: () => this.controller.firstPlayer,
            phase: 'challenge',
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.isDefending() &&
                    card.getStrength() <= 5
            },
            handler: (context) => {
                this.untilEndOfChallenge((ability) => ({
                    match: context.target,
                    effect: ability.effects.doesNotContributeStrength()
                }));

                this.game.addMessage(
                    "{0} plays {1} to remove {2}' STR from the challenge",
                    this.controller,
                    this,
                    context.target
                );
            }
        });
    }
}

TheKrakensGrasp.code = '01082';

export default TheKrakensGrasp;
