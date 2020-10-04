const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions');

class WombOfTheWorld extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Reveal top 5 cards',
            cost: ability.costs.kneelSelf(),
            handler: context => {
                const revealedCards = context.player.drawDeck.slice(0, 5);
                const revealFunction = (card) => revealedCards.includes(card);

                this.game.addMessage('{0} kneels {1} to reveal {2} from the top of their deck', context.player, this, revealedCards);

                this.game.cardVisibility.addRule(revealFunction);

                this.game.promptForSelect(context.player, {
                    activePromptTitle: 'Select a character',
                    cardCondition: card => (
                        revealedCards.includes(card) &&
                        card.isMatch({ trait: 'Dothraki', type: 'character' }) &&
                        card.getPrintedCost() === this.lowestPrintedCost(revealedCards, context) &&
                        context.player.canPutIntoPlay(card)
                    ),
                    onSelect: (player, card) => this.putCharacterIntoPlay(player, card),
                    onCancel: (player) => this.promptToCancel(player),
                    source: this
                });
                this.game.queueSimpleStep(() => {
                    this.game.cardVisibility.removeRule(revealFunction);

                    this.game.addMessage('{0} shuffles their deck', this.controller);
                    this.game.resolveGameAction(
                        GameActions.shuffle(context => ({ player: context.player })),
                        context
                    );
                });
            }
        });
    }
   
    lowestPrintedCost(revealedCards, context) {
        let filteredCards = revealedCards.filter(card => card.isMatch({ trait: 'Dothraki', type: 'character' }) && context.player.canPutIntoPlay(card));
        let costs = filteredCards.map(card => card.getPrintedCost());
        return costs.reduce((lowest, cost) => Math.min(lowest, cost));
    }
   
    putCharacterIntoPlay(player, card) {
        player.putIntoPlay(card);
        this.atEndOfPhase(ability => ({
            match: card,
            targetLocation: 'any',
            effect: ability.effects.returnToHandIfStillInPlay(true)
        }));
        this.game.addMessage('{0} uses {1} to put {2} into play', player, this, card);
        return true;
    }

    promptToCancel(player) {
        this.game.addAlert('warning', '{0} uses {1} but does not put any character into play', player, this);
        return true;
    }
}

WombOfTheWorld.code = '17132';

module.exports = WombOfTheWorld;
