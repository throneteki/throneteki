describe("King's Landing Septon", function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                faction: 'lannister',
                inPlay: [
                    "King's Landing Septon",
                    'The Riverroad',
                    { card: 'Tumblestone Knight', kneeling: true }
                ]
            },
            player2: {
                faction: 'baratheon',
                hand: ['Nightmares'],
                inPlay: ['Dragonstone Proselyte']
            }
        });
    });

    describe("when an opponent's character ability would initiate", function () {
        beforeEach(function () {
            this.player1.clickPrompt('Done');
            this.player2.clickMenu(this.dragonstoneProselyte, 'Prevent character from standing');
            this.player2.clickCard(this.tumblestoneKnight);
        });

        it('can be triggered', function () {
            expect(this.player1).toAllowAbilityTrigger(this.kingsLandingSepton);
            this.player1.clickPrompt('Pass');
            this.player2.clickPrompt('Done');
            expect(this.player1).isReadyToTakeAction();
            expect(this.player2).isReadyToTakeAction();
        });

        it('returns itself to hand to cancel the effects', function () {
            this.player1.triggerAbility(this.kingsLandingSepton);

            expect(this.kingsLandingSepton.location).toBe('hand');
            expect(this.dragonstoneProselyte.kneeled).toBe(true);

            this.player2.clickPrompt('Done');

            expect(this.tumblestoneKnight.kneeled).toBe(false);
            expect(this.player1).toHavePrompt('Select a plot');
            expect(this.player1).isReadyToTakeAction();
            expect(this.player2).isReadyToTakeAction();
        });

        it('lets the effects resolve when it is not triggered', function () {
            this.player1.clickPrompt('Pass');

            expect(this.kingsLandingSepton.location).toBe('play area');

            this.player2.clickPrompt('Done');

            expect(this.tumblestoneKnight.kneeled).toBe(true);
            expect(this.player1).toHavePrompt('Select a plot');
            expect(this.player1).isReadyToTakeAction();
            expect(this.player2).isReadyToTakeAction();
        });
    });

    describe("when an opponent's event would initiate", function () {
        beforeEach(function () {
            this.player1.clickPrompt('Done');
            this.player2.clickCard(this.nightmares);
            this.player2.clickCard(this.tumblestoneKnight);
        });

        it('cannot be triggered', function () {
            expect(this.player1).not.toAllowAbilityTrigger(this.kingsLandingSepton);
            expect(this.nightmares.location).toBe('discard pile');
            expect(this.player2).isReadyToTakeAction();
        });
    });

    describe("when its controller's own ability would initiate", function () {
        beforeEach(function () {
            this.player1.clickMenu(this.theRiverroad, 'Give a character a challenge icon');
            this.player1.clickCard(this.tumblestoneKnight);
        });

        it('cannot be triggered', function () {
            expect(this.player1).not.toAllowAbilityTrigger(this.kingsLandingSepton);
            this.player1.clickPrompt('Intrigue');

            expect(this.tumblestoneKnight.hasIcon('intrigue')).toBe(true);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
