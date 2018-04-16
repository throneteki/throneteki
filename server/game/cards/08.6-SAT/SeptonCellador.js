const DrawCard = require('../../drawcard.js');

class SeptonCellador extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Opponent discards character',
            phase: 'challenge',
            cost: ability.costs.kneelSelf(),
            chooseOpponent: opponent => !opponent.hand.isEmpty(),
            handler: context => {
                if(context.opponent.hand.any(card => card.getType() === 'character')) {
                    this.promptForCharacterDiscard(context);
                    return;
                }

                this.revealHandPrompt(context);
            }
        });
    }

    promptForCharacterDiscard(context) {
        this.game.promptForSelect(context.opponent, {
            source: this,
            cardCondition: card => card.location === 'hand' && card.controller === context.opponent && card.getType() === 'character',
            onSelect: (player, card) => this.onCardSelected(context, player, card),
            onCancel: player => this.onCancel(player)
        });
    }

    onCardSelected(context, player, card) {
        player.discardCard(card);
        this.game.addMessage('{0} kneels {1} to have {2} discard {3} from their hand',
            context.player, this, context.opponent, card);

        return true;
    }

    onCancel(player) {
        this.game.addAlert('danger', '{0} did not select a character to discard for {1}',
            player, this);

        return true;
    }

    revealHandPrompt(context) {
        let cards = [];
        context.opponent.hand.each(card => cards.push(card));

        this.game.addMessage('{0} kneels {1} to have {2} reveal {3} as their hand',
            context.player, this, context.opponent, cards);

        this.game.promptForSelect(context.player, {
            activePromptTitle: 'Select a card or click done to stop looking',
            source: this,
            revealTargets: true,
            cardCondition: card => card.location === 'hand' && card.controller === context.opponent,
            onSelect: (player, card) => this.closePrompt(player, card)
        });
    }

    closePrompt() {
        return true;
    }
}

SeptonCellador.code = '08105';

module.exports = SeptonCellador;
