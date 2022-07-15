const DrawCard = require('../../drawcard');
const GameActions = require('../../GameActions');

class LordProtectorsRetainer extends DrawCard {
    setupCardAbilities() {
        // TODO: Requires a significant rework of X cost abilities / cards, as right now
        // Ambush (X) counts as Ambush (0), and will alway default to the lowest cost
        // even if the right Ambush cost is also on the card.
        // See: https://github.com/throneteki/throneteki/pull/3189

        this.forcedReaction({
            when: {
                onChallengeInitiated: () => true
            },
            message: '{player} is foced by {source} to return {source} to hand',
            gameAction: GameActions.returnCardToHand(context => ({
                card: context.source
            }))
        });
    }
}

LordProtectorsRetainer.code = '23028';

module.exports = LordProtectorsRetainer;
