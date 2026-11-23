describe("the Don't defend button", function () {
    function declarePowerAttack(plot) {
        this.setupTest({
            phase: 'challenge',
            player1: { plot, inPlay: ['Tumblestone Knight'] },
            player2: { inPlay: ['Bastard in Hiding'] }
        });
        this.player1.clickPrompt('Power');
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        this.doneButton = () =>
            this.player2.currentPrompt().buttons.find((button) => button.arg === 'done');
    }

    describe('when no minimum applies', function () {
        beforeEach(function () {
            declarePowerAttack.call(this, 'A Noble Cause');
        });

        it('replaces Done while no defenders are selected and asks for the longer press delay', function () {
            expect(this.player2).toHavePrompt('Select defenders');
            expect(this.doneButton()).toEqual(
                expect.objectContaining({ text: "Don't defend", endsTurn: true, done: true })
            );
            expect(this.player2).not.toHavePromptButton('Done');
        });

        it('becomes Done once a defender is selected, and comes back when it is deselected', function () {
            this.player2.clickCard(this.bastardInHiding);

            expect(this.doneButton().text).toBe('Done');
            expect(this.doneButton().endsTurn).toBeUndefined();

            this.player2.clickCard(this.bastardInHiding);

            expect(this.doneButton()).toEqual(
                expect.objectContaining({ text: "Don't defend", endsTurn: true })
            );
        });

        it('declares no defenders', function () {
            this.player2.clickPrompt("Don't defend");

            expect(this.bastardInHiding.isDefending()).toBe(false);
            expect(this.game.getPlainTextLog()).toContain('player2 does not defend the challenge');
            this.skipActionWindow();
            expect(this.player1).isReadyToTakeAction();
        });

        it('leaves the attackers prompt reading Done', function () {
            this.player2.clickPrompt("Don't defend");
            this.skipActionWindow();
            this.player1.clickPrompt('Done');
            this.player2.clickPrompt('Power');

            expect(this.player2).toHavePrompt('Select challenge attackers');
            expect(this.player2).toHavePromptButton('Done');
            expect(this.player2).not.toHavePromptButton("Don't defend");
        });
    });

    describe('when a minimum number of defenders applies', function () {
        beforeEach(function () {
            declarePowerAttack.call(this, 'Besieged');
        });

        it('is not offered, as declaring no defenders is not allowed', function () {
            expect(this.player2).toHavePrompt('Select defenders (min 1)');
            expect(this.player2).toHavePromptButton('Done');
            expect(this.player2).not.toHavePromptButton("Don't defend");
            expect(this.doneButton().endsTurn).toBeUndefined();
        });
    });
});
