describe('Red Priest (FotS)', function () {
    beforeEach(function () {
        this.setupTest({
            player1: { faction: 'baratheon', hand: ['Red Priest (FotS)'] },
            player2: {
                inPlay: ['Hedge Knight'],
                hand: ['Ser Jaime Lannister (Core)', 'Burned Men']
            }
        });
        this.player1.clickCard(this.redPriest);
        this.player1.triggerAbility('Red Priest');
        this.player1.clickPrompt('Done');
        this.player1.clickCard(this.burnedMen);
    });

    it("looks at an opponent's hand and removes a card in it from the game", function () {
        expect(this.burnedMen.location).toBe('out of game');
        expect(this.serJaimeLannister.location).toBe('hand');
    });

    it('returns the card to hand when Red Priest leaves play', function () {
        this.completeMarshalPhase();
        this.player1.clickPrompt('Done');
        this.unopposedChallenge(this.player2, 'Military', this.hedgeKnight);
        this.player1.clickCard(this.redPriest);
        expect(this.redPriest.location).toBe('dead pile');
        expect(this.burnedMen.location).toBe('hand');
    });
});

describe('Red Priest (FotS) and Warlock of Qarth', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                faction: 'baratheon',
                hand: ['Red Priest (FotS)', 'Tumblestone Knight']
            },
            player2: {
                faction: 'targaryen',
                inPlay: ['Hedge Knight', 'Warlock of Qarth'],
                hand: ['Burned Men']
            }
        });
        this.player1.clickCard(this.redPriest);
        this.player1.triggerAbility('Red Priest');
        this.player1.clickPrompt('Done');
        this.player1.clickCard(this.burnedMen);
        this.completeMarshalPhase();
        this.player1.clickPrompt('Done');
        this.unopposedChallenge(this.player2, 'Military', this.hedgeKnight);
        this.player1.clickCard(this.redPriest);
    });

    it('returns the removed card before Warlock of Qarth takes Red Priest', function () {
        expect(this.redPriest.location).toBe('dead pile');
        expect(this.burnedMen.location).toBe('hand');
        expect(this.player2).toAllowAbilityTrigger(this.warlockOfQarth);
        this.player2.clickPrompt('Pass');
        expect(this.player2).isReadyToTakeAction();
    });

    it('keeps the second removed card out of the game until the taken Red Priest leaves play', function () {
        this.player2.triggerAbility(this.warlockOfQarth);
        this.player2.triggerAbility('Red Priest');
        this.player2.clickPrompt('Done');
        this.player2.clickCard(this.tumblestoneKnight);

        expect(this.redPriest.controller).toBe(this.player2Object);
        expect(this.burnedMen.location).toBe('hand');
        expect(this.tumblestoneKnight.location).toBe('out of game');

        this.player2.clickPrompt('Done');

        expect(this.redPriest.location).toBe('dead pile');
        expect(this.redPriest.owner).toBe(this.player1Object);
        expect(this.tumblestoneKnight.location).toBe('hand');
        expect(this.burnedMen.location).toBe('hand');
        expect(this.player1).isReadyToTakeAction();
    });
});
