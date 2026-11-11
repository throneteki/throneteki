import { Tokens } from '../../../../server/game/Constants/index.js';

describe('Vargo Hoat', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { hand: ['Vargo Hoat (FH)', 'Planky Town Trader'], gold: 10 },
            player2: { inPlay: ['Golden Company (HMW)'] }
        });
        this.player1.clickCard(this.vargoHoat);
        expect(this.player1).toHavePrompt('Select bestow amount for Vargo Hoat');
        this.player1.clickPrompt('1');
        expect(this.player1).toHavePrompt('Any reactions to Vargo Hoat entering play?');
        this.player1.triggerAbility('Vargo Hoat');
    });

    it('places 1 gold on a card with bestow after it enters play', function () {
        expect(this.vargoHoat.tokens[Tokens.gold]).toBe(2);
        this.player1.clickCard(this.plankyTownTrader);
        this.player1.clickPrompt('1');
        this.player1.triggerAbility('Vargo Hoat');
        expect(this.plankyTownTrader.tokens[Tokens.gold]).toBe(2);
    });

    it("moves 1 gold to a character and gains that character's keywords", function () {
        this.player1.clickMenu(this.vargoHoat, 'Move 1 gold to character');
        expect(this.player1).toHavePrompt('Select a character');
        this.player1.clickCard(this.goldenCompany);
        expect(this.goldenCompany.getKeywords()).toContain('renown');
        expect(this.vargoHoat.getKeywords()).toContain('renown');
        expect(this.goldenCompany.hasToken(Tokens.gold)).toBe(true);
        expect(this.vargoHoat.tokens[Tokens.gold]).toBe(1);
    });
});
