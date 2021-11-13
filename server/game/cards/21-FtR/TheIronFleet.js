const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions');

class TheIronFleet extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'current',
            effect: ability.effects.reduceCost({
                playingTypes: 'marshal',
                amount: 1,
                match: card => card.hasTrait('Raider')
            })
        });
        
        this.reaction({
            when: {
                onChallengeInitiated: (event, context) => event.challenge.attackingPlayer === context.player && this.hasAttackingRaider(context.player)
            },
            handler: (context) => {
                this.game.addMessage('{0} uses {1} to discard the top card from each opponent\'s deck', context.player, this);
                this.game.resolveGameAction(
                    GameActions.simultaneously(
                        this.game.getOpponents(context.player).map(opponent => GameActions.discardTopCards({ 
                            player: opponent,
                            amount: 1
                        }))
                    ),
                    context
                );
            }
        });
    }

    hasAttackingRaider(player) {
        return player.anyCardsInPlay(card => card.isAttacking() && card.hasTrait('Raider') && card.getType() === 'character');
    }
}

TheIronFleet.code = '21004';

module.exports = TheIronFleet;
