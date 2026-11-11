import { Linter } from 'eslint';
import { Rules } from '../../tools/cardRuleDefinitions.js';

describe('card implementation guardrails', function () {
    it('rejects generic callbacks even when their bodies contain no legacy helper', function () {
        const linter = new Linter();
        const config = { rules: { 'no-restricted-syntax': ['error', Rules['generic-handler']] } };
        expect(linter.verify('GameActions.genericHandler(() => true)', config)).toHaveLength(1);
        expect(linter.verify('GameActions.drawCards({amount: 1})', config)).toHaveLength(0);
    });
});
