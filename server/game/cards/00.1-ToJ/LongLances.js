import DrawCard from '../../drawcard.js';
import { Tokens } from '../../Constants/index.js';

class LongLances extends DrawCard {
    setupCardAbilities() {
        this.forcedInterrupt({
            when: {
                onPhaseEnded: (event) => event.phase === 'challenge'
            },
            handler: () => {
                if (!this.hasToken(Tokens.gold)) {
                    this.returnToHand();
                    return;
                }

                this.game.promptWithMenu(this.controller, this, {
                    activePrompt: {
                        menuTitle: 'Discard 1 gold from ' + this.name + '?',
                        buttons: [
                            { text: 'Yes', method: 'discardGold' },
                            { text: 'No', method: 'returnToHand' }
                        ]
                    },
                    source: this
                });
            }
        });
    }

    discardGold() {
        this.modifyToken(Tokens.gold, -1);
        this.game.addMessage('{0} is forced to discard a gold from {1}', this.controller, this);

        return true;
    }

    returnToHand() {
        this.owner.returnCardToHand(this, true);
        this.game.addMessage(
            "{0} is forced to return {1} to {2}'s hand",
            this.controller,
            this,
            this.owner
        );

        return true;
    }
}

LongLances.code = '00262';

export default LongLances;
