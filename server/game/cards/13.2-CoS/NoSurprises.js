const DrawCard = require('../../drawcard.js');

class NoSurprises extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Reveal your hand',
            chooseOpponent: true,
            condition: () => this.controller.hand.length !== 0,
            handler: context => {
                let opponent = context.opponent;
                this.game.addMessage('{0} plays {1} to reveal their hand', context.player, this);
                this.game.promptForSelect(opponent, {
                    activePromptTitle: 'Look at opponets hand and continue',
                    source: this,
                    revealTargets: true,
                    cardCondition: card => card.location === 'hand' && card.controller === context.player,
                    onSelect: () => this.onCardSelected(context),
                    onCancel: () => this.onCardSelected(context)
                });
                this.untilEndOfPhase(ability => ({
                    match: opponent,
                    effect: [
                        ability.effects.cannotPutIntoPlay((card) => card.location === 'shadows'),
                        ability.effects.cannotPlay(card => card.getPrintedType() === 'event')
                    ]
                }));
            }
        });
    }

    onCardSelected(context) {
        this.game.addMessage('{0} uses {1} to prevent opponents to play events or bring cards out of shadows', context.player, this);
        return true;
    }
}

NoSurprises.code = '13022';

module.exports = NoSurprises;
