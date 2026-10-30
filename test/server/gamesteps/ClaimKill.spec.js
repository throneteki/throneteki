describe('a kill made to satisfy military claim', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Tyrion Lannister (Core)'] },
            player2: { inPlay: ['Hedge Knight'] }
        });
        this.kills = [];
        this.game.on('onCharacterKilled', (event) => this.kills.push(event));
        this.player1.clickPrompt('Done');
        this.unopposedChallenge(this.player2, 'Military', this.hedgeKnight);
        this.player1.clickCard(this.tyrionLannister);
    });

    it('is marked as a claim kill', function () {
        expect(this.kills.map((event) => event.card)).toEqual([this.tyrionLannister]);
        expect(this.kills[0].isClaim).toBe(true);
        expect(this.player2).isReadyToTakeAction();
    });
});

describe('a kill by a card ability while military claim is applied', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { hand: ['Podrick Payne (TC)'], inPlay: ['Tyrion Lannister (Core)'], gold: 4 },
            player2: { inPlay: ['Hedge Knight'] }
        });
        this.kills = [];
        this.game.on('onCharacterKilled', (event) => this.kills.push(event));
        this.player1.clickPrompt('Done');
        this.unopposedChallenge(this.player2, 'Military', this.hedgeKnight);
        this.player1.clickCard(this.tyrionLannister);
        this.player1.triggerAbility('Podrick Payne');
        this.player1.clickPrompt('Yes');
        this.player1.clickCard(this.hedgeKnight);
    });

    it('is not marked as a claim kill', function () {
        expect(this.kills.map((event) => event.card)).toEqual([this.hedgeKnight]);
        expect(this.kills[0].isClaim).toBe(false);
        expect(this.player2).isReadyToTakeAction();
    });
});
