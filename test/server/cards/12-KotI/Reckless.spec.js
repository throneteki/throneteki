describe('Reckless', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: [
                    { card: 'Tumblestone Knight', attachments: ['Reckless'] },
                    'Bastard in Hiding'
                ]
            },
            player2: {
                inPlay: [{ card: 'Sansa Stark (WotN)', attachments: ['Reckless'] }]
            }
        });

        this.player1.clickPrompt('Power');
        this.player1.clickCard(this.bastardInHiding);
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        this.player2.clickPrompt('Done');
        this.skipActionWindow();
    });

    it('makes the attached character attack or defend in each challenge, if able', function () {
        expect(this.game.getPlainTextLog()).toContain(
            'Tumblestone Knight is automatically declared as an attacker'
        );
        expect(this.game.getPlainTextLog()).toContain(
            'Sansa Stark is automatically declared as a defender'
        );
        expect(this.player1).isReadyToTakeAction();
    });
});
