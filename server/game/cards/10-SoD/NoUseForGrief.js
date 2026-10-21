import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';
import KillTracker from '../../EventTrackers/KillTracker.js';

class NoUseForGrief extends DrawCard {
    constructor(owner, cardData) {
        super(owner, cardData);
        this.tracker = new KillTracker(this.game);
    }

    // No Use For Grief (10022)
    // Play only if a [martell] character was killed under your control this round.
    // Action: Search your deck for a Sand Snake character with printed cost 3 or lower, put it into
    // play, and shuffle your deck. (Printed cost 6 or lower instead if The Red Viper is in your
    // dead pile.)
    setupCardAbilities() {
        this.action({
            title: 'Put Sand Snake into play',
            condition: () =>
                this.tracker.anyKilledThisRound(
                    (card) => card.isFaction('martell') && card.controller === this.controller
                ),
            message: {
                format: '{player} plays {source} to search their deck for a Sand Snake character with printed cost {printedCost} or lower',
                args: { printedCost: (context) => this.getCostLimit(context.player) }
            },
            gameAction: GameActions.search({
                title: 'Select a character',
                match: {
                    type: 'character',
                    trait: 'Sand Snake',
                    condition: (card, context) =>
                        card.hasPrintedCost() &&
                        card.getPrintedCost() <= this.getCostLimit(context.player)
                },
                reveal: false,
                message: '{player} {gameAction}',
                gameAction: GameActions.putIntoPlay((context) => ({
                    card: context.searchTarget
                }))
            })
        });
    }

    getCostLimit(player) {
        return player.deadPile.some((card) => card.name === 'The Red Viper') ? 6 : 3;
    }
}

NoUseForGrief.code = '10022';

export default NoUseForGrief;
