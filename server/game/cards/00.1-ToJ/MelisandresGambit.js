import PlotCard from '../../plotcard.js';

class MelisandresGambit extends PlotCard {
    setupCardAbilities() {
        this.whenRevealed({
            target: {
                type: 'select',
                mode: 'upTo',
                numCards: 1,
                cardCondition: (card, context) =>
                    card.getType() === 'character' &&
                    card.location === 'play area' &&
                    card.controller === context.player,
                gameAction: 'kill'
            },
            handler: (context) => {
                if (context.target.length > 0) {
                    this.game.killCharacter(context.target[0], { allowSave: false });

                    this.targetPredicate = (card) =>
                        card !== context.target &&
                        card.controller === this.controller &&
                        card.getType() === 'character' &&
                        card.name !== context.target[0].name &&
                        ['discard pile', 'dead pile'].includes(card.location) &&
                        this.controller.canPutIntoPlay(card);

                    if (this.game.allCards.some(this.targetPredicate)) {
                        this.game.promptForSelect(this.controller, {
                            source: this,
                            cardCondition: this.targetPredicate,
                            onSelect: (player, card) =>
                                this.onCardSelected(player, card, context.target[0].name),
                            onCancel: () => this.cancelSelection()
                        });
                    }
                } else {
                    this.game.addMessage(
                        '{0} does not select a character to kill for {1}',
                        this.controller,
                        this
                    );
                }
            }
        });
    }

    cancelSelection() {
        this.game.addAlert(
            'danger',
            '{0} does not select a character to put into play with {1}',
            this.controller,
            this
        );
        return true;
    }

    onCardSelected(player, card, killedCharacterName) {
        player.putIntoPlay(card);
        this.game.addMessage(
            '{0} kills {1} to put {2} into play with {3}',
            player,
            killedCharacterName,
            card,
            this
        );

        return true;
    }
}

MelisandresGambit.code = '00336';

export default MelisandresGambit;
