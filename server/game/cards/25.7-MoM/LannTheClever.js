const GameActions = require('../../GameActions/index.js');
const DrawCard = require('../../drawcard.js');

class LannTheClever extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentRestriction({ type: 'location', faction: 'lannister', controller: 'current', unique: true });
        this.reaction({
            cannotBeCanceled: true,
            when: {
                afterChallenge: event => event.challenge.challengeType === 'intrigue' && event.challenge.winner === this.controller
            },
            cost: [
                ability.costs.kneelSelf(),
                ability.costs.returnToHand(card => card.isMatch({ type: 'character', faction: 'lannister', participating: true }))
            ],
            message: '{player} kneels {costs.kneel} and returns {costs.returnToHand} to their hand to gain 3 gold',
            gameAction: GameActions.gainGold(context => ({ player: context.player, amount: 3 }))
        });
    }
}

LannTheClever.code = '25533';
LannTheClever.version = '1.2';

module.exports = LannTheClever;
