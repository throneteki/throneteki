const DrawCard = require('../../drawcard');
const GameActions = require('../../GameActions');

class FairIsle extends DrawCard {
    setupCardAbilities(ability) {
        this.plotModifiers({
            gold: 1
        });

        this.action({
            title: 'Place cards on top of deck',
            phase: 'challenge',
            chooseOpponent: true,
            cost: ability.costs.kneelSelf(),
            message: {
                format: '{player} uses {source} to have {opponent} place 2 cards on top of their deck',
                args: { opponent: context => context.opponent }
            },
            handler: context => {
                if(context.opponent.hand.length > 0) {
                    this.game.promptForSelect(context.opponent, {
                        activePromptTitle: 'Select 2 cards if able (last chosen ends up on top)',
                        source: this,
                        ordered: true,
                        cardCondition: card => context.opponent.hand.includes(card),
                        numCards: 2,
                        multiSelect: true,
                        onSelect: (opponent, cards) => this.onSelectCard(opponent, cards),
                        onCancel: (opponent) => this.onCancel(opponent)
                    });
                } else {
                    this.game.addMessage('{0} can´t choose 2 cards for {1}', context.opponent, this);
                }
                this.game.once('onAtEndOfPhase', () => {
                    if(!context.opponent.canDraw()) {
                        return;
                    }
                    this.game.addMessage('Then {0} draws 2 card for {1}', context.opponent, this);
                    context.opponent.drawCardsToHand(2);
                });
            }
        });
    }
    
    onSelectCard(player, cards) {
        let gameActions = [];
        for(let card of cards) {
            gameActions.push(GameActions.returnCardToDeck({ card }));
        }
        this.game.resolveGameAction(GameActions.simultaneously(gameActions));
        this.game.addMessage('{0} moves {1} cards to the top of their deck for {2}', player, cards.length, this);
        return true;
    }

    onCancel(player) {
        this.game.addAlert('danger', '{0} does not choose 2 cards for {1}', player, this);
        return true;
    }
}

FairIsle.code = '21009';

module.exports = FairIsle;
