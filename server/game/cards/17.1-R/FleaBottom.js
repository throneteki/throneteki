import DrawCard from '../../drawcard.js';

class FleaBottom extends DrawCard {
    // Flea Bottom (17142)
    // Bestow (3).
    // Challenges Action: Kneel Flea Bottom and discard 1 gold from it to put a character with
    // printed cost 3 or lower into play from your discard pile. At the end of the phase, if that
    // card is still in play, place it on the bottom of your deck.
    setupCardAbilities(ability) {
        this.action({
            title: 'Put character into play',
            phase: 'challenge',
            target: {
                cardCondition: (card) =>
                    card.location === 'discard pile' &&
                    card.controller === this.controller &&
                    card.getType() === 'character' &&
                    card.getPrintedCost() <= 3 &&
                    this.controller.canPutIntoPlay(card)
            },
            cost: [ability.costs.discardGold(), ability.costs.kneelSelf()],
            handler: (context) => {
                context.player.putIntoPlay(context.target);

                this.atEndOfPhase((ability) => ({
                    match: context.target,
                    condition: () => ['play area', 'duplicate'].includes(context.target.location),
                    targetLocation: 'any',
                    effect: ability.effects.moveToBottomOfDeckIfStillInPlay(true)
                }));

                this.game.addMessage(
                    '{0} discards 1 gold from {1} and kneels it to put {2} into play from their discard pile',
                    context.player,
                    this,
                    context.target
                );
            }
        });
    }
}

FleaBottom.code = '17142';

export default FleaBottom;
