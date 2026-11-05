import { Tokens } from '../../../../server/game/Constants/index.js';

describe('Arya Stark (LMHR)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                faction: 'stark',
                hand: ['Arya Stark (LMHR)'],
                inPlay: ['Winterfell Steward'],
                gold: 5
            },
            player2: { inPlay: ['Burned Men', 'Hedge Knight', 'Bastard in Hiding'] }
        });
        this.player1.clickCard(this.aryaStark);
        this.player1.clickPrompt('Marshal');
        this.player1.triggerAbility('Arya Stark');
    });

    it("places a prayer token on up to 5 different characters you don't control after she enters play", function () {
        expect(this.player1).not.toBeAbleToSelect(this.winterfellSteward);
        this.player1.clickCard(this.burnedMen);
        this.player1.clickCard(this.hedgeKnight);
        this.player1.clickPrompt('Done');
        expect(this.burnedMen.hasToken(Tokens.prayer)).toBe(true);
        expect(this.hedgeKnight.hasToken(Tokens.prayer)).toBe(true);
        expect(this.bastardInHiding.hasToken(Tokens.prayer)).toBe(false);
    });

    describe('after the tokens are placed', function () {
        beforeEach(function () {
            this.player1.clickCard(this.burnedMen);
            this.player1.clickCard(this.hedgeKnight);
            this.player1.clickPrompt('Done');
            this.completeMarshalPhase();
        });

        it('stands Arya and draws 1 card after a character with a prayer token is killed', function () {
            this.player1.clickPrompt('Military');
            this.player1.clickCard(this.aryaStark);
            this.player1.clickPrompt('Done');
            this.player1.clickCard(this.bastardInHiding);
            this.skipActionWindow();
            this.player2.clickPrompt('Done');
            this.skipActionWindow();
            this.player2.clickCard(this.burnedMen);
            const handSize = this.player1Object.hand.length;
            this.player1.triggerAbility('Arya Stark');
            expect(this.aryaStark.kneeled).toBe(false);
            expect(this.player1Object.hand).toHaveLength(handSize + 1);
        });

        it('discards those tokens when Arya leaves play', function () {
            this.player1.clickPrompt('Done');
            this.unopposedChallenge(this.player2, 'Military', this.bastardInHiding);
            this.player1.clickCard(this.aryaStark);
            expect(this.aryaStark.location).toBe('dead pile');
            expect(this.burnedMen.hasToken(Tokens.prayer)).toBe(false);
            expect(this.hedgeKnight.hasToken(Tokens.prayer)).toBe(false);
        });
    });
});
