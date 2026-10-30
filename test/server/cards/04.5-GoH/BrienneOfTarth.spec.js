describe('Brienne of Tarth (GoH)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Tumblestone Knight']
            },
            player2: {
                inPlay: ['Brienne of Tarth (GoH)', 'Robb Stark (AtSK)']
            }
        });

        this.player1.clickPrompt('Power');
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        this.player2.clickCard(this.brienneOfTarth);
        this.player2.clickPrompt('Done');
    });

    it('does not kneel when declared as a defender while you control a King character', function () {
        expect(this.brienneOfTarth.kneeled).toBe(false);

        this.skipActionWindow();

        expect(this.player1).isReadyToTakeAction();
    });
});

describe('Brienne of Tarth (GoH) with a facedown King attachment', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                agenda: "A Mummer's Farce",
                inPlay: ['Brienne of Tarth (GoH)', 'Jinglebell (HMW)'],
                drawDeck: ['Robb Stark (AtSK)']
            },
            player2: {
                inPlay: ['Tumblestone Knight']
            }
        });
        this.facedownKing = this.player1.findCardByName('Robb Stark (AtSK)', 'draw deck');
        this.unopposedChallenge(this.player1, 'Intrigue', this.jinglebell);
        this.completeChallengesPhase();
        this.player1.selectPlot('Filler Plot');
        this.player2.selectPlot('Filler Plot');
        this.selectFirstPlayer(this.player1);
        this.completeMarshalPhase();
    });

    it('kneels when declared as a defender, because a facedown card is not a King character', function () {
        expect(this.facedownKing.parent).toBe(this.jinglebell);
        expect(this.facedownKing.facedown).toBe(true);

        this.player1.clickPrompt('Done');
        this.player2.clickPrompt('Power');
        this.player2.clickCard(this.tumblestoneKnight);
        this.player2.clickPrompt('Done');
        this.skipActionWindow();
        this.player1.clickCard(this.brienneOfTarth);
        this.player1.clickPrompt('Done');

        expect(this.brienneOfTarth.kneeled).toBe(true);

        this.skipActionWindow();

        expect(this.player2).isReadyToTakeAction();
    });
});
