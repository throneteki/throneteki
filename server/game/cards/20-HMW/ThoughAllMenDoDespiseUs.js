const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions');

class ThoughAllMenDoDespiseUs extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            max: ability.limit.perChallenge(1),
            when: {
                onDefendersDeclared: event => event.player !== this.controller && event.numOfDefendingCharacters === 0 && this.hasAttackingRaider(this.controller)
            },
            handler: context => {
                this.game.resolveGameAction(
                    GameActions.simultaneously(
                        context.player
                            .filterCardsInPlay(card => card.isAttacking() && card.hasTrait('Raider') && card.getType() === 'character')
                            .map(card => GameActions.gainPower({ card: card, amount: 1}))
                    ),
                    context
                );
                this.game.addMessage('{0} uses {1} to have each attacking Raider character gain 1 power', context.player, this); 
            }
        });
    }
     
    hasAttackingRaider(player) {
        return player.anyCardsInPlay(card => card.isAttacking() && card.hasTrait('Raider') && card.getType() === 'character');
    }
}

ThoughAllMenDoDespiseUs.code = '20009';

module.exports = ThoughAllMenDoDespiseUs;
