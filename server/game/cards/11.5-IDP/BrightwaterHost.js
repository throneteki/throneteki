import DrawCard from '../../drawcard.js';

class BrightwaterHost extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.winner === this.controller && this.isAttacking()
            },
            target: {
                activePromptTitle: 'Select a card',
                cardCondition: (card) => card.location === 'shadows'
            },
            handler: (context) => {
                this.game.addMessage(
                    "{0} uses {1} to move one of {2}'s cards in shadow to their hand",
                    context.player,
                    this,
                    context.target.owner
                );
                context.target.owner.returnCardToHand(context.target);

                this.game.promptForSelect(context.player, {
                    cardCondition: (card) =>
                        card.controller === context.player &&
                        card.getType() === 'character' &&
                        card.location === 'play area' &&
                        card.isFaction('tyrell') &&
                        card.isUnique(),
                    gameAction: 'gainPower',
                    onSelect: (player, card) => this.cardSelected(player, card),
                    source: this
                });
            }
        });
    }

    cardSelected(player, card) {
        this.game.addMessage('{0} then has {1} gain 2 power', player, card);
        card.modifyPower(2);
        return true;
    }
}

BrightwaterHost.code = '11083';

export default BrightwaterHost;
