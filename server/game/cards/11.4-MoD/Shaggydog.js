import DrawCard from '../../drawcard.js';

class Shaggydog extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentRestriction({ faction: 'stark', controller: 'current' });
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.winner === this.controller &&
                    event.challenge.isAttacking(this.parent) &&
                    this.game.anyCardsInPlay((card) => card.isDefending())
            },
            handler: (context) => {
                let loser = context.event.challenge.loser;
                this.game.addMessage(
                    '{0} uses {1} to have {2} choose and kill a defending character',
                    context.player,
                    this,
                    loser
                );
                this.game.promptForSelect(loser, {
                    cardCondition: (card) => card.isDefending(),
                    source: this,
                    onSelect: (player, card) => this.onCardSelected(player, card),
                    onCancel: (player) => this.cancelSelection(player)
                });
            }
        });
        this.action({
            title: 'Attach Shaggydog to another character',
            cost: ability.costs.payGold(1),
            target: {
                type: 'select',
                cardCondition: (card) =>
                    this.controller.canAttach(this, card) &&
                    card.location === 'play area' &&
                    card !== this.parent
            },
            limit: ability.limit.perPhase(1),
            handler: (context) => {
                context.player.attach(this.controller, this, context.target);
                this.game.addMessage(
                    '{0} pays 1 gold to attach {1} to {2}',
                    context.player,
                    this,
                    context.target
                );
            }
        });
    }

    onCardSelected(player, card) {
        this.game.killCharacter(card);
        this.game.addMessage('{0} chooses to kill {1} for {2}', player, card, this);
        return true;
    }

    cancelSelection(player) {
        this.game.addAlert(
            'danger',
            '{0} does not select a character to kill for {1}',
            player,
            this
        );
        return true;
    }
}

Shaggydog.code = '11062';

export default Shaggydog;
