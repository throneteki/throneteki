import DrawCard from '../../drawcard.js';

class WarlockOfQarth extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardPlaced: (event) =>
                    event.card.owner !== this.controller &&
                    event.card.location === 'dead pile' &&
                    this.controller.canPutIntoPlay(event.card)
            },
            cost: ability.costs.sacrificeSelf(),
            handler: (context) => {
                this.controller.putIntoPlay(context.event.card);
                this.untilEndOfPhase((ability) => ({
                    match: context.event.card,
                    effect: ability.effects.addKeyword('insight')
                }));
                this.atEndOfPhase((ability) => ({
                    match: context.event.card,
                    condition: () =>
                        ['play area', 'duplicate'].includes(context.event.card.location),
                    targetLocation: 'any',
                    effect: ability.effects.moveToDeadPileIfStillInPlay()
                }));

                this.game.addMessage(
                    '{0} sacrifices {1} to put {2} into play under their control and have it gain insight until the end of the phase',
                    this.controller,
                    this,
                    context.event.card
                );
            }
        });
    }
}

WarlockOfQarth.code = '22020';

export default WarlockOfQarth;
