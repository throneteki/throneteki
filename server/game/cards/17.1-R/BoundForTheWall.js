const DrawCard = require('../../drawcard');

class BoundForTheWall extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.isMatch({
                        winner: this.controller,
                        attackingPlayer: this.controller
                    })
            },
            handler: (context) => {
                let opponent = context.event.challenge.loser;
                opponent.discardFromDraw(2);

                this.game.addMessage(
                    "{0} plays {1} to discard the top 2 cards of {2}'s deck and have {2} select a character from their discard pile to put into play",
                    context.player,
                    this,
                    opponent
                );

                this.game.promptForSelect(opponent, {
                    source: this,
                    cardCondition: (card) =>
                        card.location === 'discard pile' &&
                        card.controller === opponent &&
                        card.getType() === 'character' &&
                        context.player.canPutIntoPlay(card),
                    onSelect: (player, card) => this.onCardSelected(player, card),
                    onCancel: (player) => this.cancelSelection(player)
                });
            },
            max: ability.limit.perChallenge(1)
        });
    }

    onCardSelected(player, card) {
        this.controller.putIntoPlay(card);
        this.game.addMessage('{0} chooses {1} for {2}', player, card, this);
        return true;
    }

    cancelSelection(player) {
        this.game.addAlert('danger', '{0} does not select a character for {1}', player, this);
        return true;
    }
}

BoundForTheWall.code = '17121';

module.exports = BoundForTheWall;
