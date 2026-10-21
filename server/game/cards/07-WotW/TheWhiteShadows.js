import PlotCard from '../../plotcard.js';

class TheWhiteShadows extends PlotCard {
    // The White Shadows (07050)
    // Reaction: After a character an opponent controls is killed, put it into play under your
    // control. While that character is in play, treat its printed text box as if it were blank. At
    // the end of the phase, if that card is still in play, place it in its owner's dead pile
    // (cannot be saved).
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
