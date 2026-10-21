import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class TheFieldOfFire extends DrawCard {
    // The Field of Fire (24021)
    // Challenges Action: Until the end of the phase, each non-Dragon character without attachments
    // gets -1 STR for each Dragon character you control with printed cost 7 or higher. (Max 1 per
    // phase.)
    setupCardAbilities(ability) {
        this.action({
            title: "Give non-Dragon's -STR",
            phase: 'challenge',
            message: {
                format: '{player} plays {source} to have each non-Dragon character without attachments get {reduction} STR until the end of the phase',
                args: { reduction: (context) => this.getReductionAmount(context.player) }
            },
            max: ability.limit.perPhase(1),
            gameAction: GameActions.genericHandler((context) => {
                this.untilEndOfPhase((ability) => ({
                    match: context.game.filterCardsInPlay(
                        (card) =>
                            card.getType() === 'character' &&
                            !card.hasTrait('Dragon') &&
                            card.attachments.length === 0
                    ),
                    targetController: 'any',
                    effect: ability.effects.modifyStrength(this.getReductionAmount(context.player))
                }));
            })
        });
    }

    getReductionAmount(player) {
        return (
            player.getNumberOfCardsInPlay({
                trait: 'Dragon',
                type: 'character',
                controller: 'current',
                location: 'play area',
                printedCostOrHigher: 7
            }) * -1
        );
    }
}

TheFieldOfFire.code = '24021';

export default TheFieldOfFire;
