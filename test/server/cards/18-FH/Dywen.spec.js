describe('Dywen', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Dywen (FH)', 'Old Forest Hunter', 'Maester Wendamyr']
            },
            player2: {
                inPlay: ['Hedge Knight']
            }
        });
    });

    it('raises your reserve by 1', function () {
        expect(this.player1Object.getReserve()).toBe(7);
        expect(this.player2Object.getReserve()).toBe(6);
        expect(this.player1).isReadyToTakeAction();
    });

    it('does not kneel a Night\'s Watch character with stealth declared in a military challenge', function () {
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.dywen);
        this.player1.clickPrompt('Done');
        this.player1.clickCard(this.hedgeKnight);

        expect(this.dywen.isParticipating()).toBe(true);
        expect(this.dywen.kneeled).toBe(false);
        expect(this.oldForestHunter.kneeled).toBe(false);
        expect(this.player1).toHavePrompt('Initiate an action');
    });

    it('kneels a Night\'s Watch character without stealth', function () {
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.oldForestHunter);
        this.player1.clickPrompt('Done');

        expect(this.oldForestHunter.kneeled).toBe(true);
        expect(this.dywen.kneeled).toBe(false);
        expect(this.player1).toHavePrompt('Initiate an action');
    });

    it('kneels him outside a military challenge', function () {
        this.player1.clickPrompt('Intrigue');
        this.player1.clickCard(this.dywen);
        this.player1.clickPrompt('Done');
        this.player1.clickCard(this.hedgeKnight);

        expect(this.dywen.kneeled).toBe(true);
        expect(this.player1).toHavePrompt('Initiate an action');
    });

    it('kneels a character you control that is not Night\'s Watch', function () {
        this.player1.clickPrompt('Power');
        this.player1.clickCard(this.maesterWendamyr);
        this.player1.clickPrompt('Done');
        this.player1.clickCard(this.hedgeKnight);

        expect(this.maesterWendamyr.kneeled).toBe(true);
        expect(this.dywen.kneeled).toBe(false);
        expect(this.player1).toHavePrompt('Initiate an action');
    });
});
