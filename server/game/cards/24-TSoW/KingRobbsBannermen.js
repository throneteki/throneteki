const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions/index.js');

class KingRobbsBannermen extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: event => event.challenge.isMatch({ winner: this.controller, challengeType: 'military' }) 
                                            && this.controller.anyCardsInPlay(card => card.isAttacking() &&
                                                card.hasTrait('King') &&
                                                card.getType() === 'character')
            },
            target: {
                activePromptTitle: 'Select a character',
                cardCondition: { type: 'character', defending: true },
                gameAction: 'kill'
            },
            message: '{player} uses {source} to kill {target}',
            handler: context => {
                this.game.resolveGameAction(GameActions.kill(context => ({ card: context.target, player: context.player })), context);
            }
        });
    }
}

KingRobbsBannermen.code = '24016';

module.exports = KingRobbsBannermen;
