import AbilityContext from '../../../server/game/AbilityContext.js';
import GameActions from '../../../server/game/GameActions/index.js';

describe('choose game action', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Hedge Knight'], gold: 3 }
        });

        this.context = new AbilityContext({
            game: this.game,
            player: this.player1Object,
            source: this.hedgeKnight
        });
        this.choose = (props) => {
            this.game.resolveGameAction(
                GameActions.choose({
                    choices: {
                        'Gain 1 gold': {
                            gameAction: GameActions.gainGold({
                                player: this.player1Object,
                                amount: 1
                            })
                        }
                    },
                    ...props
                }),
                this.context
            );
            this.game.continue();
        };
    });

    it('lets the player cancel the choice by default', function () {
        this.choose();

        this.player1.clickPrompt('Done');
        expect(this.player1Object.gold).toBe(3);
    });

    it('does not offer a cancel button when it is not cancelable', function () {
        this.choose({ cancelable: false });

        expect(this.player1).not.toHavePromptButton('Done');
        this.player1.clickPrompt('Gain 1 gold');
        expect(this.player1Object.gold).toBe(4);
    });
});
