const DrawCard = require('../../drawcard');
const GameActions = require('../../GameActions');
const Messages = require('../../Messages');

class ShadowOfTheIsles extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Choose and discard locations',
            targets: {
                choosingPlayer: 'each',
                activePromptTitle: 'Select a location',
                cardCondition: (card, context) => card.location === 'play area' && card.controller === context.choosingPlayer && card.getType() === 'location' && !card.isLimited(),
                gameAction: 'discard',
                messages: Messages.eachPlayerTargetingForCardType('locations')
            },
            message: '{player} plays {source} to have each player choose and discard a non-limited location',
            handler: context => {
                let actions = context.targets.map(card => GameActions.discardCard({ card }));

                this.game.resolveGameAction(
                    GameActions.simultaneously(actions),
                    context
                );

                if(this.game.anyPlotHasTrait('War')) {
                    this.game.addMessage('{0} uses {1} to return {1} to their hand instead of their discard pile', context.player, this);
                    context.player.moveCard(this, 'hand');
                }
            }
        });
    }
}

ShadowOfTheIsles.code = '13072';

module.exports = ShadowOfTheIsles;
