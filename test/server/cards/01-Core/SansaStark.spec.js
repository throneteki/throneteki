describe('Sansa Stark (Core)', function () {
    integration(function () {
        describe('when setup', function () {
            beforeEach(function () {
                const deck = this.buildDeck('baratheon', ['A Noble Cause', 'Sansa Stark (Core)']);
                this.player1.selectDeck(deck);
                this.player2.selectDeck(deck);
                this.startGame();
                this.keepStartingHands();

                this.sansa = this.player1.findCardByName('Sansa Stark', 'hand');

                this.player1.clickCard(this.sansa);
                this.completeSetup();
            });

            it('is setup standing', function () {
                expect(this.sansa.location).toBe('play area');
                expect(this.sansa.kneeled).toBe(false);
            });
        });

        describe('when marshalling', function () {
            beforeEach(function () {
                const deck = this.buildDeck('baratheon', ['A Noble Cause', 'Sansa Stark (Core)']);
                this.player1.selectDeck(deck);
                this.player2.selectDeck(deck);
                this.startGame();
                this.keepStartingHands();

                this.sansa = this.player1.findCardByName('Sansa Stark', 'hand');

                this.completeSetup();
                this.selectFirstPlayer(this.player1);

                this.player1.clickCard(this.sansa);
            });

            it('enters play knelt', function () {
                expect(this.sansa.location).toBe('play area');
                expect(this.sansa.kneeled).toBe(true);
            });
        });
    });
});

describe('Sansa Stark (Core), when she stands', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                gold: 2,
                inPlay: [
                    { card: 'Sansa Stark (Core)', kneeling: true },
                    { card: 'Tumblestone Knight', kneeling: true },
                    'Magister Illyrio (Core)'
                ]
            },
            player2: {
                inPlay: ['Ranging Party']
            }
        });
    });

    it('gains 1 power for your faction', function () {
        this.player1.clickMenu(this.magisterIllyrio, 'Stand a character');
        this.player1.clickCard(this.sansaStark);
        this.player1.triggerAbility(this.sansaStark);

        expect(this.sansaStark.kneeled).toBe(false);
        expect(this.player1Object.faction.power).toBe(1);
        expect(this.player2Object.faction.power).toBe(0);
        expect(this.game.getPlainTextLog()).toContain(
            'player1 uses Sansa Stark to gain 1 power for their faction'
        );
        expect(this.player1).isReadyToTakeAction();
    });

    it('cannot be triggered when another character stands', function () {
        this.player1.clickMenu(this.magisterIllyrio, 'Stand a character');
        this.player1.clickCard(this.tumblestoneKnight);

        expect(this.player1).not.toAllowAbilityTrigger(this.sansaStark);
        expect(this.player1Object.faction.power).toBe(0);
        expect(this.player1).isReadyToTakeAction();
    });

    it('can only be triggered once per round', function () {
        this.player1.clickMenu(this.magisterIllyrio, 'Stand a character');
        this.player1.clickCard(this.sansaStark);
        this.player1.triggerAbility(this.sansaStark);
        this.unopposedChallenge(this.player1, 'Intrigue', this.sansaStark);
        this.player1.clickPrompt('Apply Claim');

        expect(this.sansaStark.kneeled).toBe(true);
        expect(this.player1Object.faction.power).toBe(2);

        this.completeChallengesPhase();

        expect(this.sansaStark.kneeled).toBe(false);
        expect(this.player1Object.faction.power).toBe(2);
        expect(this.game.currentPhase).toBe('plot');
        expect(this.player1).toHavePrompt('Select a plot');
    });
});
