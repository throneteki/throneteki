import { Linter } from 'eslint';
import { Rules } from '../../tools/cardRuleDefinitions.js';

describe('card implementation guardrails', function () {
    it('rejects generic callbacks even when their bodies contain no legacy helper', function () {
        const linter = new Linter();
        const config = { rules: { 'no-restricted-syntax': ['error', Rules['generic-handler']] } };
        expect(linter.verify('GameActions.genericHandler(() => true)', config)).toHaveLength(1);
        expect(linter.verify('GameActions.drawCards({amount: 1})', config)).toHaveLength(0);
    });

    it('rejects this passed to a game action', function () {
        const linter = new Linter();
        const config = {
            parserOptions: { ecmaVersion: 2022 },
            rules: { 'no-restricted-syntax': ['error', Rules['this-in-game-action']] }
        };
        expect(linter.verify('GameActions.standCard({ card: this })', config)).toHaveLength(1);
        expect(
            linter.verify('GameActions.sacrificeCard({ card: this }).then({})', config)
        ).toHaveLength(1);
        expect(
            linter.verify('GameActions.standCard((context) => ({ card: context.source }))', config)
        ).toHaveLength(0);
    });
});
