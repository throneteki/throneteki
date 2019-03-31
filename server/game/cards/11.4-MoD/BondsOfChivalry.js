const DrawCard = require('../../drawcard');

class BondsOfChivalry extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Stand and remove Knight',
            condition: () => this.game.isDuringChallenge(),
            target: {
                cardCondition: card => card.controller === this.controller && card.getType() === 'character' && card.isParticipating() && card.hasTrait('Knight')
            },
            handler: context => {
                let target = context.target;

                if(!target.kneeled || !target.allowGameAction('stand', context)) {
                    this.game.addMessage('{0} plays {1} to remove {2} from the challenge', this.controller, this, target);
                    this.game.currentChallenge.removeFromChallenge(target);
                    return;
                }

                this.game.addMessage('{0} plays {1} to stand and remove {2} from the challenge', this.controller, this, target);
                this.game.currentChallenge.removeFromChallenge(target);
                this.controller.standCard(target);

                this.game.promptForSelect(this.controller, {
                    activePromptTitle: 'Select a new participant',
                    cardCondition: card => card !== target && card.location === 'play area' && card.controller === this.controller && card.getType() === 'character' && card.hasTrait('Knight') && !card.isParticipating() && !card.kneeled && card.allowGameAction('kneel', context),
                    onSelect: (player, card) => this.addToChallenge(card),
                    source: this
                });
            }
        });
    }

    addToChallenge(card) {
        this.game.addMessage('{0} kneels {1} to have it participate in the challenge', this.controller, card);
        this.controller.kneelCard(card);
        this.game.currentChallenge.addParticipantToSide(this.controller, card);

        return true;
    }
}

BondsOfChivalry.code = '11064';

module.exports = BondsOfChivalry;
