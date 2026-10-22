import { Tokens } from '../../../../server/game/Constants/index.js';

describe('Beric Dondarrion (TBWB)', function () {
    it('places 6 kiss tokens on himself after you marshal him, and gets +1 STR for each', function () {
        this.setupTest({
            phase: 'marshal',
            player1: { hand: ['Beric Dondarrion (TBWB)'], gold: 7 }
        });
        this.player1.clickCard(this.bericDondarrion);
        expect(this.bericDondarrion.tokens[Tokens.kiss]).toBe(6);
        expect(this.bericDondarrion.getStrength()).toBe(
            this.bericDondarrion.getPrintedStrength() + 6
        );
    });

    it('discards a kiss token to save himself', function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: [{ card: 'Beric Dondarrion (TBWB)', tokens: { [Tokens.kiss]: 2 } }]
            },
            player2: { inPlay: ['Hedge Knight'] }
        });
        this.player1.clickPrompt('Done');
        this.unopposedChallenge(this.player2, 'Military', this.hedgeKnight);
        this.player1.clickCard(this.bericDondarrion);
        this.player1.triggerAbility('Beric Dondarrion');
        expect(this.bericDondarrion.location).toBe('play area');
        expect(this.bericDondarrion.tokens[Tokens.kiss]).toBe(1);
    });
});
