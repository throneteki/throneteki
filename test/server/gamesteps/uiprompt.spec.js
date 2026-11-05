import UiPrompt from '../../../server/game/gamesteps/uiprompt.js';

describe('the UiPrompt', function () {
    beforeEach(function () {
        this.player1 = { setPrompt: vi.fn(), cancelPrompt: vi.fn(), setIsActivePrompt: vi.fn() };
        this.player1.isPlaying = () => !this.player1.eliminated && !this.player1.left;
        this.player2 = { setPrompt: vi.fn(), cancelPrompt: vi.fn(), setIsActivePrompt: vi.fn() };
        this.player2.isPlaying = () => !this.player2.eliminated && !this.player2.left;

        this.game = { getPlayers: vi.fn(), isEmpty: vi.fn() };
        this.game.getPlayers.mockReturnValue([this.player1, this.player2]);

        this.activePrompt = {
            menuTitle: 'Do stuff',
            buttons: [{ command: 'command', text: 'Do It', arg: 'foo' }]
        };
        this.waitingPrompt = {};

        this.prompt = new UiPrompt(this.game);
        vi.spyOn(this.prompt, 'getPlayer').mockReturnValue(this.player2);
        vi.spyOn(this.prompt, 'complete').mockImplementation(() => {});
        vi.spyOn(this.prompt, 'activePrompt').mockReturnValue(this.activePrompt);
        vi.spyOn(this.prompt, 'waitingPrompt').mockReturnValue(this.waitingPrompt);
        vi.spyOn(this.prompt, 'activeCondition').mockImplementation((player) => {
            return player === this.player2;
        });
    });

    describe('the continue() function', function () {
        describe('when the prompt is incomplete', function () {
            beforeEach(function () {
                vi.spyOn(this.prompt, 'isComplete').mockReturnValue(false);
            });

            it('should set the active prompt for players meeting the active condition', function () {
                this.activePrompt.promptId = this.prompt.promptId;
                this.prompt.continue();
                expect(this.player2.setPrompt).toHaveBeenCalledWith(this.activePrompt);
            });

            it('should default the command for any buttons on the active prompt', function () {
                this.prompt.activePrompt.mockReturnValue({ buttons: [{ text: 'foo' }] });
                this.prompt.continue();
                expect(this.player2.setPrompt).toHaveBeenCalledWith({
                    buttons: [
                        { command: 'menuButton', text: 'foo', promptId: this.prompt.promptId }
                    ]
                });
            });

            it('should set the waiting prompt for players that do not meet the active condition', function () {
                this.prompt.continue();
                expect(this.player1.setPrompt).toHaveBeenCalledWith(this.waitingPrompt);
            });

            it('should return false', function () {
                expect(this.prompt.continue()).toBe(false);
            });

            describe('and the prompted player leaves', function () {
                beforeEach(function () {
                    this.player2.left = true;
                    this.prompt.continue();
                });

                it('should complete the prompt', function () {
                    expect(this.prompt.complete).toHaveBeenCalled();
                });
            });

            describe('and the prompted player is eliminated', function () {
                beforeEach(function () {
                    this.player2.eliminated = true;
                    this.prompt.continue();
                });

                it('should complete the prompt', function () {
                    expect(this.prompt.complete).toHaveBeenCalled();
                });
            });
        });

        describe('when the prompt is complete', function () {
            beforeEach(function () {
                vi.spyOn(this.prompt, 'isComplete').mockReturnValue(true);
            });

            it('should set the cancel prompts for each player', function () {
                this.prompt.continue();
                expect(this.player1.cancelPrompt).toHaveBeenCalled();
                expect(this.player2.cancelPrompt).toHaveBeenCalled();
            });

            it('should return true', function () {
                expect(this.prompt.continue()).toBe(true);
            });
        });
    });
});
