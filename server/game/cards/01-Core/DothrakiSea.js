import DrawCard from '../../drawcard.js';

class DothrakiSea extends DrawCard {
    // Dothraki Sea (01174)
    // Reaction: After you win a [power] challenge, sacrifice Dothraki Sea to put a Dothraki
    // character into play from your hand. At the end of the phase, if that card is still in play,
    // return it to your hand (cannot be saved).
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.winner === this.controller &&
                    event.challenge.challengeType === 'power'
            },
            cost: ability.costs.sacrificeSelf(),
            target: {
                cardCondition: (card, context) =>
                    card.location === 'hand' &&
                    card.getType() === 'character' &&
                    card.controller === context.player &&
                    card.hasTrait('Dothraki') &&
                    context.player.canPutIntoPlay(card)
            },
            handler: (context) => {
                context.target.controller.putIntoPlay(context.target);
                this.atEndOfPhase((ability) => ({
                    match: context.target,
                    condition: () => ['play area', 'duplicate'].includes(context.target.location),
                    targetLocation: 'any',
                    effect: ability.effects.returnToHandIfStillInPlay()
                }));
                this.game.addMessage(
                    '{0} sacrifices {1} to put {2} into play from their hand',
                    this.controller,
                    this,
                    context.target
                );
            }
        });
    }
}

DothrakiSea.code = '01174';

export default DothrakiSea;
