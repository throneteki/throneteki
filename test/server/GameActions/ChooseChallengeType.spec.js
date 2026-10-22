import ChooseChallengeType from '../../../server/game/GameActions/ChooseChallengeType.js';

describe('ChooseChallengeType', function () {
    beforeEach(function () {
        this.actions = {};
        this.gameAction = (challengeType) => {
            this.actions[challengeType] = { name: challengeType, allow: () => true };
            return this.actions[challengeType];
        };
    });

    it('offers a choice for each challenge type', function () {
        const action = new ChooseChallengeType({ gameAction: this.gameAction });
        const choices = action.createChoices(action.choicesFunc({}));

        expect(choices.map((choice) => choice.text)).toEqual(['Military', 'Intrigue', 'Power']);
        expect(choices.map((choice) => choice.gameAction)).toEqual([
            this.actions.military,
            this.actions.intrigue,
            this.actions.power
        ]);
    });

    it('leaves out the challenge type that exclude returns', function () {
        const action = new ChooseChallengeType({
            exclude: (context) => context.current,
            gameAction: this.gameAction
        });
        const choices = action.createChoices(action.choicesFunc({ current: 'intrigue' }));

        expect(choices.map((choice) => choice.text)).toEqual(['Military', 'Power']);
    });

    it('titles the prompt "Select a challenge type" by default', function () {
        expect(new ChooseChallengeType({ gameAction: this.gameAction }).title).toBe(
            'Select a challenge type'
        );
    });

    it('fills {challengeType} in the message with the chosen challenge type', function () {
        expect(
            ChooseChallengeType.messageFor('{player} prevents {challengeType} challenges', 'power')
        ).toBe('{player} prevents power challenges');
        expect(
            ChooseChallengeType.messageFor(
                { format: '{player} names {challengeType}', args: {} },
                'military'
            )
        ).toEqual({ format: '{player} names military', args: {} });
    });
});
