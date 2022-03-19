const DrawCard = require('../../drawcard.js');
const {Tokens} = require('../../Constants');
const GameActions = require('../../GameActions');

class HaldonHalfmaester extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: event => this.isParticipating() && event.challenge.isMatch({ winner: this.controller })
            },
            handler: context => {
                let topCard = context.player.drawDeck[0];
                this.msgExtension = '';

                //place 1 gold on card of the same type
                if(['character', 'location', 'attachment'].includes(topCard.getType())) {
                    if(this.game.anyCardsInPlay(card => card.getType() === topCard.getType())) {
                        this.game.promptForSelect(context.player, {
                            activePromptTitle: 'Select card to gain 1 gold',
                            cardCondition: card => card.getType() === topCard.getType() && card.location === 'play area',
                            source: this,
                            onSelect: (player, card) => this.onCardSelectedForGold(card, topCard, context)
                        });
                    } else {
                        this.continueHandler(null, topCard, context);
                    }
                } else {
                    this.continueHandler(null, topCard, context);
                }
            }
        });
    }

    onCardSelectedForGold(goldCard, topCard, context) {
        goldCard.modifyToken(Tokens.gold, 1);
        this.msgExtension = this.msgExtension + ' and have {3} gain 1 gold';
        this.continueHandler(goldCard, topCard, context);
        return true;                
    }

    continueHandler(goldCard, topCard, context) {
        if(topCard.getType() === 'event') {
            if(context.player.canDraw()) {
                context.player.drawCardsToHand(1);
                this.msgExtension = this.msgExtension + ' and draw it';
            }
        }
        if(topCard.name === 'Aegon Targaryen' && context.player.canPutIntoPlay(topCard)) {
            this.game.resolveGameAction(
                GameActions.putIntoPlay(() => ({
                    card: topCard
                })),
                context
            );
            this.msgExtension = this.msgExtension + ' and put {2} into play';
        }

        this.game.addMessage('{0} uses {1} to reveal {2} as the top card of their deck' + this.msgExtension,
            context.player, this, topCard, goldCard);
    }
}

HaldonHalfmaester.code = '18014';

module.exports = HaldonHalfmaester;
