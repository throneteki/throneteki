import ManualMode from '../../server/game/ManualMode.js';

describe('manual mode', function () {
    const VerifiedPlots = { plot: 'Confiscation', plotDeck: ['Confiscation', 'Confiscation'] };

    function setup(context, player1 = {}) {
        context.setupTest({
            gameOptions: { manualMode: 'auto' },
            player1: { ...VerifiedPlots, inPlay: ['House Maester'], ...player1 },
            player2: { ...VerifiedPlots }
        });
    }

    describe('when every card in the game is verified', function () {
        beforeEach(function () {
            setup(this);
        });

        it('starts off', function () {
            expect(this.game.manualMode.enabled).toBe(false);
            expect(this.game.getState(this.player1.player.name).manualMode).toBe(false);
        });

        it('refuses manual actions', function () {
            this.player1.clickCard(this.houseMaester);
            this.player1.sendChat('/draw 2');

            expect(this.houseMaester.kneeled).toBe(false);
            expect(this.player1.player.hand).toHaveLength(0);
            expect(this.game.stats.forPlayer(this.player1.player).manualActions).toEqual([]);
            expect(this.player1).isReadyToTakeAction();
        });

        it('refuses manual actions without a message', function () {
            const gold = this.player1.player.gold;
            this.player1.clickCard(this.houseMaester);
            this.player1.sendChat('/draw 2');
            this.game.changeStat(this.player1.player.name, 'gold', 1);

            expect(this.player1.player.gold).toBe(gold);
            expect(this.game.getPlainTextLog()).not.toContain('manual mode is off.');
            expect(this.game.getPlainTextLog()).not.toContain('/draw');
            expect(this.player1).isReadyToTakeAction();
        });

        it('can be asked for with the manual mode command', function () {
            this.game.commands.toggleManualMode(this.player1.player.name);
            this.game.continue();

            expect(this.player2).toHavePromptButton('Allow');
            expect(this.player2).toHavePromptButton('Refuse');
        });

        it('can be turned on without opponent approval after the game ends', function () {
            this.game.gameOverHandler.isGameOver = true;

            this.game.manualMode.request(this.player1.player);

            expect(this.game.manualMode.enabled).toBe(true);
            expect(this.player2).not.toHavePromptButton('Allow');
            expect(this.player1).not.toHavePrompt(
                "Select the card that isn't working, if there is one"
            );
        });

        describe('and a player asks to turn it on', function () {
            beforeEach(function () {
                this.player1.sendChat('/manual');
            });

            it('asks their opponent', function () {
                expect(this.player2).toHavePromptButton('Allow');
                expect(this.player2).toHavePromptButton('Refuse');
                expect(this.game.manualMode.enabled).toBe(false);
            });

            describe('and the opponent refuses', function () {
                beforeEach(function () {
                    this.player2.clickPrompt('Refuse');
                });

                it('stays off', function () {
                    expect(this.game.manualMode.enabled).toBe(false);
                    expect(this.player1).isReadyToTakeAction();
                });
            });

            describe('and the opponent agrees', function () {
                beforeEach(function () {
                    this.player2.clickPrompt('Allow');
                });

                it('turns on, and asks which card is not working', function () {
                    expect(this.game.manualMode.enabled).toBe(true);
                    expect(this.player1).toHavePrompt(
                        "Select the card that isn't working, if there is one"
                    );
                });

                it('records the request with the card the player picks', function () {
                    this.player1.clickCard(this.houseMaester);

                    expect(this.game.stats.forPlayer(this.player1.player).manualActions).toEqual([
                        expect.objectContaining({
                            action: 'manualModeEnabled',
                            cards: [{ code: '03041', name: 'House Maester' }]
                        })
                    ]);
                    expect(this.player1).isReadyToTakeAction();
                });

                it('allows manual actions', function () {
                    this.player1.clickPrompt('Done');
                    this.player1.clickCard(this.houseMaester);

                    expect(this.houseMaester.kneeled).toBe(true);
                });
            });
        });
    });

    describe('when a card in the game is not verified', function () {
        beforeEach(function () {
            const isVerified = ManualMode.isVerified;
            vi.spyOn(ManualMode, 'isVerified').mockImplementation(
                (cardData) => cardData.name !== 'Lady-in-Waiting' && isVerified(cardData)
            );
            setup(this, { hand: ['Lady-in-Waiting'] });
        });

        afterEach(function () {
            vi.restoreAllMocks();
        });

        it('starts on', function () {
            expect(this.game.manualMode.enabled).toBe(true);
        });
    });
});
