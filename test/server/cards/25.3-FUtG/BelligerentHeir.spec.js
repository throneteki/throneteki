import { Tokens } from '../../../../server/game/Constants/index.js';

describe('Belligerent Heir', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Belligerent Heir'] },
            player2: { inPlay: ['Genna Frey'] }
        });
        this.player1.clickPrompt('Intrigue');
        this.player1.clickCard(this.belligerentHeir);
        this.player1.clickPrompt('Done');
        this.player1.triggerAbility('Belligerent Heir');
        this.player1.clickCard(this.belligerentHeir);
    });

    it('places 1 gold on an attacking neutral character, and gets +1 STR for each gold', function () {
        expect(this.belligerentHeir.tokens[Tokens.gold]).toBe(1);
        expect(this.belligerentHeir.getStrength()).toBe(
            this.belligerentHeir.getPrintedStrength() + 1
        );
    });

    it('sacrifices that character if you lose the challenge', function () {
        this.skipActionWindow();
        this.player2.clickCard(this.gennaFrey);
        this.player2.clickPrompt('Done');
        this.skipActionWindow();
        expect(this.belligerentHeir.location).toBe('discard pile');
    });
});
