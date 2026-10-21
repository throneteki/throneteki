import DrawCard from '../../drawcard.js';

class GreatWyk extends DrawCard {
    // Great Wyk (12017)
    // Reaction: After a character enters play from your dead pile, each opponent chooses and
    // discards 1 card from his or her hand. (Limit once per phase.)
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardEntersPlay: (event) =>
                    event.card.getType() === 'character' &&
                    event.card.controller === this.controller &&
                    event.originalLocation === 'dead pile'
            },
            limit: ability.limit.perPhase(1),
            handler: () => {
                for (let opponent of this.game.getOpponents(this.controller)) {
                    if (opponent.hand.length > 0) {
                        this.game.promptForSelect(opponent, {
                            activePromptTitle: 'Select a card',
                            source: this,
                            cardCondition: (card) => opponent.hand.includes(card),
                            gameAction: 'discard',
                            onSelect: (opponent, card) => this.onSelectCard(opponent, card),
                            onCancel: (opponent) => this.onSelectCard(opponent, null)
                        });
                    }
                }
            }
        });
    }

    onSelectCard(player, card) {
        if (card === null) {
            this.game.addAlert('danger', '{0} does not choose any card for {1}', player, this);
            return true;
        }

        player.discardCard(card);
        this.game.addMessage('{0} chooses {1} for {2}', player, card, this);
        return true;
    }
}

GreatWyk.code = '12017';

export default GreatWyk;
