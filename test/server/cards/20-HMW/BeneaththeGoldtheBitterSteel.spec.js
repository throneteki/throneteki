import { Tokens } from '../../../../server/game/Constants/index.js';

describe('Beneath the Gold, the Bitter Steel', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: [{ card: 'Second Sons', tokens: { [Tokens.gold]: 3 } }],
                hand: ['Beneath the Gold, the Bitter Steel (HMW)']
            }
        });
        this.player1.clickCard(this.beneathTheGoldTheBitterSteel);
        this.player1.clickCard(this.secondSons);
    });

    it('gives a Mercenary with 3 or more gold renown, insight and intimidate until the end of the phase', function () {
        expect(this.secondSons.hasKeyword('Renown')).toBe(true);
        expect(this.secondSons.hasKeyword('Insight')).toBe(true);
        expect(this.secondSons.hasKeyword('Intimidate')).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });
});
