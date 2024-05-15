import DrawCard from '../../drawcard.js';
import sample from 'lodash.sample';

class HighgardenJester extends DrawCard {
    setupCardAbilities() {
        this.forcedReaction({
            when: {
                onCardsDrawn: (event) =>
                    event.reason === 'insight' &&
                    event.source === this &&
                    this.controller.hand.length > 0
            },
            handler: (context) => {
                if (
                    this.game.anyCardsInPlay(
                        (card) =>
                            card !== this && card.isMatch({ type: 'character', trait: 'Fool' })
                    )
                ) {
                    this.game.promptForSelect(context.player, {
                        activePromptTitle: 'Select a card',
                        cardCondition: (card) =>
                            card.controller === context.player && card.location === 'hand',
                        onSelect: (player, card) => this.handleSelect(player, card),
                        onCancel: (player) => this.handleCancel(player),
                        source: this
                    });
                } else {
                    const card = sample(context.player.hand);
                    this.game.addMessage(
                        '{0} is forced by {1} to place a random card from their hand on top of their deck',
                        context.player,
                        this
                    );
                    context.player.moveCard(card, 'draw deck');
                }
            }
        });
    }

    handleSelect(player, card) {
        this.game.addMessage(
            '{0} is forced by {1} to choose a card from their hand and place it on top of their deck',
            player,
            this
        );
        player.moveCard(card, 'draw deck');
        return true;
    }

    handleCancel(player) {
        this.game.addAlert('danger', '{0} cancels the resolution of {1}', player, this);
        return true;
    }
}

HighgardenJester.code = '13083';

export default HighgardenJester;
