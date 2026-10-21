import DrawCard from '../../drawcard.js';

class TyrionLannister extends DrawCard {
    // Tyrion Lannister (19014)
    // Bestow (3). Stealth.
    // Action: Discard 1 gold from Tyrion Lannister to put a Mercenary character into play under
    // your control from any player’s discard pile. At the end of the phase, if that card is still
    // in play, place it on the bottom of its owner's deck. (Limit once per phase.)
    setupCardAbilities(ability) {
        this.action({
            title: 'Put Mercenary into play',
            limit: ability.limit.perPhase(1),
            cost: ability.costs.discardGold(),
            target: {
                cardCondition: (card, context) =>
                    card.location === 'discard pile' &&
                    card.getType() === 'character' &&
                    card.hasTrait('Mercenary') &&
                    context.player.canPutIntoPlay(card)
            },
            handler: (context) => {
                context.player.putIntoPlay(context.target);

                this.atEndOfPhase((ability) => ({
                    match: context.target,
                    condition: () => ['play area', 'duplicate'].includes(context.target.location),
                    targetLocation: 'any',
                    effect: ability.effects.moveToBottomOfDeckIfStillInPlay(true)
                }));

                this.game.addMessage(
                    "{0} discards 1 gold from {1} to put {2} into play from {3}'s discard pile under their control",
                    context.player,
                    this,
                    context.target,
                    context.target.owner
                );
            }
        });
    }
}

TyrionLannister.code = '19014';

export default TyrionLannister;
