import { wouldInterruptProblems } from '../../tools/wouldInterrupts.js';

describe('would interrupts', function () {
    it('are declared with would: true wherever the card text triggers on "would"', function () {
        expect(wouldInterruptProblems()).toEqual([]);
    });
});
