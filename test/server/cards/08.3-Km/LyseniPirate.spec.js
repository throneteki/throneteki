import { Tokens } from '../../../../server/game/Constants/index.js';

describe('Lyseni Pirate', function () {
    function setup(player2, inPlay = ['Lyseni Pirate']) {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay },
            player2
        });
        this.startingGold = this.player1Object.gold;
        this.unopposedChallenge(this.player1, 'Military', this.lyseniPirate);
        this.player1.triggerAbility('Lyseni Pirate');
    }

    it('gains stealth while you control a Warship location', function () {
        setup.call(this, { gold: 1 }, ['Lyseni Pirate', 'Great Kraken']);
        expect(this.lyseniPirate.hasKeyword('stealth')).toBe(true);
    });

    it("moves 1 gold from the losing opponent's gold pool after it wins attacking", function () {
        setup.call(this, { gold: 1 });
        expect(this.player2Object.gold).toBe(0);
        expect(this.player1Object.gold).toBe(this.startingGold + 1);
    });

    it('can move it from a card that player controls instead', function () {
        setup.call(this, {
            gold: 1,
            inPlay: [{ card: 'Hedge Knight', tokens: { [Tokens.gold]: 1 } }]
        });
        this.player1.clickPrompt('Card');
        this.player1.clickCard(this.hedgeKnight);
        expect(this.hedgeKnight.hasToken(Tokens.gold)).toBe(false);
        expect(this.player2Object.gold).toBe(1);
        expect(this.player1Object.gold).toBe(this.startingGold + 1);
    });
});
