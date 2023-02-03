const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions/index.js');

class DefendingTheWall extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Remove character\'s strength',
            phase: 'challenge',
            target: {
                cardCondition: card => card.location === 'play area' && card.getType() === 'character' && card.isAttacking() && !card.isLoyal()
            },
            message: '{player} plays {source} to remove {target}\'s STR from the challenge',
            handler: context => {
                this.untilEndOfChallenge(ability => ({
                    match: context.target,
                    effect: ability.effects.doesNotContributeStrength()
                }));
                
                if(context.target.hasTrait('Army') || context.target.hasTrait('Wildling')) {
                    this.game.resolveGameAction(GameActions.drawCards(context => ({ player: context.player, amount: 1 })), context);
                }
            }
        });
    }
}

DefendingTheWall.code = '24015';

module.exports = DefendingTheWall;
