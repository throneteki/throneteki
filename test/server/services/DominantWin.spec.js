import { isDominantWin } from '../../../server/services/DominantWin.js';
import { DominantWinCases } from './dominantWinCases.js';

describe('isDominantWin()', function () {
    for (const testCase of DominantWinCases) {
        it(`should ${testCase.dominant ? '' : 'not '}count ${testCase.name}`, function () {
            expect(
                isDominantWin({
                    won: testCase.won ?? true,
                    win_reason: testCase.reason,
                    power: testCase.power,
                    opponents: testCase.opponents.map((power) => ({ power }))
                })
            ).toBe(testCase.dominant);
        });
    }
});
