import PlotCard from '../../plotcard.js';

class TheWhiteShadows extends PlotCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCharacterKilled: (event) =>
                    this.controller !== event.cardStateWhenKilled.controller
            },
            handler: (context) => {
                this.controller.putIntoPlay(context.event.card);
                this.game.addMessage(
                    '{0} uses {1} to put {2} into play under their control, blank',
                    this.controller,
                    this,
                    context.event.card
                );

                this.atEndOfPhase((ability) => ({
                    match: context.event.card,
                    condition: () =>
                        ['play area', 'duplicate'].includes(context.event.card.location),
                    targetLocation: 'any',
                    effect: [
                        ability.effects.fullBlank,
                        ability.effects.moveToDeadPileIfStillInPlay()
                    ]
                }));
            }
        });
    }
}

TheWhiteShadows.code = '07050';

export default TheWhiteShadows;
