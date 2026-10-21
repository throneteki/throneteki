import DrawCard from '../../drawcard.js';
import { Tokens } from '../../Constants/index.js';

class SeizedByTheGuard extends DrawCard {
    // Seized by the Guard (08078)
    // Non-limited location only. Bestow (4). Terminal.
    // Treat attached location as if its printed text box were blank (except for Traits).
    // Forced Reaction: After the marshaling phase begins, sacrifice Seized by the Guard unless you
    // discard 1 gold from it.
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
