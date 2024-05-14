const DrawCard = require('../../drawcard');
const GameActions = require('../../GameActions');
const KillTracker = require('../../EventTrackers/KillTracker');

class NoUseForGrief extends DrawCard {
    constructor(owner, cardData) {
        super(owner, cardData);
        this.tracker = new KillTracker(this.game);
    }

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

module.exports = NoUseForGrief;
