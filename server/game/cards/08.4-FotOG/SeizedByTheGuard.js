import DrawCard from '../../drawcard.js';
import { Tokens } from '../../Constants/index.js';

class SeizedByTheGuard extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentRestriction({ type: 'location', limited: false });
        this.whileAttached({
            effect: ability.effects.blankExcludingTraits
        });
        this.forcedReaction({
            when: {
                onPhaseStarted: (event) => event.phase === 'marshal'
            },
            handler: (context) => {
                if (!this.hasToken(Tokens.gold)) {
                    this.sacrifice();
                    return;
                }

                this.game.promptWithMenu(context.player, this, {
                    activePrompt: {
                        menuTitle: 'Discard 1 gold from ' + this.name + '?',
                        buttons: [
                            { text: 'Yes', method: 'discardGold' },
                            { text: 'No', method: 'sacrifice' }
                        ]
                    },
                    source: this
                });
            }
        });
    }

    discardGold() {
        this.modifyToken(Tokens.gold, -1);
        this.game.addMessage('{0} is forced to discard 1 gold from {1}', this.controller, this);
        return true;
    }

    sacrifice() {
        this.controller.sacrificeCard(this);
        this.game.addMessage('{0} is forced to sacrifice {1}', this.controller, this);
        return true;
    }
}

SeizedByTheGuard.code = '08078';

export default SeizedByTheGuard;
