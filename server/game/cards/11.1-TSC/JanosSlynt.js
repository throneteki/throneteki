import DrawCard from '../../drawcard.js';

class JanosSlynt extends DrawCard {
    // Janos Slynt (11006)
    // Shadow (0).
    // Forced Reaction: After Janos Slynt comes out of shadows, sacrifice a [thenightswatch]
    // character.
    setupCardAbilities() {
        this.forcedReaction({
            when: {
                onCardOutOfShadows: (event) => event.card === this
            },
            target: {
                cardCondition: (card) =>
                    card.controller === this.controller &&
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.isFaction('thenightswatch'),
                gameAction: 'sacrifice'
            },
            handler: (context) => {
                this.controller.sacrificeCard(context.target);
                this.game.addMessage(
                    '{0} is forced by {1} to sacrifice {2}',
                    this.controller,
                    this,
                    context.target
                );
            }
        });
    }
}

JanosSlynt.code = '11006';

export default JanosSlynt;
