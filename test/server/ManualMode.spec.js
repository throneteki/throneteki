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

            it('asks only once when they ask again before the opponent answers', function () {
                this.player1.sendChat('/manual');
                this.player1.sendChat('/manual');
                this.player2.clickPrompt('Refuse');

                expect(this.player2).not.toHavePromptButton('Allow');
                expect(this.game.manualMode.enabled).toBe(false);
                expect(this.player1).isReadyToTakeAction();
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

                it('turns on without asking which card is not working', function () {
                    expect(this.game.manualMode.enabled).toBe(true);
                    expect(this.player1).isReadyToTakeAction();
                });

                it('records the request', function () {
                    expect(this.game.stats.forPlayer(this.player1.player).manualActions).toEqual([
                        expect.objectContaining({ action: 'manualModeEnabled' })
                    ]);
                });

                it('allows manual actions', function () {
                    this.player1.clickCard(this.houseMaester);

                    expect(this.houseMaester.kneeled).toBe(true);
                });

                it('can be turned off by either player without asking', function () {
                    this.player2.sendChat('/manual');

                    expect(this.game.manualMode.enabled).toBe(false);
                    expect(this.player1).not.toHavePromptButton('Allow');
                    expect(this.player1).isReadyToTakeAction();
                });

                it('can be asked for again once it has been answered', function () {
                    this.player1.sendChat('/manual');
                    this.player1.sendChat('/manual');

                    expect(this.game.manualMode.enabled).toBe(false);
                    expect(this.player2).toHavePromptButton('Allow');
                });
            });
        });
    });

    describe('when the only cards without a card file need none', function () {
        beforeEach(function () {
            setup(this, {
                agenda: 'Banner of the Dragon',
                hand: ['Burned Men', 'Undercity Spymaster']
            });
        });

        it('starts off', function () {
            expect(this.game.manualMode.enabled).toBe(false);
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

        it('names the cards that are not verified', function () {
            expect(this.game.getPlainTextLog()).toContain(
                'Manual mode is on because these cards are not verified: Lady-in-Waiting'
            );
        });
    });
});
