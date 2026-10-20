describe('Besieged', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                plot: 'Besieged',
                inPlay: ['Tumblestone Knight', 'Hedge Knight']
            },
            player2: {
                inPlay: ['Bastard in Hiding', { card: 'House Dayne Knight', kneeling: true }]
            }
        });

        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
    });

    it('makes the defending player declare at least one defender, if able', function () {
        this.player2.clickPrompt('Done');

        expect(this.game.currentChallenge.defenders).toEqual([]);
        expect(this.player2).toHavePrompt('Select defenders (min 1)');

        this.player2.clickCard(this.bastardInHiding);
        this.player2.clickPrompt('Done');

        expect(this.game.currentChallenge.defenders).toEqual([this.bastardInHiding]);
        expect(this.player1).toHavePrompt('Initiate an action');
    });
});

describe('Besieged, when no character can defend', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                plot: 'Besieged',
                inPlay: ['Tumblestone Knight']
            },
            player2: {
                inPlay: [{ card: 'Bastard in Hiding', kneeling: true }]
            }
        });

        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
    });

    it('lets the defending player declare no defenders', function () {
        this.player2.clickPrompt('Done');

        expect(this.game.currentChallenge.defenders).toEqual([]);
        expect(this.player1).toHavePrompt('Initiate an action');
    });
});
