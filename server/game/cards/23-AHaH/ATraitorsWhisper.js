const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions');

class ATraitorsWhisper extends DrawCard {
    setupCardAbilities() {
        this.action({
            condition: context => context.player.discardPile.some(card => card.isShadow()),
            target: {
                activePromptTitle: 'Select a card in each players shadow area, if able',
                cardCondition: card => card.location === 'shadows',
                mode: 'eachPlayer',
                ifAble: true
            },
            message: '{player} plays {source} to reveal 1 card in each players shadow area, if able',
            handler: context => {
                this.game.resolveGameAction(
                    GameActions.simultaneously(context => context.targets.getTargets().map(card => GameActions.revealCard({ card }))),
                    context
                ).thenExecute(event => {
                    this.revealed = event.childEvents.map(childEvent => childEvent.card);
                    this.game.promptWithMenu(context.player, this, {
                        activePrompt: {
                            menuTitle: 'Put revealed cards into play?',
                            buttons: [
                                { text: 'Yes', method: 'putIntoPlay' },
                                { text: 'No', method: 'pass' }
                            ]
                        },
                        source: this
                    });
                });
            } 
        });
    }

    putIntoPlay(player) {
        var valid = this.revealed.filter(card => card.controller.canPutIntoPlay(card));
        if(valid.length > 0) {
            for(var card of valid) {
                card.controller.putIntoPlay(card);
            }
            this.game.addMessage('{0} puts {1} into play for {2}', player, valid, this);
        }
        return true;
    }

    pass(player) {
        this.game.addMessage('{0} chooses to not put {1} into play for {2}', player, this.revealed, this);
        return true;
    }
}

ATraitorsWhisper.code = '23008';

module.exports = ATraitorsWhisper;
