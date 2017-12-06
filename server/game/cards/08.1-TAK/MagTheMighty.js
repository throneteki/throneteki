const DrawCard = require('../../drawcard.js');

class MagTheMighty extends DrawCard {
    setupCardAbilities() {
        this.forcedReaction({
            when: {
                afterChallenge: event => event.challenge.winner === this.controller && event.challenge.isParticipating(this)
            },
            target: {
                cardCondition: card => card.location === 'play area' && card.controller === this.controller && card.getType() === 'character'
            },
            handler: context => {
                this.game.killCharacter(context.target);
                this.game.addMessage('{0} is forced by {1} to kill {2}', context.player, this, context.target);

                //TODO Technically should only trigger when the first kill was not saved
                this.game.promptForSelect(context.event.challenge.loser, {
                    activePromptTitle: 'Select a character (only when first kill was not saved)',
                    cardCondition: card => card.location === 'play area' && card.controller === context.event.challenge.loser && card.getType() === 'character',
                    source: this,
                    onSelect: (player, card) => this.onCardSelected(player, card)
                });
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
