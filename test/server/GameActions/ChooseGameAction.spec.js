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

    it('does not let the player cancel the choice once the ability is resolving', function () {
        this.choose();

        expect(this.player1).not.toHavePromptButton('Cancel');
        expect(this.player1).not.toHavePromptButton('Done');
    });

    it('lets the player decline the choice when it has a decline message', function () {
        this.choose({ cancelMessage: '{choosingPlayer} declines' });

        this.player1.clickPrompt('Done');
        expect(this.player1Object.gold).toBe(3);
    });

    it('does not offer a cancel button when it is not cancelable', function () {
        this.choose({ cancelable: false });

        expect(this.player1).not.toHavePromptButton('Done');
        this.player1.clickPrompt('Gain 1 gold');
        expect(this.player1Object.gold).toBe(4);
    });

    it('is not allowed when no choice could change the game state', function () {
        const choose = (opponentHand) =>
            GameActions.choose({
                choices: {
                    'Discard 1': {
                        gameAction: GameActions.discardAtRandom({ player: opponentHand, amount: 1 })
                    },
                    'Discard 2': {
                        gameAction: GameActions.discardAtRandom({ player: opponentHand, amount: 2 })
                    }
                }
            });

        expect(this.player2Object.hand).toHaveLength(0);
        expect(choose(this.player2Object).allow(this.context)).toBe(false);
        expect(choose(this.player1Object).allow(this.context)).toBe(false);
    });

    it('is allowed when a choice could change the game state', function () {
        const choose = GameActions.choose({
            choices: {
                'Discard 1': {
                    gameAction: GameActions.discardAtRandom({
                        player: this.player2Object,
                        amount: 1
                    })
                },
                'Gain 1 gold': {
                    gameAction: GameActions.gainGold({ player: this.player1Object, amount: 1 })
                }
            }
        });

        expect(choose.allow(this.context)).toBe(true);
    });
});
