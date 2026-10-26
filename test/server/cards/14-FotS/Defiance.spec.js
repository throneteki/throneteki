describe('Defiance', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                hand: ['Defiance'],
                inPlay: [{ card: 'Tumblestone Knight', kneeling: true }]
            }
        });
        this.player1.clickCard(this.defiance);
        this.player1.clickCard(this.tumblestoneKnight);
    });

    it('stands a character that has not participated in a challenge this phase', function () {
        expect(this.tumblestoneKnight.kneeled).toBe(false);
        expect(this.player1).isReadyToTakeAction();
    });
});

describe('Defiance after a character joins a challenge without being declared', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                gold: 2,
                hand: ['Defiance', 'Ours is the Fury'],
                inPlay: [
                    { card: 'Bastard in Hiding', kneeling: true },
                    { card: 'Ser Davos Seaworth (TTWDFL)', kneeling: true }
                ]
            },
            player2: { inPlay: ['Castle Guard'] }
        });
        this.player1.clickPrompt('Done');
        this.player2.clickPrompt('Power');
        this.player2.clickCard(this.castleGuard);
        this.player2.clickPrompt('Done');
        this.player1.clickCard(this.oursIsTheFury);
        this.player1.clickCard(this.bastardInHiding);
        this.player2.clickPrompt('Pass');
        this.player1.clickPrompt('Pass');
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
    });

    it('cannot stand a character that participated through a card effect', function () {
        this.player1.clickCard(this.defiance);

        expect(this.player1).not.toBeAbleToSelect(this.bastardInHiding);
        expect(this.player1).toBeAbleToSelect(this.serDavosSeaworth);
        expect(this.player1).not.toBeAbleToSelect(this.castleGuard);

        this.player1.clickCard(this.serDavosSeaworth);

        expect(this.serDavosSeaworth.kneeled).toBe(false);
        expect(this.bastardInHiding.kneeled).toBe(true);
        expect(this.player2).isReadyToTakeAction();
    });
});
