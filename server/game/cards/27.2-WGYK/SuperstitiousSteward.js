import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class SuperstitiousSteward extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onPhaseStarted: () => true
            },
            handler: (context) => {
                this.game.promptWithMenu(context.player, this, {
                    activePrompt: {
                        menuTitle: 'Name a trait',
                        controls: [
                            {
                                type: 'trait-name',
                                command: 'menuButton',
                                method: 'selectTraitName'
                            }
                        ]
                    },
                    source: this
                });
            }
        });
    }

    selectTraitName(player, traitName) {
        this.game.addMessage('{0} uses {1} to name the {2} trait', player, this, traitName);

        const onPlotsRevealed = (event) => this.handlePlotsRevealed(event, player, traitName);
        const cleanup = () => {
            this.game.removeListener('onPlotsRevealed', onPlotsRevealed);
            this.game.removeListener('onPhaseEnded', cleanup);
        };

        this.game.on('onPlotsRevealed', onPlotsRevealed);
        this.game.on('onPhaseEnded', cleanup);

        return true;
    }

    handlePlotsRevealed(event, player, traitName) {
        if (
            this.location !== 'play area' ||
            this.controller !== player ||
            !GameActions.sacrificeCard({ card: this, player }).allow()
        ) {
            return;
        }

        const opponents = [
            ...new Set(
                event.plots
                    .filter((plot) => plot.controller !== player && plot.hasTrait(traitName))
                    .map((plot) => plot.controller)
            )
        ];

        if (opponents.length === 0) {
            return;
        }

        this.opponentChoices = opponents;
        this.game.promptWithMenu(player, this, {
            activePrompt: {
                menuTitle: `Sacrifice ${this.name}?`,
                buttons: [
                    ...opponents.map((opponent, index) => ({
                        text: opponents.length === 1 ? 'Yes' : opponent.name,
                        method: 'sacrificeForOpponent',
                        arg: index
                    })),
                    { text: 'No', method: 'pass' }
                ]
            },
            source: this
        });
    }

    sacrificeForOpponent(player, index) {
        const opponent = this.opponentChoices[index];
        delete this.opponentChoices;

        if (!GameActions.sacrificeCard({ card: this, player }).allow()) {
            return true;
        }

        this.game.addMessage(
            '{0} sacrifices {1} to have {2} choose a character they control and discard it from play',
            player,
            this,
            opponent
        );
        this.game.resolveGameAction(GameActions.sacrificeCard({ card: this, player }));

        this.game.promptForSelect(opponent, {
            activePromptTitle: 'Select a character to discard',
            cardCondition: (card) =>
                card.location === 'play area' &&
                card.controller === opponent &&
                card.getType() === 'character' &&
                GameActions.discardCard({ card }).allow(),
            onSelect: (opponent, card) => {
                this.game.addMessage('{0} discards {1} from play', opponent, card);
                this.game.resolveGameAction(GameActions.discardCard({ card }));
                return true;
            },
            source: this
        });

        return true;
    }

    pass() {
        delete this.opponentChoices;
        return true;
    }
}

SuperstitiousSteward.code = '27029';

export default SuperstitiousSteward;
