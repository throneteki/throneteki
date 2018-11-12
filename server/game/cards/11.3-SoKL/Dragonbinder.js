const DrawCard = require('../../drawcard.js');

class Dragonbinder extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentRestriction({ controller: 'current' });
        this.whileAttached({
            effect: ability.effects.addKeyword('intimidate')
        });
        this.reaction({
            when: {
                onDominanceDetermined: event => this.controller === event.winner
            },
            cost: ability.costs.killParent(),
            handler: context => {
                this.costCard = context.costs.kill;

                if(!this.anyOpponentHasDragon()) {
                    this.putGJIntoPlay();
                    return;
                }

                this.game.promptWithMenu(context.player, this, {
                    activePrompt: {
                        menuTitle: 'Take control of Dragon or put GJ character into play?',
                        buttons: [
                            { text: 'Take Dragon', method: 'takeDragon' },
                            { text: 'Put GJ character into play', method: 'putGJIntoPlay' }
                        ]
                    },
                    source: this
                });
            }
        });
    }

    anyOpponentHasDragon() {
        return this.game.getOpponents(this.controller).some(player => player.anyCardsInPlay(card => card.hasTrait('Dragon') && card.getType() === 'character'));
    }

    takeDragon() {
        this.game.promptForSelect(this.controller, {
            source: this,
            cardCondition: card => card.location === 'play area' && card.controller !== this.controller &&
                                   card.getType() === 'character' && card.hasTrait('Dragon'),
            onSelect: (player, card) => this.onDragonSelected(player, card),
            onCancel: (player) => this.onDragonCanceled(player)
        });

        return true;
    }

    onDragonSelected(player, card) {
        this.game.takeControl(player, card);
        this.game.addMessage('{0} uses {1} and kills {2} to take control of {3}', player, this, this.costCard, card);
        return true;
    }

    onDragonCanceled(player) {
        this.game.addAlert('danger', '{0} cancels the resolution of {1}', player, this);
        return true;
    }

    putGJIntoPlay() {
        this.game.promptForDeckSearch(this.controller, {
            source: this,
            numCards: 10,
            cardCondition: card => card.getType() === 'character' && card.isFaction('greyjoy') && this.controller.canPutIntoPlay(card),
            onSelect: (player, card) => this.onGJSelected(player, card),
            onCancel: player => this.onGJCanceled(player)
        });

        return true;
    }

    onGJSelected(player, card) {
        player.putIntoPlay(card);
        this.game.addMessage('{0} uses {1} and kills {2} to search their deck and put {3} into play',
            player, this, this.costCard, card);
    }

    onGJCanceled(player) {
        this.game.addMessage('{0} uses {1} and kills {2} to search their deck, but does not put any card into play',
            player, this, this.costCard);
    }
}

Dragonbinder.code = '11052';

module.exports = Dragonbinder;
