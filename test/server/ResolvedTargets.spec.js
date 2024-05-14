import ResolvedTargets from '../../server/game/gamesteps/ResolvedTargets.js';
import AbilityChoiceSelection from '../../server/game/AbilityChoiceSelection.js';

describe('ResolvedTargets', function () {
    beforeEach(function () {
        this.targets = new ResolvedTargets();
    });

    describe('getTargets()', function () {
        describe('when the targeting type is "select"', function () {
            beforeEach(function () {
                let choice = new AbilityChoiceSelection({
                    name: 'target',
                    choosingPlayer: 'PLAYER',
                    eligibleChoices: ['a', 'b'],
                    targetingType: 'select'
                });
                choice.resolve('b');
                this.targets.setSelections([choice]);
            });

            it('does not include it', function () {
                expect(this.targets.getTargets()).toEqual([]);
            });
        });

        describe('when the targeting type is "choose"', function () {
            beforeEach(function () {
                this.choice1 = new AbilityChoiceSelection({
                    name: 'target',
                    choosingPlayer: 'PLAYER',
                    eligibleChoices: ['a', 'b'],
                    targetingType: 'choose'
                });
                this.choice2 = new AbilityChoiceSelection({
                    name: 'target',
                    choosingPlayer: 'PLAYER',
                    eligibleChoices: ['a', 'b'],
                    targetingType: 'choose'
                });

                this.choice1.resolve('b');
            });

            describe('and the choice was rejected', function () {
                beforeEach(function () {
                    this.choice2.reject();
                    this.targets.setSelections([this.choice1, this.choice2]);
                });

                it('excludes the value', function () {
                    expect(this.targets.getTargets()).toEqual(['b']);
                });
            });

            describe('and the choice has not been resolved', function () {
                beforeEach(function () {
                    this.targets.setSelections([this.choice1, this.choice2]);
                });

                it('excludes the value', function () {
                    expect(this.targets.getTargets()).toEqual(['b']);
                });
            });

            describe('and the choice has been resovled', function () {
                beforeEach(function () {
                    this.choice2.resolve('a');
                    this.targets.setSelections([this.choice1, this.choice2]);
                });

                it('excludes the value', function () {
                    expect(this.targets.getTargets()).toEqual(['b', 'a']);
                });
            });
        });
    });
});
