import { Tokens } from '../../../../server/game/Constants/index.js';

describe('Tormund Giantsbane', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Tormund Giantsbane', 'Northern Refugee'] }
        });
        this.unopposedChallenge(this.player1, 'Military', this.tormundGiantsbane);
        this.player1.triggerAbility('Tormund Giantsbane');
    });

    it('places a tale token on himself, which he discards to give a Wildling +2 STR and renown', function () {
        expect(this.tormundGiantsbane.tokens[Tokens.tale]).toBe(1);
        this.player1.clickMenu(this.tormundGiantsbane, 'Give Wildling +2 STR');
        this.player1.clickCard(this.northernRefugee);
        expect(this.northernRefugee.getStrength()).toBe(
            this.northernRefugee.getPrintedStrength() + 2
        );
        expect(this.northernRefugee.hasKeyword('Renown')).toBe(true);
    });
});
