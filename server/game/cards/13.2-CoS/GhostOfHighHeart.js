const DrawCard = require('../../drawcard');
const GameActions = require('../../GameActions');

class GhostOfHighHeart extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => !this.controller.anyCardsInPlay(card => card.getType() === 'character' && card.isLoyal()),
            match: card => card.getType() === 'character',
            targetController: 'current',
            effect: ability.effects.modifyStrength(1)
        });

        this.action({
            title: 'Look at hand',
            phase: 'challenge',
            cost: ability.costs.kneelSelf(),
            choosePlayer: player => player.hand.length > 0,
            target: {
                activePromptTitle: 'Select a card',
                cardCondition: (card, context) => card.location === 'hand' && (!context.chosenPlayer || card.controller === context.chosenPlayer),
                revealTargets: true
            },
            message: '{player} kneels {source} to look at {chosenPlayer}\'s hand and discard {target}',
            handler: context => {
                this.game.resolveGameAction(
                    GameActions.discardCard({ card: context.target, player: context.player })
                ).thenExecute(() => {
                    if(context.chosenPlayer.canDraw()) {
                        this.game.addMessage('Then {0} draws 1 card', context.chosenPlayer);
                        context.chosenPlayer.drawCardsToHand(1);
                    }
                });
            }
        });
    }
}

GhostOfHighHeart.code = '13037';

module.exports = GhostOfHighHeart;
