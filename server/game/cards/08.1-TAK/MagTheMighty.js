const DrawCard = require('../../drawcard.js');
class MagTheMighty extends DrawCard {
    setupCardAbilities() {
        this.forcedReaction({
            when: {
                afterChallenge: event => event.challenge.winner === this.controller && this.isParticipating()
            },
            target: {
                cardCondition: card => card.location === 'play area' && card.controller === this.controller && card.getType() === 'character' && card.canBeKilled()
            },
            handler: context => {
                this.game.killCharacter(context.target);
                this.game.addMessage('{0} is forced by {1} to kill {2}', context.player, this, context.target);

                if(context.target.location && context.target.location === 'dead pile') {
                    this.game.promptForSelect(context.event.challenge.loser, {
                        activePromptTitle: 'Select a character',
                        cardCondition: card => card.location === 'play area' && card.controller === context.event.challenge.loser && card.getType() === 'character' && card.canBeKilled(),
                        source: this,
                        onSelect: (player, card) => this.onCardSelected(player, card)
                    });
                }
            }
        });
    }

    onCardSelected(player, card) {
        this.game.killCharacter(card);
        this.game.addMessage('{0} is then forced by {1} to kill {2}', player, this, card);
        return true;
    }
}

MagTheMighty.code = '08018';

module.exports = MagTheMighty;
