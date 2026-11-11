import { Tokens } from '../../../../server/game/Constants/index.js';

describe("Jaqen H'ghar", function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { hand: ["Jaqen H'ghar"], gold: 7 },
            player2: { inPlay: ['The Tickler', 'Arya Stark (Core)', 'Burned Men'] }
        });
        this.player1.clickCard(this.jaqenHghar);
        this.player1.triggerAbility("Jaqen H'ghar");
    });

    it('places a Valar Morghulis token on up to 3 different unique characters after he enters play', function () {
        expect(this.player1).toBeAbleToSelect(this.theTickler);
        expect(this.player1).toBeAbleToSelect(this.aryaStark);
        expect(this.player1).not.toBeAbleToSelect(this.burnedMen);
        this.player1.clickCard(this.theTickler);
        this.player1.clickPrompt('Done');
        expect(this.theTickler.hasToken(Tokens.valarmorghulis)).toBe(true);
        expect(this.aryaStark.hasToken(Tokens.valarmorghulis)).toBe(false);
    });

    describe('after the tokens are placed', function () {
        beforeEach(function () {
            this.player1.clickCard(this.theTickler);
            this.player1.clickPrompt('Done');
            this.completeMarshalPhase();
        });

        it('discards those tokens when Jaqen leaves play', function () {
            this.player1.clickPrompt('Done');
            this.unopposedChallenge(this.player2, 'Military', this.burnedMen);
            this.player1.clickCard(this.jaqenHghar);
            expect(this.jaqenHghar.location).toBe('dead pile');
            expect(this.theTickler.hasToken(Tokens.valarmorghulis)).toBe(false);
        });

        describe('and Jaqen wins a challenge attacking alone', function () {
            beforeEach(function () {
                this.unopposedChallenge(this.player1, 'Intrigue', this.jaqenHghar);
                this.player1.triggerAbility("Jaqen H'ghar");
            });

            it('kills a character with a Valar Morghulis token', function () {
                expect(this.player1).toBeAbleToSelect(this.theTickler);
                expect(this.player1).not.toBeAbleToSelect(this.aryaStark);
                this.player1.clickCard(this.theTickler);
                expect(this.theTickler.location).toBe('dead pile');
            });
        });
    });
});
