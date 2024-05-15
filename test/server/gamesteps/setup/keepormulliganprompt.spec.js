import KeepOrMulliganPrompt from '../../../../server/game/gamesteps/setup/keepormulliganprompt.js';

describe('the KeepOrMulliganPrompt', function () {
    beforeEach(function () {
        this.gameSpy = jasmine.createSpyObj('game', ['addMessage', 'raiseEvent']);
        this.playerSpy = jasmine.createSpyObj('player', [
            'drawCardsToHand',
            'resetDrawDeck',
            'shuffleDrawDeck'
        ]);
        this.prompt = new KeepOrMulliganPrompt(this.gameSpy);
    });

    describe('the onMenuCommand() function', function () {
        describe('when the arg is keep', function () {
            beforeEach(function () {
                this.prompt.onMenuCommand(this.playerSpy, 'keep');
            });

            it('should not mulligan the player', function () {
                expect(this.playerSpy.drawCardsToHand).not.toHaveBeenCalled();
                expect(this.playerSpy.resetDrawDeck).not.toHaveBeenCalled();
                expect(this.playerSpy.shuffleDrawDeck).not.toHaveBeenCalled();
            });

            it('should raise the onPlayerKeepHandOrMerged event', function () {
                expect(this.gameSpy.raiseEvent).toHaveBeenCalledWith(
                    'onPlayerKeepHandOrMulligan',
                    jasmine.objectContaining({ player: this.playerSpy, choice: 'keep' })
                );
            });
        });

        describe('when the arg is mulligan', function () {
            beforeEach(function () {
                this.prompt.onMenuCommand(this.playerSpy, 'mulligan');
            });

            it('should mulligan the player', function () {
                expect(this.playerSpy.drawCardsToHand).toHaveBeenCalledWith(7);
                expect(this.playerSpy.resetDrawDeck).toHaveBeenCalled();
                expect(this.playerSpy.shuffleDrawDeck).toHaveBeenCalled();
            });

            it('should raise the onPlayerKeepHandOrMerged event', function () {
                expect(this.gameSpy.raiseEvent).toHaveBeenCalledWith(
                    'onPlayerKeepHandOrMulligan',
                    jasmine.objectContaining({ player: this.playerSpy, choice: 'mulligan' })
                );
            });
        });
    });
});
