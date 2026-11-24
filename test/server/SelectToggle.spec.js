describe('telling the client how a card click changes the selection', function () {
    beforeEach(function () {
        this.selectToggle = (wrapper) => wrapper.player.getState(wrapper.player).selectToggle;
    });

    describe('when choosing up to a number of cards', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: {
                    inPlay: ['Tyrion Lannister (Core)', 'Winterfell Steward', 'Bran Stark (Core)']
                },
                player2: { plot: 'Sneak Attack', inPlay: ['Hedge Knight'] }
            });
            this.player1.clickPrompt('Done');
            this.unopposedChallenge(this.player2, 'Military', this.hedgeKnight);
        });

        it('says a click toggles the card, up to the number to choose', function () {
            expect(this.player1).toHavePrompt('Select 2 characters to fulfill military claim');
            expect(this.selectToggle(this.player1)).toEqual({ limit: 2 });

            this.player1.clickCard(this.tyrionLannister);
            expect(this.selectToggle(this.player1)).toEqual({ limit: 2 });

            this.player1.clickCard(this.winterfellSteward);
            this.player1.clickPrompt('Done');
            this.player1.clickPrompt('Done');

            expect(this.tyrionLannister.location).toBe('dead pile');
            expect(this.winterfellSteward.location).toBe('dead pile');
            expect(this.selectToggle(this.player1)).toBeUndefined();
            expect(this.player2).isReadyToTakeAction();
        });

        it('says nothing to the player waiting', function () {
            expect(this.selectToggle(this.player2)).toBeUndefined();

            this.player1.clickCard(this.tyrionLannister);
            this.player1.clickCard(this.winterfellSteward);
            this.player1.clickPrompt('Done');
            this.player1.clickPrompt('Done');
            expect(this.player2).isReadyToTakeAction();
        });
    });

    describe('when choosing a single card', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: { inPlay: ['Tyrion Lannister (Core)', 'Winterfell Steward'] },
                player2: { inPlay: ['Hedge Knight'] }
            });
            this.player1.clickPrompt('Done');
            this.unopposedChallenge(this.player2, 'Military', this.hedgeKnight);
        });

        it('says nothing, as the click makes the choice', function () {
            expect(this.player1).toHavePrompt('Select 1 character to fulfill military claim');
            expect(this.selectToggle(this.player1)).toBeUndefined();

            this.player1.clickCard(this.tyrionLannister);

            expect(this.tyrionLannister.location).toBe('dead pile');
            expect(this.player2).isReadyToTakeAction();
        });
    });

    describe('when clicking a card uses it', function () {
        beforeEach(function () {
            this.setupTest({ phase: 'marshal', player1: { hand: ['Winterfell Steward'] } });
        });

        it('says nothing', function () {
            expect(this.selectToggle(this.player1)).toBeUndefined();

            this.player1.clickCard(this.winterfellSteward);

            expect(this.winterfellSteward.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
