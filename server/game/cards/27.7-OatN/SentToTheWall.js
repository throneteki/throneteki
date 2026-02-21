import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class SentToTheWall extends DrawCard {
    setupCardAbilities() {
        this.attachmentRestriction({ loyal: false });
        this.reaction({
            when: {
                onPhaseStarted: (event) => event.phase === 'plot'
            },
            handler: (context) => {
                this.context = context;
                this.game.promptWithMenu(this.controller, this, {
                    activePrompt: {
                        menuTitle: 'Name a trait',
                        controls: [
                            { type: 'trait-name', command: 'menuButton', method: 'selectTraitName' }
                        ]
                    },
                    source: this
                });
            }
        });
    }

    selectTraitName(player, traitName) {
        this.game.addMessage(
            '{0} uses {1} on {2} and names the {3} trait',
            player,
            this,
            this.parent,
            traitName
        );
        this.namedTrait = traitName;

        this.game.once('onPlotsRevealed', (event) => this.handlePlotsRevealed(event));

        return true;
    }

    handlePlotsRevealed(event) {
        if (!this.namedTrait) {
            return;
        }

        const plotHasTrait = event.plots.some(
            (plot) => plot.controller === this.parent.controller && plot.hasTrait(this.namedTrait)
        );
        const gameAction = GameActions.discardCard({ card: this.parent });
        if (plotHasTrait && gameAction.allow()) {
            this.game.addMessage(
                '{0} is forced by {1} to discard {2} from play',
                this.parent.controller,
                this,
                this.parent
            );
            this.game.resolveGameAction(gameAction, this.context);
        }
        delete this.namedTrait;
        delete this.context;
    }
}

SentToTheWall.code = '27556';
SentToTheWall.version = '1.0.0';

export default SentToTheWall;
