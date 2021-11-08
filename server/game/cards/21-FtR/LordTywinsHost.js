const DrawCard = require('../../drawcard.js');

class LordTywinsHost extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: card => card.name === 'Tywin Lannister',
            effect: ability.effects.addIcon('military')
        });
                
        this.reaction({
            when: {
                onCardDiscarded: event => event.isPillage && event.source.controller === this.controller && event.source.isFaction('lannister')
            },
            limit: ability.limit.perRound(3),
            handler: context => {
                if(this.game.currentChallenge.loser.hand.some(card => card.getType() === context.event.card.getType())) {
                    this.promptForCardDiscard(context);
                    return;
                }

                this.revealHand(context);
            }
        });
    }

    promptForCardDiscard(context) {
        this.game.promptForSelect(this.game.currentChallenge.loser, {
            source: this,
            cardCondition: card => card.location === 'hand' && card.controller === this.game.currentChallenge.loser && card.getType() === context.event.card.getType(),
            onSelect: (player, card) => this.onCardSelected(context, player, card),
            onCancel: player => this.onCancel(player)
        });
    }

    onCardSelected(context, player, card) {
        player.discardCard(card);
        this.game.addMessage('{0} uses {1} to have {2} discard {3} from their hand',
            context.player, this, this.game.currentChallenge.loser, card);

        return true;
    }

    onCancel(player) {
        this.game.addAlert('danger', '{0} did not select a card to discard for {1}',
            player, this);

        return true;
    }

    revealHand(context) {
        this.game.addMessage('{0} uses {1} to have {2} reveal {3} as their hand',
            context.player, this, this.game.currentChallenge.loser, this.game.currentChallenge.loser.hand);
    }
}

LordTywinsHost.code = '21007';

module.exports = LordTywinsHost;
