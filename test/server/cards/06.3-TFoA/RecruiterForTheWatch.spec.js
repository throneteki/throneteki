describe('Recruiter for the Watch', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                plot: 'Trading with the Pentoshi',
                inPlay: ['Recruiter for the Watch'],
                hand: ['House Florent Knight', 'Yoren (Core)']
            },
            player2: { inPlay: ['Dragonstone Faithful', 'Castle Guard'], hand: ['Nightmares'] }
        });
        this.player1.togglePromptedActionWindow('taxation', true);
        this.player1.clickMenu(this.recruiterForTheWatch, 'Take control of character');
        this.player1.clickCard(this.dragonstoneFaithful);
    });

    it('kneels to take control of a character with printed cost 2 or lower', function () {
        expect(this.recruiterForTheWatch.kneeled).toBe(true);
        expect(this.dragonstoneFaithful).toBeControlledBy(this.player1);
        expect(this.player1).isReadyToTakeAction();
    });

    it('returns control when it stands', function () {
        this.completeMarshalPhase();
        this.completeChallengesPhase();

        expect(this.player1).toHavePrompt('Select optional cards to stand');
        this.player1.clickCard(this.recruiterForTheWatch);
        this.player1.clickPrompt('Done');

        expect(this.dragonstoneFaithful).toBeControlledBy(this.player2);
        expect(this.player1).isReadyToTakeAction();
    });

    it('keeps control while it stays kneeling through the standing phase', function () {
        this.completeMarshalPhase();
        this.completeChallengesPhase();
        this.player1.clickPrompt('Done');

        expect(this.recruiterForTheWatch.kneeled).toBe(true);
        expect(this.dragonstoneFaithful).toBeControlledBy(this.player1);
        expect(this.player1).isReadyToTakeAction();
    });

    it('returns control when it leaves play', function () {
        this.completeMarshalPhase();
        this.player1.clickPrompt('Done');
        this.unopposedChallenge(this.player2, 'Military', this.castleGuard);
        this.player1.clickCard(this.recruiterForTheWatch);

        expect(this.recruiterForTheWatch.location).toBe('dead pile');
        expect(this.dragonstoneFaithful).toBeControlledBy(this.player2);
        expect(this.player2).isReadyToTakeAction();
    });

    it('keeps control when it is blanked', function () {
        this.player1.clickPrompt('Done');
        this.player2.clickCard(this.nightmares);
        this.player2.clickCard(this.recruiterForTheWatch);

        expect(this.dragonstoneFaithful).toBeControlledBy(this.player1);
        expect(this.player2).isReadyToTakeAction();
    });

    it('does not return control of the character after it leaves play and is taken control of again', function () {
        this.player1.clickCard(this.houseFlorentKnight);
        this.player1.clickCard(this.dragonstoneFaithful);
        expect(this.dragonstoneFaithful.location).toBe('discard pile');

        this.player1.clickCard(this.yoren);
        this.player1.triggerAbility(this.yoren);
        this.player1.clickCard(this.dragonstoneFaithful);
        expect(this.dragonstoneFaithful).toBeControlledBy(this.player1);

        this.completeMarshalPhase();
        this.completeChallengesPhase();
        this.player1.clickCard(this.recruiterForTheWatch);
        this.player1.clickPrompt('Done');

        expect(this.dragonstoneFaithful.location).toBe('play area');
        expect(this.dragonstoneFaithful).toBeControlledBy(this.player1);
        expect(this.player1).isReadyToTakeAction();
    });
});
