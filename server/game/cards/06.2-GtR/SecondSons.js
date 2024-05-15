import DrawCard from '../../drawcard.js';
import { Tokens } from '../../Constants/index.js';

class SecondSons extends DrawCard {
    setupCardAbilities() {
        this.forcedInterrupt({
            when: {
                onPhaseEnded: (event) => event.phase === 'challenge'
            },
            handler: () => {
                if (!this.hasToken(Tokens.gold)) {
                    this.sacrifice();
                    return;
                }

                this.game.promptWithMenu(this.controller, this, {
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
        this.game.addMessage('{0} is forced to discard a gold from {1}', this.controller, this);

        return true;
    }

    sacrifice() {
        this.controller.sacrificeCard(this);
        this.game.addMessage('{0} is forced by {1} to sacrifice {1}', this.controller, this);

        return true;
    }
}

SecondSons.code = '06033';

export default SecondSons;
