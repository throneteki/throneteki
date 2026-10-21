import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class Gendry extends DrawCard {
    // Gendry (02068)
    // Reaction: After you win dominance, Gendry gains 1 power.
    // Forced Reaction: After an opponent wins dominance, you may discard 1 power from Gendry. If
    // you do not, sacrifice a Bastard character.
    setupCardAbilities() {
        this.reaction({
            when: {
                onDominanceDetermined: (event) =>
                    this.controller === event.winner && this.allowGameAction('gainPower')
            },
            message: '{player} uses {source} to gain power on {source}',
            gameAction: GameActions.gainPower({ card: this, amount: 1 })
        });

        this.forcedReaction({
            when: {
                onDominanceDetermined: (event) => event.winner && this.controller !== event.winner
            },
            handler: () => {
                if (this.power < 1) {
                    this.sacrificeBastard(this.controller);
                    return;
                }

                this.game.promptWithMenu(this.controller, this, {
                    activePrompt: {
                        menuTitle: 'Discard a power from ' + this.name + '?',
                        buttons: [
                            { text: 'Yes', method: 'discardPower' },
                            { text: 'No', method: 'sacrificeBastard' }
                        ]
                    },
                    source: this
                });
            }
        });
    }

    discardPower(player) {
        this.modifyPower(-1);
        this.game.addMessage('{0} is forced to discard a power from {1}', player, this);

        return true;
    }

    sacrificeBastard(player) {
        this.game.promptForSelect(player, {
            cardCondition: (card) =>
                card.location === 'play area' &&
                card.hasTrait('Bastard') &&
                card.getType() === 'character' &&
                card.controller === this.controller,
            source: this,
            onSelect: (player, card) => {
                card.controller.sacrificeCard(card);
                this.game.addMessage('{0} is forced by {1} to sacrifice {2}', player, this, card);
                return true;
            }
        });

        return true;
    }
}

Gendry.code = '02068';

export default Gendry;
