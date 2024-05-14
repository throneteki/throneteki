import DrawCard from '../../drawcard.js';

class Will extends DrawCard {
    setupCardAbilities() {
        this.forcedReaction({
            when: {
                afterChallenge: (event) =>
                    this.controller === event.challenge.loser && event.challenge.isUnopposed()
            },
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.hasTrait('Ranger') &&
                    card.controller === this.controller
            },
            handler: (context) => {
                this.controller.sacrificeCard(context.target);

                this.game.addMessage(
                    '{0} is forced to use {1} to sacrifice {2}',
                    this.controller,
                    this,
                    context.target
                );
            }
        });
    }
}

Will.code = '02001';

export default Will;
