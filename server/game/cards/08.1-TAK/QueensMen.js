import DrawCard from '../../drawcard.js';

class QueensMen extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardEntersPlay: (event) => event.card === this && event.playingType === 'marshal'
            },
            chooseOpponent: (opponent) => opponent.hand.length !== 0,
            handler: (context) => {
                this.game.addMessage(
                    "{0} uses {1} to look at {2}'s hand",
                    context.player,
                    this,
                    context.opponent
                );
                this.game.promptForSelect(context.player, {
                    activePromptTitle: 'Select a non-character, or click done',
                    source: this,
                    revealTargets: true,
                    cardCondition: (card) =>
                        card.location === 'hand' && card.controller === context.opponent,
                    onSelect: (player, card) => this.onCardSelected(player, card)
                });
            }
        });
    }

    onCardSelected(player, card) {
        let toDiscard = card;

        if (
            toDiscard &&
            toDiscard.getType() !== 'character' &&
            this.controller.anyCardsInPlay(
                (card) =>
                    !card.isFaction('baratheon') && card.getType() === 'character' && !card.kneeled
            )
        ) {
            this.game.promptForSelect(this.controller, {
                source: this,
                gameAction: 'kneel',
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.controller === this.controller &&
                    !card.isFaction('baratheon') &&
                    card.getType() === 'character',
                onSelect: (player, toKneel) => this.kneelToDiscard(player, toKneel, toDiscard)
            });
        }

        return true;
    }

    kneelToDiscard(player, toKneel, toDiscard) {
        toKneel.controller.kneelCard(toKneel);
        toDiscard.owner.discardCard(toDiscard);
        this.game.addMessage(
            "{0} then kneels {1} to discard {2} from {3}'s hand",
            this.controller,
            toKneel,
            toDiscard,
            toDiscard.owner
        );

        return true;
    }
}

QueensMen.code = '08008';

export default QueensMen;
