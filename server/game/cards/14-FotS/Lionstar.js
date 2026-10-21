import DrawCard from '../../drawcard.js';

class Lionstar extends DrawCard {
    // Lionstar (14028)
    // Action: Kneel Lionstar to put a [lannister] character with printed cost 4 or lower into play
    // from your hand. At the end of the phase, if that card is still in play, discard it from play.
    setupCardAbilities(ability) {
        this.action({
            title: 'Put a character into play',
            cost: ability.costs.kneelSelf(),
            target: {
                cardCondition: (card) =>
                    card.location === 'hand' &&
                    card.controller === this.controller &&
                    card.getType() === 'character' &&
                    card.isFaction('lannister') &&
                    this.controller.canPutIntoPlay(card) &&
                    card.getPrintedCost() <= 4
            },
            message: '{player} kneels {source} to put {target} into play',
            handler: (context) => {
                context.player.putIntoPlay(context.target);
                this.atEndOfPhase((ability) => ({
                    match: context.target,
                    condition: () => ['play area', 'duplicate'].includes(context.target.location),
                    targetLocation: 'any',
                    effect: ability.effects.discardIfStillInPlay()
                }));
            }
        });
    }
}

Lionstar.code = '14028';

export default Lionstar;
