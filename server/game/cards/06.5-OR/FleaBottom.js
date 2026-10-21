import DrawCard from '../../drawcard.js';

class FleaBottom extends DrawCard {
    // Flea Bottom (06098)
    // Challenges Action: Pay 1 gold and kneel Flea Bottom to put a character with printed cost 3 or
    // lower into play from your discard pile. At the end of the phase, if that card is still in
    // play, place it on the bottom of your deck.
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
            cost: [ability.costs.payGold(1), ability.costs.kneelSelf()],
            handler: (context) => {
                context.player.putIntoPlay(context.target);

                this.atEndOfPhase((ability) => ({
                    match: context.target,
                    condition: () => ['play area', 'duplicate'].includes(context.target.location),
                    targetLocation: 'any',
                    effect: ability.effects.moveToBottomOfDeckIfStillInPlay(true)
                }));

                this.game.addMessage(
                    '{0} kneels {1} and pays 1 gold to put {2} into play from their discard pile',
                    context.player,
                    this,
                    context.target
                );
            }
        });
    }
}

FleaBottom.code = '06098';

export default FleaBottom;
