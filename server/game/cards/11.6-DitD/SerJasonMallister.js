const DrawCard = require('../../drawcard');

class SerJasonMallister extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.game.getOpponents(this.controller).every(opponent => opponent.shadows.length == 0) && (this.controller.shadows.length == 0),
            match: this,
            effect: [
                ability.effects.addKeyword('Renown'),
            ]
        });
        this.reaction({
            when: {
                afterChallenge: event => (
                    event.challenge.attackingPlayer === this.controller &&
                    event.challenge.winner === this.controller &&
                    this.isAttacking()
                )
            },
            target: {
                activePromptTitle: 'Select a card',
                cardCondition: card => card.location === 'shadows' && card.controller === this.game.currentChallenge.defendingPlayer &&
                    this.game.getOpponents(this.controller).every(opponent => opponent.shadows.length !== 0)
            },
            
            handler: context => {
                context.target.owner.moveCard(context.target, 'discard pile');
                this.game.addMessage('{0} uses {1} to discard a card in shadows controlled by {2}', 
                    context.player, this, this.game.currentChallenge.loser);
            }
        });
    }
}

SerJasonMallister.code = '11101';

module.exports = SerJasonMallister;
